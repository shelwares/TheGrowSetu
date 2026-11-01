'use client'

import { createProduct } from '@/lib/actions/admin'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import ImageLightbox from '@/components/ui/ImageLightbox'
import { ZoomIn, Loader2 } from 'lucide-react'

export default function NewProductPage() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isPending = isSubmitting
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit')
      e.target.value = ''
      return
    }

    // Store file in state and create local preview for UI only
    setSelectedFile(file)
    setImageUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let finalBaseImage = imageUrl

      // 1. Upload file if selected using API route (fetch)
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        const uploadData = await uploadRes.json()

        if (!uploadRes.ok || !uploadData.publicUrl) {
          const errorMsg = uploadData.error || 'Failed to upload image'
          console.error('[NewProductPage] Image upload failed:', errorMsg)
          setError(errorMsg)
          toast.error(errorMsg)
          setIsSubmitting(false)
          return // Stop submission if upload fails
        }

        finalBaseImage = uploadData.publicUrl
        setImageUrl(uploadData.publicUrl)
        setSelectedFile(null)
      } else {
        // Ensure no blob: URLs are ever sent to the database
        if (finalBaseImage && finalBaseImage.startsWith('blob:')) {
          finalBaseImage = ''
        }
      }

      // 2. Prepare data for create action
      const submitData = new FormData()
      submitData.append('name', name)
      submitData.append('category', category)
      submitData.append('description', description)
      submitData.append('base_image', finalBaseImage || '')

      // 3. Call create action
      const result = await createProduct(submitData)
      if (result?.error) {
        console.error('[NewProductPage] Create product failed:', result.error)
        setError(result.error)
        toast.error(result.error)
      }
    } catch (err: unknown) {
      console.error('[NewProductPage] Error during form submission:', err)
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Product Name *</label>
            <input
              name="name"
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Cotton T-Shirt"
              disabled={isPending}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Category</label>
            <input
              name="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Apparel, Electronics, Home Goods"
              disabled={isPending}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product specifications, materials, etc."
              disabled={isPending}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Product Image</label>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  disabled={isPending}
                  onChange={handleFileChange}
                  className="block w-full sm:w-auto text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer disabled:opacity-60 cursor-pointer"
                />
                {selectedFile && !isPending && (
                  <span className="text-xs text-indigo-600 font-medium">Ready to upload on save</span>
                )}
                {isPending && selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading &amp; Saving...</span>
                  </div>
                )}
              </div>

              <div>
                <input
                  name="base_image"
                  type="url"
                  value={selectedFile ? '' : imageUrl}
                  onChange={(e) => {
                    setSelectedFile(null)
                    setImageUrl(e.target.value)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  placeholder={selectedFile ? "File selected for upload (clear or remove to paste URL)" : "Or paste image URL (https://...)"}
                  disabled={isPending}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Image Preview & Lightbox trigger */}
          {imageUrl && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300 relative group">
                  <img
                    src={imageUrl}
                    alt={name || 'Product preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700">
                    {selectedFile ? 'Local Preview (Will upload on save)' : 'Image Preview'}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-sm">
                    {selectedFile ? selectedFile.name : imageUrl}
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
                    setSelectedFile(null)
                    setImageUrl('')
                    if (fileInputRef.current) fileInputRef.current.value = ''
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
              disabled={isPending}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  {selectedFile ? 'Uploading & Saving...' : 'Adding Product...'}
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
        src={imageUrl}
        alt={name || 'Product preview'}
      />
    </div>
  )
}
