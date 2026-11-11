import { createClient } from '@supabase/supabase-js'
import { logger } from './logger'

export interface PlatformStats {
  activePoolsCount: number
  verifiedSuppliersCount: number
  totalCategoriesCount: number
  avgSavingsPercent: number
}

/**
 * Fetches real, DB-driven statistics for the platform.
 * Uses anon key with fallback-safe error handling.
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        activePoolsCount: 0,
        verifiedSuppliersCount: 0,
        totalCategoriesCount: 0,
        avgSavingsPercent: 0,
      }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch active pools with products and tiers
    const { data: pools, error: poolsError } = await supabase
      .from('pools')
      .select(`
        id,
        status,
        products (
          id,
          category
        ),
        pool_tiers (
          buyer_price
        )
      `)
      .eq('status', 'active')

    if (poolsError) {
      logger.error('Error fetching pools for stats:', poolsError)
      return {
        activePoolsCount: 0,
        verifiedSuppliersCount: 0,
        totalCategoriesCount: 0,
        avgSavingsPercent: 0,
      }
    }

    const activePools = pools || []
    const activePoolsCount = activePools.length

    // Distinct categories across active pools
    const categoriesSet = new Set<string>()
    const discounts: number[] = []

    for (const pool of activePools) {
      // Products relation can be object or array
      const product = Array.isArray(pool.products) ? pool.products[0] : pool.products
      const category = product?.category?.trim()
      if (category) {
        categoriesSet.add(category)
      }

      // Calculate max pool discount available for this pool
      const tiers = pool.pool_tiers || []
      const prices = tiers
        .map((t: { buyer_price: number }) => Number(t.buyer_price))
        .filter((price: number) => !isNaN(price) && price > 0)

      if (prices.length > 1) {
        const highestPrice = Math.max(...prices)
        const lowestPrice = Math.min(...prices)
        if (highestPrice > 0 && lowestPrice < highestPrice) {
          const discountPercent = Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
          discounts.push(discountPercent)
        }
      }
    }

    const totalCategoriesCount = categoriesSet.size

    // Highest discount % currently available across active pools
    const avgSavingsPercent = discounts.length > 0 ? Math.max(...discounts) : 0

    // Check if a suppliers/factories table exists in DB, otherwise safely return 0
    let verifiedSuppliersCount = 0
    try {
      const { count } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'verified')

      if (count && count > 0) {
        verifiedSuppliersCount = count
      }
    } catch {
      // suppliers table does not exist in schema (supplier logic is managed offline)
      verifiedSuppliersCount = 0
    }

    return {
      activePoolsCount,
      verifiedSuppliersCount,
      totalCategoriesCount,
      avgSavingsPercent,
    }
  } catch (error) {
    logger.error('Error calculating platform stats:', error)
    return {
      activePoolsCount: 0,
      verifiedSuppliersCount: 0,
      totalCategoriesCount: 0,
      avgSavingsPercent: 0,
    }
  }
}

