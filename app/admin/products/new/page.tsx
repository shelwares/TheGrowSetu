'use client'

import { createProduct } from '@/lib/actions/admin'
import { uploadProductImage } from '@/lib/actions/storage'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import ImageLightbox from '@/components/ui/ImageLightbox'
import { ZoomIn, Loader2 } from 'lucide-react'

export default function NewProductPage() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('') // Supabase public URL or pasted URL only
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null) // Local preview for UI only
  const [name, setName] = useState('')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit')
      e.target.value = ''
      return
    }

    // Create a local preview URL strictly for UI display while uploading
    const objectUrl = URL.createObjectURL(file)
    setLocalPreviewUrl(objectUrl)

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await uploadProductImage(formData)
      if (res.error) {
        toast.error(res.error)
        // On failure, revert local preview
        setLocalPreviewUrl(null)
      } else if (res.publicUrl) {
        // On success, set base_image state to the Supabase public URL (not the blob URL)
        setImageUrl(res.publicUrl)
        setLocalPreviewUrl(null)
        toast.success('Image uploaded successfully')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during upload'
      toast.error(msg)
      setLocalPreviewUrl(null)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  async function handleSubmit(formData: FormData) {
    if (isSubmitting || isUploading) return
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await createProduct(formData)
      if (result?.error) setError(result.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const activePreview = localPreviewUrl || imageUrl

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-slate-500 hover:text-slate-700 text-sm">← Back</Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
        <p className="text-slate-500 text-sm mt-1">Add a product to the catalog to use in pools.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{error}</div>
        )}
        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Product Name *</label>
            <input
              name="name"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Cotton T-Shirt"
              disabled={isSubmitting || isUploading}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Category</label>
            <input
              name="category"
              type="text"
              placeholder="e.g. Apparel, Electronics, Home Goods"
              disabled={isSubmitting || isUploading}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the product specifications, materials, etc."
              disabled={isSubmitting || isUploading}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Product Image</label>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  disabled={isSubmitting || isUploading}
                  onChange={handleFileUpload}
                  className="block w-full sm:w-auto text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer disabled:opacity-60 cursor-pointer"
                />
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading to Supabase Storage...</span>
                  </div>
                )}
              </div>

              <div>
                <input
                  name="base_image"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value)
                    setLocalPreviewUrl(null)
                  }}
                  placeholder="Or paste image URL (https://...)"
                  disabled={isSubmitting || isUploading}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Image Preview & Lightbox trigger */}
          {activePreview && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300 relative group">
                  <img
                    src={activePreview}
                    alt={name || 'Product preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700">
                    {localPreviewUrl ? 'Local Preview (Uploading)' : 'Image Preview'}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-sm">
                    {isUploading ? 'Uploading file...' : (imageUrl || 'Local file selected')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  Full Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('')
                    setLocalPreviewUrl(null)
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Uploading Image...
                </>
              ) : isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding Product...
                </>
              ) : (
                'Create Product'
              )}
            </button>
            <Link href="/admin/products" className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src={activePreview}
        alt={name || 'Product preview'}
      />
    </div>
  )
}

