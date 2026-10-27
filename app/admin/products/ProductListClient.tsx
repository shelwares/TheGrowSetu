'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteProduct } from '@/lib/actions/admin'

interface ProductListClientProps {
  products: any[]
}

export default function ProductListClient({ products }: ProductListClientProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(productId: string, productName: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(productId)
    try {
      const result = await deleteProduct(productId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(`"${productName}" has been deleted.`)
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-medium">
            <th className="px-6 py-3 text-left">Product</th>
            <th className="px-6 py-3 text-left">Category</th>
            <th className="px-6 py-3 text-left">Description</th>
            <th className="px-6 py-3 text-left">Created</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p: any) => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-900">{p.name}</td>
              <td className="px-6 py-4">
                <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                  {p.category || 'General'}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{p.description || '—'}</td>
              <td className="px-6 py-4 text-slate-500 text-xs">{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/pools/new?product_id=${p.id}`}
                    className="text-xs font-medium text-amber-600 hover:text-amber-700"
                  >
                    Launch Pool →
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={deletingId === p.id}
                    title="Delete product"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === p.id ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
