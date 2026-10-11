import Link from 'next/link'
import { FadeIn } from '@/components/motion/fade-in'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300 py-12">
      <FadeIn className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold text-white mb-2 font-display tracking-tight">
              <span className="text-brand-primary-400">The</span>
              <span className="text-brand-accent-500">GrowSetu</span>
            </h2>
            <p className="text-sm text-ink-400">
              Factory Rates. Without the Factory MOQ.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-ink-800 text-sm text-center text-ink-500">
          &copy; {new Date().getFullYear()} TheGrowSetu. All rights reserved.
        </div>
      </FadeIn>
    </footer>
  )
}
