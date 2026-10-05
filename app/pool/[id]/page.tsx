import type { Metadata } from 'next'
import { getPoolById } from '@/lib/actions/pool'
import { notFound } from 'next/navigation'
import PoolDetailClient from './PoolDetailClient'
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/structured-data'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const pool = await getPoolById(id)

  if (!pool) {
    return { title: 'Pool Not Found' }
  }

  const product = pool.products
  const progressPercentage = pool.target_quantity > 0
    ? Math.min(100, Math.round((pool.current_quantity / pool.target_quantity) * 100))
    : 0

  // Count unique buyers from current_quantity approximation
  // The buyer_count isn't directly on pool — use current_quantity as fallback
  const tiers: Array<{ buyer_price: number; min_qty: number }> = pool.pool_tiers ?? []
  const prices = tiers.map((t) => t.buyer_price).filter((p) => p > 0)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0

  const title = product
    ? `${product.name} Pool — ${progressPercentage}% Complete`
    : 'Pool Detail'

  const description = product
    ? `Pool demand with other buyers for ${product.name}. Pool: ${pool.current_quantity}/${pool.target_quantity} pcs. Price from ₹${minPrice}/piece.`
    : 'Join this buying pool on TheGrowSetu to get factory-level pricing.'

  return {
    title,
    description,
    alternates: {
      canonical: `https://thegrowsetu.com/pool/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://thegrowsetu.com/pool/${id}`,
      images: product?.base_image
        ? [{ url: product.base_image, alt: product.name }]
        : [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TheGrowSetu Pool' }],
    },
  }
}

export default async function PoolDetailPage({ params }: PageProps) {
  const { id } = await params
  const pool = await getPoolById(id)

  if (!pool) {
    notFound()
  }

  const product = pool.products
  const tiers: Array<{ buyer_price: number; min_qty: number; max_qty: number }> = pool.pool_tiers ?? []

  const breadcrumbItems = [
    { name: 'Home', url: 'https://thegrowsetu.com' },
    { name: 'Active Pools', url: 'https://thegrowsetu.com/pools' },
    { name: product?.name ?? 'Pool Detail', url: `https://thegrowsetu.com/pool/${id}` },
  ]

  return (
    <>
      {product && (
        <ProductSchema product={product} pricingTiers={tiers} />
      )}
      <BreadcrumbSchema items={breadcrumbItems} />
      <PoolDetailClient pool={pool} />
    </>
  )
}
