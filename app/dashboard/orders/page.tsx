/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyOrders } from '@/lib/actions/dashboard'
import { getActivePoolsByProduct } from '@/lib/actions/pool'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  joined:    'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped:   'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default async function MyOrdersPage() {
  const [orders, activePoolsMap] = await Promise.all([
    getMyOrders(),
    getActivePoolsByProduct(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-500 text-sm mt-1">All pools you have joined.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="font-bold text-slate-900 text-xl mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">Browse active pools and join one to get factory-direct pricing.</p>
          <Link href="/pools" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700">
            Browse Active Pools
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-medium">
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Qty</th>
                <th className="px-6 py-3 text-left">Unit Price</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order: any) => {
                const product = order.pools?.products
                const total = (order.quantity * order.unit_price_at_join) + (order.logistics_fee_applied || 0)
                const poolStatus = (order.pools?.status || '').toLowerCase()
                const orderStatus = (order.status || '').toLowerCase()
                const isEligibleForReorder =
                  ['completed', 'fulfilled', 'delivered'].includes(poolStatus) ||
                  orderStatus === 'delivered'

                const productId = order.pools?.product_id || product?.id
                const activePoolId = productId ? activePoolsMap[productId] : null
                const reorderHref = activePoolId
                  ? `/pool/${activePoolId}`
                  : `/request-product?product=${encodeURIComponent(product?.name || '')}`

                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-sm flex-shrink-0">📦</div>
                        <span className="font-medium text-slate-900 max-w-[180px] truncate">
                          {product?.name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{order.quantity}</td>
                    <td className="px-6 py-4 text-slate-700">₹{order.unit_price_at_join}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">₹{total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-700'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link href={`/dashboard/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-700 font-medium text-xs">
                          View →
                        </Link>
                        {isEligibleForReorder && (
                          <Link
                            href={reorderHref}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            title={activePoolId ? 'Join active pool for this product' : 'Request new pool for this product'}
                          >
                            <span>🔄</span>
                            <span>Reorder</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
