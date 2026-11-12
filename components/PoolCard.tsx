/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ImageIcon } from 'lucide-react'

type PoolCardProps = {
  pool: any
  priority?: boolean
}

function getUrgencyBadge(deadlineStr: string | null | undefined) {
  if (!deadlineStr) return null
  const deadline = new Date(deadlineStr)
  if (isNaN(deadline.getTime())) return null

  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()

  if (diffMs <= 0) {
    return { text: 'Closed', isClosed: true }
  }

  const oneDayMs = 1000 * 60 * 60 * 24
  const days = Math.ceil(diffMs / oneDayMs)

  if (days <= 1) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    if (hours > 0 && hours <= 12) {
      return { text: `🔥 Closing in ${hours}h!`, isClosed: false }
    }
    return { text: '🔥 Closing Tomorrow!', isClosed: false }
  }

  if (days <= 3) {
    return { text: `🔥 Closing in ${days} days!`, isClosed: false }
  }

  return null
}

export default function PoolCard({ pool, priority = false }: PoolCardProps) {
  const [imageError, setImageError] = useState(false)
  const product = pool.products
  const imageUrl = product?.base_image?.trim()
  const progressPercentage = Math.min(100, Math.round((pool.current_quantity / pool.target_quantity) * 100))
  const shouldReduceMotion = useReducedMotion()
  const urgency = getUrgencyBadge(pool.deadline)
  const buyersCount = typeof pool.buyers_count === 'number' ? pool.buyers_count : 0
  
  let currentPrice = pool.pool_tiers?.[0]?.buyer_price
  if (pool.pool_tiers && pool.pool_tiers.length > 0) {
    const activeTier = pool.pool_tiers.slice().reverse().find((t: any) => pool.current_quantity >= t.min_qty)
    if (activeTier) {
      currentPrice = activeTier.buyer_price
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full group p-0">
      <div className="aspect-[4/3] bg-ink-100 relative overflow-hidden rounded-t-2xl">
        {!imageUrl || imageError ? (
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-medium">No Image</span>
          </div>
        ) : (
          <Image 
            src={imageUrl} 
            alt={product?.name || 'Product image'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            onError={() => setImageError(true)}
          />
        )}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-white/90 backdrop-blur-md text-brand-primary-700 hover:bg-white/90 border-0 shadow-sm">
            {product?.category || 'General'}
          </Badge>
        </div>

        {/* Urgency Badge */}
        {urgency && (
          <div className="absolute top-3 right-3 z-10">
            <Badge
              className={`border-0 shadow-md font-bold text-xs px-2.5 py-1 ${
                urgency.isClosed
                  ? 'bg-slate-900/90 text-white'
                  : 'bg-rose-600/95 text-white shadow-rose-500/20'
              }`}
            >
              {urgency.text}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="font-display font-semibold text-lg text-ink-900 mb-1 line-clamp-1">{product?.name}</h3>
        <p className="text-sm text-ink-500 mb-4 line-clamp-2">{product?.description}</p>
        
        {/* Social Proof FOMO Badge */}
        <div className="mb-4">
          {buyersCount > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-brand-primary-700 border border-brand-primary-100/80 shadow-xs">
              <span>👥</span>
              <span>{buyersCount} {buyersCount === 1 ? 'buyer has' : 'buyers have'} joined</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs">
              <span>✨</span>
              <span>Be the first to join this pool!</span>
            </div>
          )}
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-sm mb-2 font-medium">
            <span className="text-ink-700">Progress</span>
            <span className="text-brand-primary-600 font-semibold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-ink-100 rounded-full h-2 overflow-hidden">
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
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-ink-500 mt-2">
            <span>{pool.current_quantity} ordered</span>
            <span>{pool.target_quantity} goal</span>
          </div>
        </div>
        
        <div className="flex items-end justify-between mt-auto pt-5 border-t border-ink-100">
          <div>
            <p className="text-xs text-ink-500 font-medium mb-1">Current Price</p>
            <p className="text-xl font-bold text-ink-900 font-display tracking-tight">
              ₹{currentPrice || '---'}
            </p>
          </div>
          <Button variant="secondary" asChild size="sm" className="font-semibold text-brand-primary-700 bg-brand-primary-50 hover:bg-brand-primary-100 border-0">
            <Link href={`/pool/${pool.id}`}>
              View Pool
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
