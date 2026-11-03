import Link from 'next/link'
import { FileQuestion, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl border border-ink-200 shadow-sm p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-brand-primary-50 border border-brand-primary-200 rounded-2xl flex items-center justify-center mx-auto text-brand-primary-600 shadow-xs">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold tracking-wider uppercase text-brand-primary-600 bg-brand-primary-50 px-2.5 py-1 rounded-full border border-brand-primary-100">
            404 Error
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-ink-900 tracking-tight pt-2">
            Page Not Found
          </h1>
          <p className="text-sm text-ink-600 leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="primary" asChild className="w-full sm:w-auto gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="secondary" asChild className="w-full sm:w-auto gap-2">
            <Link href="/pools">
              <Search className="w-4 h-4" />
              Browse Pools
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
