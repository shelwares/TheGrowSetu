import type { Metadata } from 'next'
import { getPools } from '@/lib/actions/pool'
import PoolsDirectoryClient from './PoolsDirectoryClient'

export const metadata: Metadata = {
  title: 'Active Pools — Join Bulk Orders at Factory Prices',
  description: 'Browse all active product pools. Join with any quantity, pool demand with other buyers, unlock factory pricing.',
  alternates: {
    canonical: 'https://thegrowsetu.com/pools',
  },
}

export default async function PoolsPage() {
  const pools = (await getPools()) || []

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 font-display tracking-tight">
            All Active Pools
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
            Discover all currently active product pools. Join early to help drive the price down, and secure your inventory before the pool closes.
          </p>
        </div>

        <PoolsDirectoryClient initialPools={pools} />
      </div>
    </div>
  )
}
