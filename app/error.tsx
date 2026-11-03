'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Unhandled route error in error.tsx', error, {
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-ink-200 shadow-sm p-8 text-center space-y-6">
        <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-ink-900 tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-sm text-ink-600 leading-relaxed">
            An unexpected error occurred while processing your request. Please try again.
          </p>
          {error.digest && (
            <p className="text-xs text-ink-400 font-mono pt-1">
              Error Ref: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => reset()}
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            variant="secondary"
            asChild
            className="w-full sm:w-auto gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
