/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getSupabaseServerClient } from '../supabase/server'
import { logger } from '../logger'

export async function getPools() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('pools')
      .select(`
        *,
        products (
          name,
          description,
          base_image,
          category
        ),
        pool_tiers (
          min_qty,
          buyer_price
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching pools:', error)
      return []
    }

    return data
  } catch (error) {
    logger.error('Error in getPools', error)
    return []
  }
}

export async function getPoolById(id: string): Promise<any> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('pools')
      .select(`
        id,
        status,
        target_quantity,
        current_quantity,
        deadline,
        created_at,
        product_id,
        products (
          id,
          name,
          description,
          category,
          base_image
        ),
        pool_tiers (
          id,
          pool_id,
          min_qty,
          max_qty,
          buyer_price,
          logistics_fee
        )
      `)
      .eq('id', id)
      .maybeSingle()

    if (error) {
      logger.error('Error fetching pool by id:', error)
      return null
    }

    if (!data) return null

    if (data.pool_tiers) {
      data.pool_tiers.sort((a: any, b: any) => a.min_qty - b.min_qty)
    }

    const product = Array.isArray(data.products) ? data.products[0] : data.products
    return {
      ...data,
      products: product,
    }
  } catch (error) {
    logger.error('Error in getPoolById', error)
    return null
  }
}
