import { createClient } from '@supabase/supabase-js'

export interface PlatformStats {
  activePoolsCount: number
  totalCategoriesCount: number
  avgSavingsPercent: number
}

/**
 * Fetches real, DB-driven statistics for the platform.
 * Fully hardened against network, RLS, timeout, and numeric anomalies.
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  const fallbackStats: PlatformStats = {
    activePoolsCount: 0,
    totalCategoriesCount: 0,
    avgSavingsPercent: 0,
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return fallbackStats
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
      console.error('Error fetching pools for stats:', poolsError)
      return fallbackStats
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

      // Hardened calculation:
      // Return 0 / skip if:
      // - tier array is empty or has fewer than 2 tiers
      // - highest_tier_price is 0, null, undefined, negative, or not a number
      // - result is not finite (Number.isFinite)
      // - result is less than 0 or greater than 100
      const tiers = pool.pool_tiers || []
      if (!Array.isArray(tiers) || tiers.length < 2) {
        continue
      }

      const prices = tiers
        .map((t: { buyer_price: number }) => Number(t.buyer_price))
        .filter((price: number) => typeof price === 'number' && Number.isFinite(price) && price > 0)

      if (prices.length < 2) {
        continue
      }

      const highestPrice = Math.max(...prices)
      const lowestPrice = Math.min(...prices)

      if (
        typeof highestPrice !== 'number' ||
        !Number.isFinite(highestPrice) ||
        highestPrice <= 0 ||
        lowestPrice < 0
      ) {
        continue
      }

      if (lowestPrice < highestPrice) {
        const rawDiscount = ((highestPrice - lowestPrice) / highestPrice) * 100
        if (Number.isFinite(rawDiscount) && rawDiscount > 0 && rawDiscount <= 100) {
          const discountPercent = Math.round(rawDiscount)
          if (discountPercent > 0 && discountPercent <= 100) {
            discounts.push(discountPercent)
          }
        }
      }
    }

    const totalCategoriesCount = categoriesSet.size

    // Highest discount % currently available across active pools
    const avgSavingsPercent =
      discounts.length > 0 && Number.isFinite(Math.max(...discounts))
        ? Math.max(...discounts)
        : 0

    return {
      activePoolsCount,
      totalCategoriesCount,
      avgSavingsPercent,
    }
  } catch (error) {
    console.error('Error calculating platform stats:', error)
    return fallbackStats
  }
}
