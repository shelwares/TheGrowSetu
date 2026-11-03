'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion/fade-in'
import { LogOut, User, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-ink-200 sticky top-0 z-50">
      <FadeIn direction="down" duration={0.3} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-tight font-display" onClick={closeMobile}>
              <span className="text-brand-primary-700">The</span>
              <span className="text-brand-accent-500">GrowSetu</span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/pools" className="text-ink-600 hover:text-brand-primary-600 font-medium transition-colors">
              Active Pools
            </Link>
            <Link href="/how-it-works" className="text-ink-600 hover:text-brand-primary-600 font-medium transition-colors">
              How it Works
            </Link>
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="secondary" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button variant="primary" asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile: hamburger button */}
          <button
            className="md:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-100 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </FadeIn>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink-200 bg-white shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/pools"
              onClick={closeMobile}
              className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
            >
              Active Pools
            </Link>
            <Link
              href="/how-it-works"
              onClick={closeMobile}
              className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
            >
              How it Works
            </Link>
          </div>

          <div className="border-t border-ink-100 px-4 py-4 space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => { closeMobile(); signOut(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={closeMobile}
                  className="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium text-brand-primary-600 border border-brand-primary-200 hover:bg-brand-primary-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={closeMobile}
                  className="block w-full text-center px-4 py-3 rounded-lg text-sm font-semibold text-white bg-brand-primary-600 hover:bg-brand-primary-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
