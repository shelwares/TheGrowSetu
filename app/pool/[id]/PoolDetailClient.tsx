'use client'

import { logger } from '@/lib/logger'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import PricingSlabsTable from '@/components/PricingSlabsTable'
import { getCurrentPrice, joinPool } from '@/lib/actions/order'
import { isProfileComplete } from '@/lib/actions/profile'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FadeIn } from '@/components/motion/fade-in'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Minus, Plus, Lock, Clock, ImageIcon, ZoomIn, Zap } from 'lucide-react'
import ImageLightbox from '@/components/ui/ImageLightbox'

function formatRemainingTime(deadlineStr: string | null | undefined): { text: string; isUrgent: boolean; isClosed: boolean } {
  if (!deadlineStr) return { text: 'Ongoing', isUrgent: false, isClosed: false }
  const deadline = new Date(deadlineStr)
  if (isNaN(deadline.getTime())) return { text: 'Ongoing', isUrgent: false, isClosed: false }
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()
  if (diffMs <= 0) return { text: 'Closed', isUrgent: true, isClosed: true }
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 1) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    if (hours > 0 && hours <= 12) {
      return { text: `🔥 Closing in ${hours}h!`, isUrgent: true, isClosed: false }
    }
    return { text: '🔥 Closing Tomorrow!', isUrgent: true, isClosed: false }
  }
  if (days <= 3) {
    return { text: `🔥 Closing in ${days} days!`, isUrgent: true, isClosed: false }
  }
  return { text: `Pool Closes in ${days} Days`, isUrgent: false, isClosed: false }
}

export default function PoolDetailClient({ pool }: { pool: any }) {
  const [quantity, setQuantity] = useState<number>(pool.pool_tiers?.[0]?.min_qty || 1)
  const [projectedPrice, setProjectedPrice] = useState<number>(pool.pool_tiers?.[0]?.buyer_price || 0)
  const [logisticsFee, setLogisticsFee] = useState<number>(0)
  const [isJoining, setIsJoining] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  
  const { user } = useAuth()
  const router = useRouter()
  
  const product = pool.products
  const imageUrl = product?.base_image?.trim()
  const hasValidImage = Boolean(imageUrl && !imageError)
  const progressPercentage = Math.min(100, Math.round((pool.current_quantity / pool.target_quantity) * 100))
  const buyersCount = typeof pool.buyers_count === 'number' ? pool.buyers_count : 0
  const urgency = formatRemainingTime(pool.deadline)

  // Calculate Next Tier Discount info
  const sortedTiers: Array<{ min_qty: number; buyer_price: number }> = (pool.pool_tiers || [])
    .slice()
    .sort((a: any, b: any) => a.min_qty - b.min_qty)

  const currentPoolQty = pool.current_quantity || 0
  const nextTier = sortedTiers.find((t) => t.min_qty > currentPoolQty)
  const pcsToNextTier = nextTier ? nextTier.min_qty - currentPoolQty : null

  useEffect(() => {
    // Debounce or directly call the server action to get the accurate price
    // Since we also have the tiers locally, we could just calculate it locally as well to save network requests,
    // but the prompt asked to use React useState + useEffect that calls getCurrentPrice.
    let isMounted = true
    
    const fetchPrice = async () => {
      const res = await getCurrentPrice(pool.id, quantity)
      if (!isMounted) return;
      if (!res) {
        setProjectedPrice(0)
        setLogisticsFee(0)
        return;
      }
      setProjectedPrice(res.buyer_price)
      setLogisticsFee(res.logistics_fee)
    }
    
    // basic debounce
    const timeout = setTimeout(fetchPrice, 300)
    return () => {
      isMounted = false
      clearTimeout(timeout)
    }
  }, [pool.id, quantity])

  const handleJoinPool = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push(`/auth/login?next=/pool/${pool.id}`)
      return
    }

    setIsJoining(true)

    // Check if profile is complete
    const complete = await isProfileComplete();
    if (!complete) {
      toast.error('Please complete your profile (name, phone, address) before joining a pool.');
      router.push(`/dashboard/profile?required=1&next=/pool/${pool.id}`);
      setIsJoining(false);
      return;
    }

    const result = await joinPool(pool.id, quantity)
    
    if (result.error) {
      logger.warn('CLIENT: joinPool returned error', { error: result.error });
      toast.error(result.error || 'Failed to join pool');
      setIsJoining(false)
    } else if (result.orderId) {
      router.replace(`/checkout/${result.orderId}`)
      router.refresh()
    }
  }

  return (
    <div className="bg-ink-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-3 space-y-6">
            <FadeIn>
              {/* Image */}
              <div
                className={`aspect-video bg-ink-100 rounded-2xl overflow-hidden border border-ink-200 shadow-sm relative group ${
                  hasValidImage ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (hasValidImage) setIsLightboxOpen(true)
                }}
                role={hasValidImage ? 'button' : undefined}
                tabIndex={hasValidImage ? 0 : undefined}
                onKeyDown={(e) => {
                  if (hasValidImage && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    setIsLightboxOpen(true)
                  }
                }}
                aria-label={hasValidImage ? 'View full screen product image' : undefined}
              >
                {!hasValidImage ? (
                  <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm font-medium">No Image Available</span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={imageUrl!}
                      alt={product?.name || 'Product image'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                      onError={() => setImageError(true)}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="bg-black/60 text-white px-3.5 py-2 rounded-full backdrop-blur-sm shadow-lg flex items-center gap-2 text-xs font-medium">
                        <ZoomIn className="w-4 h-4" />
                        <span>View Full Screen</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Meta row */}
              <div className="flex items-center justify-between">
                <Badge className="bg-brand-primary-50 text-brand-primary-700 border-0">
                  {product?.category || 'General'}
                </Badge>
                <span
                  className={`text-sm font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    urgency.isUrgent
                      ? urgency.isClosed
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                      : 'text-warning'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {urgency.text}
                </span>
              </div>

              {/* Title & description */}
              <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 font-display tracking-tight">{product?.name}</h1>
              <p className="text-lg text-ink-600 leading-relaxed">{product?.description}</p>
            </FadeIn>

            {/* Progress */}
            <FadeIn delay={0.1}>
              <Card className="p-6">
                <div className="flex justify-between items-end mb-3">
                  <h3 className="font-semibold text-ink-900 font-display">Pool Progress</h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-brand-primary-700">{progressPercentage}%</span>
                    <span className="text-sm text-ink-500 ml-2">Funded</span>
                  </div>
                </div>
                <div className="w-full bg-ink-100 rounded-full h-3 overflow-hidden">
                  {shouldReduceMotion ? (
                    <div
                      className="bg-brand-primary-500 h-full rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  ) : (
                    <motion.div
                      className="bg-brand-primary-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-sm text-ink-600 mt-3 font-medium">
                  <span>{pool.current_quantity.toLocaleString()} units committed</span>
                  <span>Goal: {pool.target_quantity.toLocaleString()} units</span>
                </div>

                {/* Social Proof FOMO Badge */}
                <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between">
                  {buyersCount > 0 ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-brand-primary-700 border border-brand-primary-100/80 shadow-xs">
                      <span>👥</span>
                      <span>{buyersCount} {buyersCount === 1 ? 'buyer has' : 'buyers have'} joined this pool</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs">
                      <span>✨</span>
                      <span>Be the first to join this pool!</span>
                    </div>
                  )}
                </div>
              </Card>
            </FadeIn>

            {/* Pricing slabs */}
            <FadeIn delay={0.2} className="space-y-3">
              <PricingSlabsTable tiers={pool.pool_tiers} currentPoolQty={pool.current_quantity || 0} buyerQty={quantity} />
              
              {/* Next Tier Discount Badge */}
              {pcsToNextTier && nextTier ? (
                <div className="flex items-center gap-2.5 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl text-amber-900 text-sm font-medium shadow-sm">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-white shrink-0">
                    <Zap className="w-4 h-4 fill-white" />
                  </span>
                  <span>
                    <strong>Only {pcsToNextTier.toLocaleString()} pcs</strong> needed to unlock the next tier at{' '}
                    <strong className="text-amber-950 font-bold">₹{nextTier.buyer_price}/pc</strong>!
                  </span>
                </div>
              ) : sortedTiers.length > 0 ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Maximum tier unlocked! You are securing the lowest factory price.</span>
                </div>
              ) : null}
            </FadeIn>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <FadeIn direction="left">
                <Card className="p-6 space-y-6">
                  <h3 className="text-2xl font-bold text-ink-900 font-display">Join this Pool</h3>

                  <form onSubmit={handleJoinPool} className="space-y-5">
                    {/* Quantity +/- */}
                    <div>
                      <label className="block text-sm font-semibold text-ink-900 mb-3">
                        Quantity Required
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(q => Math.max(pool.pool_tiers?.[0]?.min_qty || 1, q - 1))}
                          className="w-11 h-11 rounded-lg border border-ink-200 bg-white text-ink-700 hover:bg-ink-100 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min={pool.pool_tiers?.[0]?.min_qty || 1}
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                          className="flex-1 h-11 px-4 text-lg font-semibold text-center border border-ink-300 rounded-lg focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-11 h-11 rounded-lg border border-ink-200 bg-white text-ink-700 hover:bg-ink-100 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {pool.pool_tiers?.[0]?.min_qty && (
                        <p className="text-xs text-ink-500 mt-2">
                          Minimum: {pool.pool_tiers[0].min_qty} units
                        </p>
                      )}
                    </div>

                    {/* Estimated Cost */}
                    <div className="bg-ink-50 rounded-xl p-5 space-y-3 border border-ink-100">
                      <h4 className="font-semibold text-ink-900 border-b border-ink-100 pb-3">Estimated Cost</h4>

                      <div className="flex justify-between text-sm">
                        <span className="text-ink-600">Price / unit</span>
                        <span className="font-medium text-ink-900">₹{projectedPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-600">Subtotal ({quantity} units)</span>
                        <span className="font-medium text-ink-900">₹{(quantity * projectedPrice).toLocaleString()}</span>
                      </div>
                      
                      {/* Logistics row — skip background-color animation on reduced motion (heavy GPU property) */}
                      <div
                        className={`flex justify-between px-2 py-1 -mx-2 rounded-md transition-colors duration-300 ${
                          logisticsFee === 0
                            ? 'bg-emerald-500/10'
                            : logisticsFee <= 25
                            ? 'bg-amber-500/10'
                            : 'bg-red-500/8'
                        }`}
                      >
                        <span className="text-ink-600">Logistics</span>
                        <span
                          className={`font-medium ${
                            logisticsFee === 0
                              ? "text-emerald-700"
                              : logisticsFee <= 25
                              ? "text-amber-700"
                              : "text-red-700"
                          }`}
                        >
                          {logisticsFee === 0 ? "Free 🎉" : `₹${logisticsFee}`}
                        </span>
                      </div>

                      <div className="pt-4 border-t border-ink-200 flex justify-between items-end">
                        <span className="font-bold text-ink-900">Total</span>
                        {shouldReduceMotion ? (
                          <span className="text-2xl font-bold text-ink-900 font-display">
                            ₹{((quantity * projectedPrice) + logisticsFee).toLocaleString()}
                          </span>
                        ) : (
                          <motion.span
                            key={quantity + projectedPrice}
                            initial={{ scale: 1.1, color: '#4F46E5' }}
                            animate={{ scale: 1, color: '#1C1917' }}
                            className="text-2xl font-bold text-ink-900 font-display"
                          >
                            ₹{((quantity * projectedPrice) + logisticsFee).toLocaleString()}
                          </motion.span>
                        )}
                      </div>
                    </div>

                    {/* Social Proof FOMO Pill right above Join button */}
                    <div className="pt-1">
                      {buyersCount > 0 ? (
                        <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-50 text-brand-primary-700 border border-brand-primary-100 text-center">
                          <span>👥</span>
                          <span><strong>{buyersCount}</strong> {buyersCount === 1 ? 'buyer has' : 'buyers have'} joined</span>
                        </div>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 text-center">
                          <span>✨</span>
                          <span>Be the first to join this pool!</span>
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      disabled={isJoining}
                      className="w-full text-base font-bold shadow-md shadow-brand-accent-500/30 gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      {isJoining ? 'Joining...' : 'Join Pool Now'}
                    </Button>
                    <p className="text-xs text-center text-ink-500">
                      No payment required until the pool closes.
                    </p>
                  </form>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
      <ImageLightbox
        isOpen={isLightboxOpen && hasValidImage}
        onClose={() => setIsLightboxOpen(false)}
        src={hasValidImage ? imageUrl : null}
        alt={product?.name}
      />

      {/* Sticky Mobile CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-ink-200 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-ink-500 font-medium">Total ({quantity} units)</div>
            <div className="text-lg font-bold text-ink-900 font-display">
              ₹{((quantity * projectedPrice) + logisticsFee).toLocaleString()}
            </div>
          </div>
          <Button
            type="button"
            variant="accent"
            size="md"
            disabled={isJoining}
            onClick={(e) => handleJoinPool(e)}
            className="flex-1 max-w-[200px] font-bold shadow-sm gap-2"
          >
            <Lock className="w-4 h-4" />
            {isJoining ? 'Joining...' : 'Join Pool'}
          </Button>
        </div>
      </div>
    </div>
  )
}
