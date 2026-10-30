'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateProduct } from '@/lib/actions/admin'
import ImageLightbox from '@/components/ui/ImageLightbox'
import { ZoomIn, ImageIcon } from 'lucide-react'

interface Product {
  id: string
  name: string
  description?: string | null
  category?: string | null
  base_image?: string | null
}

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>(product.base_image || '')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await updateProduct(product.id, formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      } else {
        toast.success(`"${formData.get('name') || product.name}" updated successfully!`)
        router.push('/admin/products')
        router.refresh()
      }
    } catch {
      const msg = 'An unexpected error occurred while updating the product.'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Product Name *
          </label>
          <input
            name="name"
            required
            type="text"
            defaultValue={product.name}
            placeholder="e.g. Premium Cotton T-Shirt"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Category
          </label>
          <input
            name="category"
            type="text"
            defaultValue={product.category || ''}
            placeholder="e.g. Apparel, Electronics, Home Goods"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={product.description || ''}
            placeholder="Describe the product specifications, materials, etc."
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1.5">
            Base Image URL
          </label>
          <input
            name="base_image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        {/* Image Preview & Lightbox trigger */}
        {imageUrl && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300 relative group">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700">Image Preview</p>
                <p className="text-xs text-slate-500 truncate max-w-sm">{imageUrl}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              Full Preview
            </button>
          </div>
        )}

        <div className="pt-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
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
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Lightbox for preview */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src={imageUrl}
        alt={product.name}
      />
    </div>
  )
}
