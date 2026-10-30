/* eslint-disable @typescript-eslint/no-explicit-any */
// Server Component — data fetched on the server, no useEffect waterfall on mobile
import { getAdminPools } from "@/lib/actions/admin";
import Link from "next/link";
import AdminPoolsClient from "./AdminPoolsClient";

export default async function AdminPoolsPage() {
  const pools = await getAdminPools();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pools</h1>
          <p className="text-slate-500 text-sm mt-1">{pools.length} pools total</p>
        </div>
        <Link href="/admin/pools/new" className="px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600">
          + Launch Pool
        </Link>
      </div>

      {pools.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="font-bold text-slate-900 mb-1">No pools yet</h3>
          <p className="text-slate-500 text-sm mb-4">Launch your first buying pool.</p>
          <Link href="/admin/pools/new" className="inline-block px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600">
            Launch Pool
          </Link>
        </div>
      ) : (
        <AdminPoolsClient pools={pools} />
      )}
    </div>
  );
}