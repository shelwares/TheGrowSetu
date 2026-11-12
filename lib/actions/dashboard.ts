'use server'

import { getSupabaseServerClient } from '../supabase/server'
import { logger } from '../logger'

export async function getMyOrders() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('pool_orders')
      .select(`
        *,
        pools (
          id,
          product_id,
          target_quantity,
          current_quantity,
          status,
          deadline,
          products (
            id,
            name,
            description,
            base_image,
            category
          )
        )
      `)
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching orders:', error)
      return []
    }

    return data || []
  } catch (error) {
    logger.error('Error in getMyOrders', error)
    return []
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('pool_orders')
      .select(`
        *,
        pools (
          *,
          products (*)
        ),
        profiles (
          phone,
          company_name,
          address
        )
      `)
      .eq('id', orderId)
      .eq('buyer_id', user.id)
      .single()

    if (error) {
      logger.error('Error fetching order details:', error)
      return null
    }

    return data
  } catch (error) {
    logger.error('Error in getOrderDetails', error)
    return null
  }
}

export async function getDashboardStats() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { totalOrders: 0, activeOrders: 0, totalSpent: 0 }

    const { data, error } = await supabase
      .from('pool_orders')
      .select('quantity, unit_price_at_join, logistics_fee_applied, status')
      .eq('buyer_id', user.id)

    if (error || !data) return { totalOrders: 0, activeOrders: 0, totalSpent: 0 }

    const totalOrders = data.length
    const activeOrders = data.filter(o => ['joined', 'confirmed'].includes(o.status)).length
    const totalSpent = data
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.quantity * o.unit_price_at_join) + (o.logistics_fee_applied || 0), 0)

    return { totalOrders, activeOrders, totalSpent }
  } catch (error) {
    logger.error('Error in getDashboardStats', error)
    return { totalOrders: 0, activeOrders: 0, totalSpent: 0 }
  }
}
