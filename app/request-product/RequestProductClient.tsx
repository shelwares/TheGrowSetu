'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { submitProductRequest } from '@/lib/actions/product-request'
import {
  TIMELINE_OPTIONS,
  type ProductRequestRecord,
} from '@/lib/product-request-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  Package,
  Clock,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react'

interface RequestProductClientProps {
  initialRequests: ProductRequestRecord[]
  buyerName?: string
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: string }
> = {
  pending: {
    label: 'Pending Review',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    icon: '⏳',
  },
  reviewing: {
    label: 'Under Review',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    icon: '🔍',
  },
  sourced: {
    label: 'Pool Sourced',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    icon: '✅',
  },
  rejected: {
    label: 'Not Feasible',
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-700',
    icon: '✕',
  },
}

export default function RequestProductClient({
  initialRequests,
  buyerName,
}: RequestProductClientProps) {
  const router = useRouter()
  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState<number | ''>('')
  const [timeline, setTimeline] = useState<string>(TIMELINE_OPTIONS[0])
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = productName.trim()
    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Please enter a valid product name (at least 2 characters).')
      return
    }

    const numericQty = Number(quantity)
    if (!quantity || isNaN(numericQty) || numericQty <= 0) {
      toast.error('Required quantity must be a positive number greater than 0.')
      return
    }

    if (!timeline) {
      toast.error('Please select your preferred delivery timeline.')
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.set('product_name', trimmedName)
      formData.set('quantity', String(numericQty))
      formData.set('timeline', timeline)
      formData.set('additional_details', additionalDetails.trim())

      const res = await submitProductRequest(formData)

      if (res.error) {
        toast.error(res.error)
        return
      }

      toast.success('Your product request has been submitted successfully! Our sourcing team will review demand.')
      setProductName('')
      setQuantity('')
      setTimeline(TIMELINE_OPTIONS[0])
      setAdditionalDetails('')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/pools"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary-600 hover:text-brand-primary-700 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Browse Live Pools
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary-500/20 text-brand-primary-300 border border-brand-primary-400/30 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Demand Aggregation Sourcing
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mb-3">
              Request a Custom Product
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {buyerName ? `Hello, ${buyerName}. ` : ''}Can&apos;t find what you need in existing pools? Submit your demand specifications. When buyer volumes align, our team launches a dedicated manufacturing pool to unlock factory-level rates for everyone.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-brand-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Main Grid: Form + Instructions/Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow hover:translate-y-0">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-6">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-primary-600" />
                  Product Demand Details
                </CardTitle>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  All requests are reviewed directly by TheGrowSetu procurement team.
                </p>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="product_name"
                      className="block text-sm font-semibold text-slate-800"
                    >
                      Product Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="product_name"
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. 100ml Matte Black Frosted Perfume Bottle with Atomizer"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-50 transition-all"
                    />
                    <p className="text-xs text-slate-500">
                      Include specific dimensions, finish, or material if known.
                    </p>
                  </div>

                  {/* Quantity & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-semibold text-slate-800"
                      >
                        Required Quantity (Units) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={quantity}
                        onChange={(e) => {
                          const val = e.target.value
                          setQuantity(val === '' ? '' : Math.max(1, parseInt(val, 10) || 1))
                        }}
                        placeholder="e.g. 500"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-50 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="timeline"
                        className="block text-sm font-semibold text-slate-800"
                      >
                        Timeline <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="timeline"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-50 transition-all pr-10"
                        >
                          {TIMELINE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                          <Clock className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="additional_details"
                      className="block text-sm font-semibold text-slate-800"
                    >
                      Additional Details / Requirements
                    </label>
                    <textarea
                      id="additional_details"
                      rows={4}
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      placeholder="Specify target unit cost, packaging preferences, certifications needed (e.g. ISO, GMP), delivery city, or any reference link."
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-50 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Demand Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Product Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* How It Works Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-brand-primary-600" />
                How Demand Aggregation Works
              </h2>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">You Submit Demand</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Tell us the item, required quantity, and timeline your business needs.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Admin Demand Aggregation</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Our procurement team groups matching buyer requests into a unified factory order.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Pool Launch &amp; Sourcing</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      A live buying pool is created at tier-1 factory pricing with low minimum commitments.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 text-indigo-900">
              <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-indigo-950">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Zero Obligation Sourcing
              </div>
              <p className="text-xs text-indigo-800/90 leading-relaxed">
                Submitting a product request does not charge your account. You only pay when you choose to join the official buying pool once rates are negotiated.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Requests Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Submitted Requests</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Track the status of your previously requested products.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200/80 text-slate-700 rounded-full">
              {initialRequests.length} {initialRequests.length === 1 ? 'request' : 'requests'}
            </span>
          </div>

          {initialRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No requests submitted yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Fill out the form above to let us know what products you want to buy at factory MOQ rates.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Product</th>
                      <th className="py-3.5 px-4 font-semibold">Quantity</th>
                      <th className="py-3.5 px-4 font-semibold">Timeline</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold">Details</th>
                      <th className="py-3.5 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {initialRequests.map((req) => {
                      const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending
                      return (
                        <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {req.product_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">
                            {req.quantity.toLocaleString()} units
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {req.timeline}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text}`}
                            >
                              <span>{cfg.icon}</span>
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs max-w-xs truncate">
                            {req.additional_details || '—'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(req.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
