'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '../supabase/server'
import { logger } from '../logger'
import { getProductRequests as fetchAdminProductRequests } from './admin'
import {
  ProductRequestSchema,
  type ProductRequestRecord,
} from '../product-request-types'

export async function submitProductRequest(formData: FormData | Record<string, unknown>) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Authentication required. Please sign in to submit a request.' }
    }

    let rawData: Record<string, unknown>
    if (formData instanceof FormData) {
      rawData = {
        product_name: formData.get('product_name'),
        quantity: formData.get('quantity'),
        timeline: formData.get('timeline'),
        additional_details: formData.get('additional_details') ?? '',
      }
    } else {
      rawData = formData
    }

    const validation = ProductRequestSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input data'
      logger.warn('Product request validation failed', { errors: validation.error.issues })
      return { error: firstError }
    }

    const { product_name, quantity, timeline, additional_details } = validation.data

    const { data, error } = await supabase
      .from('product_requests')
      .insert({
        buyer_id: user.id,
        product_name,
        quantity,
        timeline,
        additional_details: additional_details || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      logger.error('Error inserting product request', error)
      return { error: 'Failed to submit product request. Please try again.' }
    }

    revalidatePath('/request-product')
    revalidatePath('/admin/requests')
    return { success: true, data }
  } catch (error) {
    logger.error('Unexpected error in submitProductRequest', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function getBuyerProductRequests(): Promise<ProductRequestRecord[]> {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('product_requests')
      .select('*')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching buyer product requests', error)
      return []
    }

    return (data as ProductRequestRecord[]) || []
  } catch (error) {
    logger.error('Unexpected error in getBuyerProductRequests', error)
    return []
  }
}

export async function getProductRequests() {
  return fetchAdminProductRequests()
}
