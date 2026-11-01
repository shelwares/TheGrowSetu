'use server'

import { getSupabaseServerClient } from '../supabase/server'
import { logger } from '../logger'

export async function uploadProductImage(formData: FormData): Promise<{ publicUrl?: string; error?: string }> {
  try {
    const file = formData.get('file') as File | null
    if (!file || typeof file === 'string' || file.size === 0) {
      return { error: 'No file provided' }
    }

    // Handle file size limits (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return { error: 'File size exceeds 5MB limit' }
    }

    if (!file.type.startsWith('image/')) {
      return { error: 'Only image files are allowed' }
    }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    const supabase = await getSupabaseServerClient()

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      logger.error('Error uploading product image to Supabase storage', error)
      return { error: error.message || 'Failed to upload image' }
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data?.path || fileName)

    return { publicUrl: urlData.publicUrl }
  } catch (error: any) {
    logger.error('Unexpected error in uploadProductImage', error)
    return { error: error?.message || 'An unexpected error occurred during upload' }
  }
}
