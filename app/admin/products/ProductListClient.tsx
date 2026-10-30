'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Pencil, ZoomIn, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { deleteProduct } from '@/lib/actions/admin'
import ImageLightbox from '@/components/ui/ImageLightbox'

interface ProductListClientProps {
  products: any[]
}

export default function ProductListClient({ products }: ProductListClientProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null)

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
    <>
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
                <td className="px-6 py-4 font-semibold text-slate-900">
                  <div className="flex items-center gap-3">
                    {p.base_image ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage({ src: p.base_image, alt: p.name })}
                        className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 group hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer"
                        title="Click to zoom image"
                      >
                        <img
                          src={p.base_image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ZoomIn size={14} />
                        </div>
                      </button>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <ImageIcon size={16} />
                      </div>
                    )}
                    <span>{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                    {p.category || 'General'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{p.description || '—'}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {new Date(p.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/pools/new?product_id=${p.id}`}
                      className="text-xs font-medium text-amber-600 hover:text-amber-700 mr-1"
                    >
                      Launch Pool →
                    </Link>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      title="Edit product"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deletingId === p.id}
                      title="Delete product"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {deletingId === p.id ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
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

      <ImageLightbox
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        src={previewImage?.src}
        alt={previewImage?.alt}
      />
    </>
  )
}
