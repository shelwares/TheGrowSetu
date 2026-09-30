'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion/fade-in'
import { LogOut, User } from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-ink-200 sticky top-0 z-50">
      <FadeIn direction="down" duration={0.3} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-tight font-display">
              <span className="text-brand-primary-700">The</span>
              <span className="text-brand-accent-500">GrowSetu</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/pools" className="text-ink-600 hover:text-brand-primary-600 font-medium transition-colors">
              Active Pools
            </Link>
            <Link href="#" className="text-ink-600 hover:text-brand-primary-600 font-medium transition-colors">
              How it Works
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
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
        </div>
      </FadeIn>
    </nav>
  )
}
