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

    // Ensure arrayBuffer is used
    const arrayBuffer = await file.arrayBuffer()

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('[STORAGE_UPLOAD_ERROR] Supabase upload failed:', error)
      logger.error('Error uploading product image to Supabase storage', {
        message: error.message,
        name: error.name,
        details: error,
      })
      return { error: error.message || 'Failed to upload image' }
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data?.path || fileName)

    if (!urlData?.publicUrl) {
      return { error: 'Failed to generate public URL for uploaded image' }
    }

    return { publicUrl: urlData.publicUrl }
  } catch (error: unknown) {
    console.error('[STORAGE_ACTION_ERROR] Unexpected error in uploadProductImage:', error)
    return { error: error instanceof Error ? error.message : 'Failed to upload image' }
  }
}
