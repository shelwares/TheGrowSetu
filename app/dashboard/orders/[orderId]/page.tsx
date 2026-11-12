import { getOrderDetails } from "@/lib/actions/dashboard";
import { getActivePoolsByProduct } from "@/lib/actions/pool";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = await params;
  const [order, activePoolsMap] = await Promise.all([
    getOrderDetails(resolvedParams.orderId),
    getActivePoolsByProduct(),
  ]);

  if (!order) {
    notFound();
  }

  const total = order.quantity * order.unit_price_at_join + order.logistics_fee_applied;
  const poolStatus = (order.pools?.status || '').toLowerCase();
  const orderStatus = (order.status || '').toLowerCase();
  const isEligibleForReorder =
    ['completed', 'fulfilled', 'delivered'].includes(poolStatus) ||
    orderStatus === 'delivered';

  const product = order.pools?.products;
  const productId = order.pools?.product_id || product?.id;
  const activePoolId = productId ? activePoolsMap[productId] : null;
  const reorderHref = activePoolId
    ? `/pool/${activePoolId}`
    : `/request-product?product=${encodeURIComponent(product?.name || '')}`;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link href="/dashboard/orders" className="text-indigo-600 text-sm">
        ← Back to Orders
      </Link>
      <h1 className="text-2xl font-bold mt-4">Order Details</h1>

      <div className="bg-white rounded-xl shadow-sm border p-6 mt-4 space-y-4">
        <div className="flex justify-between">
          <span>Product</span>
          <span className="font-semibold">{product?.name || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span>Quantity</span>
          <span>{order.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span>Unit Price</span>
          <span>₹{order.unit_price_at_join}</span>
        </div>
        <div className="flex justify-between">
          <span>Logistics Fee</span>
          <span>₹{order.logistics_fee_applied}</span>
        </div>
        <div className="flex justify-between border-t pt-4 font-bold">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between pt-2">
          <span>Status</span>
          <span className="capitalize bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {order.status}
          </span>
        </div>
      </div>

      {isEligibleForReorder && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-emerald-950 text-sm">Need to replenish stock for this product?</p>
            <p className="text-emerald-700 text-xs mt-0.5">
              {activePoolId
                ? 'A new buying pool is currently open for this product.'
                : 'Request a new pool to unlock factory-direct wholesale pricing.'}
            </p>
          </div>
          <Link
            href={reorderHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
          >
            <span>🔄</span>
            <span>Reorder this Product</span>
          </Link>
        </div>
      )}
    </div>
  );
}
