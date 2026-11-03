import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import sharp from 'sharp'
import { logger } from '@/lib/logger'

// Strictly allowed MIME types - SVG deliberately excluded (XSS risk)
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
type AllowedMime = typeof ALLOWED_MIME_TYPES[number]

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch { /* read-only context */ }
          },
        },
      }
    )

    // 1. Auth - must be logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Authorization - must be admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      logger.warn('Non-admin upload attempt blocked', { userId: user.id })
      return NextResponse.json({ error: 'Forbidden: admin access required' }, { status: 403 })
    }

    // 3. Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || typeof file === 'string' || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 4. Strict size check (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }

    // 5. Strict MIME type allowlist (client-supplied type - additional sharp validation below)
    if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMime)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      )
    }

    // 6. Process with sharp - validates binary content and converts to WebP
    //    This rejects SVGs, HTML files, and other files masquerading as images.
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    let webpBuffer: Buffer
    try {
      webpBuffer = await sharp(inputBuffer)
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer()
    } catch {
      logger.warn('Upload rejected: sharp could not process file (not a valid image)', { userId: user.id })
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 })
    }

    // 7. Generate safe filename - always .webp, no user-supplied extension
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`

    // 8. Upload processed WebP to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, webpBuffer, {
        contentType: 'image/webp',
        upsert: false,
      })

    if (uploadError) {
      logger.error('Supabase storage upload failed', uploadError)
      return NextResponse.json({ error: uploadError.message || 'Upload failed' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to generate public URL' }, { status: 500 })
    }

    return NextResponse.json({ publicUrl })
  } catch (error: unknown) {
    logger.error('Unexpected error in /api/upload', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
