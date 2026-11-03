"use client";

import { createPool, getAdminProducts } from "@/lib/actions/admin";
import Link from "next/link";
import { useState, useEffect, use } from "react";

export default function NewPoolPage({
  searchParams,
}: {
  searchParams: Promise<{ product_id?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);
  const [tiers, setTiers] = useState([{ min_qty: 0, max_qty: 100, buyer_price: 0, logistics_fee: 0 }]);

  useEffect(() => {
    getAdminProducts().then(setProducts);
  }, []);

  const addTier = () => {
    const last = tiers[tiers.length - 1];
    setTiers([
      ...tiers,
      {
        min_qty: last.max_qty + 1,
        max_qty: last.max_qty + 100,
        buyer_price: 0,
        logistics_fee: 0,
      },
    ]);
  };

  const removeTier = (index: number) => {
    if (tiers.length <= 1) return;
    const newTiers = tiers.filter((_, i) => i !== index);
    setTiers(newTiers);
  };

  const updateTier = (index: number, field: string, value: number | string) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/pools" className="text-slate-500 hover:text-slate-700 text-sm">
          ← Back to Pools
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Launch New Pool</h1>
      </div>

      <form
        action={async (formData: FormData) => {
          formData.append("tier_count", tiers.length.toString());
          tiers.forEach((t, i) => {
            formData.append(`tier_min_${i + 1}`, t.min_qty.toString());
            formData.append(`tier_price_${i + 1}`, t.buyer_price.toString());
            formData.append(`tier_logistics_${i + 1}`, t.logistics_fee.toString());
          });
          await createPool(formData);
        }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Pool Details</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700">Product</label>
            <select
              name="product_id"
              defaultValue={resolvedSearchParams.product_id || ""}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              required
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Target Quantity</label>
            <input
              name="target_quantity"
              type="number"
              min="1"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Deadline</label>
            <input
              name="deadline"
              type="datetime-local"
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              required
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Pricing Tiers</h2>
            <button
              type="button"
              onClick={addTier}
              className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
            >
              + Add Tier
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase font-medium">
                <th className="px-4 py-2 text-left">Min</th>
                <th className="px-4 py-2 text-left">Max</th>
                <th className="px-4 py-2 text-left">Price (₹)</th>
                <th className="px-4 py-2 text-left">Logistics (₹)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((t, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={t.min_qty}
                      onChange={(e) => updateTier(i, "min_qty", parseInt(e.target.value))}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={t.max_qty}
                      onChange={(e) => updateTier(i, "max_qty", parseInt(e.target.value))}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={t.buyer_price}
                      onChange={(e) => updateTier(i, "buyer_price", parseFloat(e.target.value))}
                      className="w-20 border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={t.logistics_fee}
                      onChange={(e) => updateTier(i, "logistics_fee", parseFloat(e.target.value))}
                      className="w-20 border rounded px-2 py-1"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeTier(i)}
                      className="text-red-500 text-xs hover:text-red-700"
                      disabled={tiers.length <= 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-indigo-950 font-bold px-6 py-3 rounded-lg text-lg transition"
        >
          Launch Pool 🚀
        </button>
      </form>
    </div>
  );
}
