'use client'

import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

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

    // Lock body scroll while lightbox is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

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
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform"
        />
        {alt && (
          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-medium text-center truncate max-w-xl">
            {alt}
          </p>
        )}
      </div>
    </div>
  )
}
