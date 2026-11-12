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
        ),
        pool_orders (
          buyer_id,
          status
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching pools:', error)
      return []
    }

    return (data || []).map((pool: any) => {
      const activeOrders = (pool.pool_orders || []).filter((o: any) => o.status !== 'cancelled')
      const uniqueBuyers = new Set(activeOrders.map((o: any) => o.buyer_id)).size
      return {
        ...pool,
        buyers_count: uniqueBuyers,
      }
    })
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
        ),
        pool_orders (
          buyer_id,
          status
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
    const activeOrders = (data.pool_orders || []).filter((o: any) => o.status !== 'cancelled')
    const uniqueBuyers = new Set(activeOrders.map((o: any) => o.buyer_id)).size

    return {
      ...data,
      products: product,
      buyers_count: uniqueBuyers,
    }
  } catch (error) {
    logger.error('Error in getPoolById', error)
    return null
  }
}

/**
 * Returns a dictionary of { [productId]: activePoolId }
 * Allows single-query lookup for reordering past products.
 */
export async function getActivePoolsByProduct(): Promise<Record<string, string>> {
  try {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('pools')
      .select('id, product_id')
      .eq('status', 'active')

    if (error || !data) return {}

    const map: Record<string, string> = {}
    data.forEach((p: { id: string; product_id?: string | null }) => {
      if (p.product_id) {
        map[p.product_id] = p.id
      }
    })
    return map
  } catch (err) {
    logger.error('Error in getActivePoolsByProduct:', err)
    return {}
  }
}
