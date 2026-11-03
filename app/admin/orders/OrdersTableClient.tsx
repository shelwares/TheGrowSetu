'use client'

import { logger } from '@/lib/logger'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { updateOrderStatus } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = ["joined", "confirmed", "qc_passed", "shipped", "delivered", "cancelled"];

function formatAddress(profile: any): string {
  if (!profile) return '';
  const parts = [
    profile.address_line1,
    profile.address_line2,
    profile.area,
    profile.city,
    profile.district,
    profile.state,
    profile.pincode,
    profile.country,
  ].filter(Boolean);
  return parts.join(', ');
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      logger.error('Copy failed', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-1 inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-600 transition-colors"
      title={label ? `Copy ${label}` : 'Copy'}
    >
      {copied ? (
        <>
          <span className="text-green-600">✓</span>
          <span className="text-green-600">Copied</span>
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default function OrdersTableClient({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusChange(orderId: string, newStatus: string) {
    setLoadingId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setLoadingId(null);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-medium">
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Buyer Name</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Address</th>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Qty</th>
            <th className="px-4 py-3 text-left">Total</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {initialOrders.length === 0 && (
            <tr>
              <td colSpan={9} className="px-6 py-4 text-center text-slate-500">No orders found.</td>
            </tr>
          )}
          {initialOrders.map((order: any) => {
            const total = order.quantity * order.unit_price_at_join + (order.logistics_fee_applied || 0);
            return (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 font-mono text-xs text-slate-500">
                  <div className="flex items-center">
                    <span>{order.id.slice(0, 8)}...</span>
                    <CopyButton text={order.id} label="Order ID" />
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900">
                  <div className="flex items-center">
                    <span>{order.profiles?.full_name || '—'}</span>
                    {order.buyer_id && <CopyButton text={order.buyer_id} label="Buyer ID" />}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {order.profiles?.phone ? (
                    <div className="flex items-center">
                      <a href={`tel:${order.profiles.phone}`} className="text-indigo-600 hover:underline">
                        {order.profiles.phone}
                      </a>
                      <CopyButton text={order.profiles.phone} label="Phone" />
                    </div>
                  ) : (
                    <span className="text-red-500">Missing</span>
                  )}
                </td>
                <td className="px-4 py-4 text-slate-600 text-xs max-w-[250px]">
                  {order.profiles?.address_line1 ? (
                    <div className="flex items-start gap-1">
                      <span className="truncate" title={formatAddress(order.profiles)}>
                        {formatAddress(order.profiles)}
                      </span>
                      <CopyButton text={formatAddress(order.profiles)} label="Full Address" />
                    </div>
                  ) : (
                    <span className="text-red-500">Missing</span>
                  )}
                </td>
                <td className="px-4 py-4 text-slate-600 text-xs">
                  {order.profiles?.company_name || '—'}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {order.pools?.products?.name || '—'}
                </td>
                <td className="px-4 py-4 text-slate-700">{order.quantity}</td>
                <td className="px-4 py-4 font-semibold text-slate-900">
                  ₹{total.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-4">
                  <select
                    disabled={loadingId === order.id}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}