import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || typeof file === 'string' || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Ignore cookie mutations if in read-only context
            }
          },
        },
      }
    )

    // Verify user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const fileExt = file.name?.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('[API_UPLOAD_ERROR] Supabase storage upload failed:', uploadError)
      return NextResponse.json({ error: uploadError.message || 'Upload failed' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to generate public URL' }, { status: 500 })
    }

    return NextResponse.json({ publicUrl })
  } catch (error: any) {
    console.error('[API_UPLOAD_ERROR] Unexpected error in /api/upload:', error)
    return NextResponse.json({ error: error?.message || 'Upload failed' }, { status: 500 })
  }
}
