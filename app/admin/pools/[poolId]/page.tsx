import { getAdminPool, updatePoolStatus } from "@/lib/actions/admin";
import Link from "next/link";
import { notFound } from "next/navigation";

const STATUS_OPTIONS = ["active", "manufacturing", "fulfilled", "cancelled"];

export default async function AdminPoolDetailPage({
  params,
}: {
  params: Promise<{ poolId: string }>;
}) {
  const { poolId } = await params;
  const pool = await getAdminPool(poolId);
  if (!pool) return notFound();

  const pct = Math.min(
    100,
    Math.round((pool.current_quantity / pool.target_quantity) * 100)
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/pools" className="text-slate-500 hover:text-slate-700 text-sm">
          ← Back to Pools
        </Link>
        <Link
          href={`/admin/pools/${poolId}/buyers`}
          className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View Buyers →
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">{pool.products?.name}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {pool.products?.category || "—"} • Pool ID: {pool.id.slice(0, 8)}...
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Pool Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase mb-1">Target Quantity</p>
            <p className="font-semibold text-slate-900">{pool.target_quantity} units</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase mb-1">Current Quantity</p>
            <p className="font-semibold text-slate-900">{pool.current_quantity} units</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase mb-1">Deadline</p>
            <p className="font-semibold text-slate-900">{new Date(pool.deadline).toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase mb-1">Created</p>
            <p className="font-semibold text-slate-900">{new Date(pool.created_at).toLocaleDateString("en-IN")}</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Progress</span>
            <span>{pool.current_quantity} / {pool.target_quantity} ({pct}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Pricing Tiers</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500 uppercase font-medium">
              <th className="px-6 py-3 text-left">Min Qty</th>
              <th className="px-6 py-3 text-left">Price / pc (₹)</th>
              <th className="px-6 py-3 text-left">Logistics (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(pool.pool_tiers || []).map((tier: { id: string; min_qty: number; buyer_price: number; logistics_fee?: number }) => (
              <tr key={tier.id}>
                <td className="px-6 py-3 font-semibold text-slate-900">{tier.min_qty}+</td>
                <td className="px-6 py-3 text-slate-700">₹{tier.buyer_price}</td>
                <td className="px-6 py-3 text-slate-700">₹{tier.logistics_fee || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Update Pool Status</h2>
        <form
          action={async (formData: FormData) => {
            "use server";
            const status = formData.get("status") as string;
            await updatePoolStatus(pool.id, status);
          }}
          className="flex items-center gap-4"
        >
          <select
            name="status"
            defaultValue={pool.status}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Status
          </button>
        </form>
      </div>
    </div>
  );
}