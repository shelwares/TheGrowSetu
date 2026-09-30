import { getPools } from '@/lib/actions/pool'
import PoolCard from '@/components/PoolCard'

export const metadata = {
  title: 'Active Pools | TheGrowSetu',
  description: 'Browse all active manufacturing pools and join to get factory direct pricing.',
}

export default async function PoolsPage() {
  const pools = await getPools()

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">All Active Pools</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Discover all currently active product pools. Join early to help drive the price down, and secure your inventory before the pool closes.
          </p>
        </div>

        {pools && pools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📦</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No active pools right now</h3>
            <p className="text-slate-500 max-w-md mx-auto text-lg">We are sourcing new products and negotiating with manufacturers. Check back soon for new pools!</p>
          </div>
        )}
      </div>
    </div>
  )
}
