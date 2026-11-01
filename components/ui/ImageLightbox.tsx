'use client'

import { useEffect, useCallback, useState } from 'react'
import { X, ImageOff } from 'lucide-react'

interface ImageLightboxProps {
  src?: string | null
  alt?: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageLightbox({
  src,
  alt = 'Product image',
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [hasError, setHasError] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return

    setHasError(false)

    // Lock body scroll while lightbox is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, src, handleKeyDown])

  if (!isOpen || !src) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image preview"
        className="absolute top-4 right-4 z-50 p-2.5 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image container - stop propagation so clicking the image itself doesn't close */}
      <div
        className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {hasError ? (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-900/80 rounded-xl border border-slate-700 text-center max-w-md">
            <ImageOff className="w-12 h-12 text-slate-400 mb-3" />
            <p className="text-sm sm:text-base font-medium text-slate-200">
              Image could not be loaded.
            </p>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain"
          />
        )}
        {alt && !hasError && (
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-medium text-center truncate max-w-xl">
            {alt}
          </p>
        )}
      </div>
    </div>
  )
}

