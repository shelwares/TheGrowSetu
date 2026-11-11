'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/motion/fade-in'
import {
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
} from 'lucide-react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeMobile = () => setMobileOpen(false)
  const closeDropdown = () => setDropdownOpen(false)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fullName = user?.user_metadata?.full_name || ''
  const email = user?.email || ''
  const displayName = fullName || email.split('@')[0] || 'My Account'
  const initial = (fullName ? fullName[0] : email ? email[0] : 'U').toUpperCase()

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-ink-200 sticky top-0 z-50">
      <FadeIn direction="down" duration={0.3} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight font-display"
              onClick={() => {
                closeMobile()
                closeDropdown()
              }}
            >
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

          {/* Desktop auth buttons / Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full border border-ink-200 hover:border-brand-primary-300 hover:bg-ink-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-primary-100 border border-brand-primary-300 flex items-center justify-center text-brand-primary-700 font-bold text-sm shadow-xs">
                    {initial}
                  </div>
                  <span className="text-sm font-semibold text-ink-800 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-500 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180 text-brand-primary-600' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-ink-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User summary header */}
                    <div className="px-4 py-3 border-b border-ink-100 bg-ink-50/50">
                      <p className="text-sm font-bold text-ink-900 truncate">
                        {fullName || displayName}
                      </p>
                      <p className="text-xs text-ink-500 truncate mt-0.5">
                        {email}
                      </p>
                    </div>

                    {/* Menu links */}
                    <div className="py-1.5">
                      <Link
                        href="/dashboard"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-primary-50 hover:text-brand-primary-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-ink-500" />
                        Dashboard
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-primary-50 hover:text-brand-primary-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-ink-500" />
                        My Profile
                      </Link>

                      <Link
                        href="/dashboard/orders"
                        onClick={closeDropdown}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-primary-50 hover:text-brand-primary-700 transition-colors"
                      >
                        <Package className="w-4 h-4 text-ink-500" />
                        My Orders
                      </Link>
                    </div>

                    {/* Logout button */}
                    <div className="border-t border-ink-100 pt-1.5 px-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          closeDropdown()
                          signOut()
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
        <div className="md:hidden border-t border-ink-200 bg-white shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* User profile section if logged in */}
          {user && (
            <div className="px-5 py-4 border-b border-ink-100 bg-ink-50/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary-100 border border-brand-primary-300 flex items-center justify-center text-brand-primary-700 font-bold text-base shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-900 truncate">
                  {fullName || displayName}
                </p>
                <p className="text-xs text-ink-500 truncate mt-0.5">
                  {email}
                </p>
              </div>
            </div>
          )}

          <div className="px-4 py-3 space-y-1">
            <Link
              href="/pools"
              onClick={closeMobile}
              className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
            >
              Active Pools
            </Link>
            <Link
              href="/how-it-works"
              onClick={closeMobile}
              className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
            >
              How it Works
            </Link>
          </div>

          <div className="border-t border-ink-100 px-4 py-3 space-y-1">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-brand-primary-50 hover:text-brand-primary-700 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-ink-500" />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-brand-primary-50 hover:text-brand-primary-700 transition-colors"
                >
                  <User className="h-4 w-4 text-ink-500" />
                  My Profile
                </Link>

                <Link
                  href="/dashboard/orders"
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-brand-primary-50 hover:text-brand-primary-700 transition-colors"
                >
                  <Package className="h-4 w-4 text-ink-500" />
                  My Orders
                </Link>

                <div className="pt-2 border-t border-ink-100 mt-1">
                  <button
                    onClick={() => {
                      closeMobile()
                      signOut()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-1 pb-1">
                <Link
                  href="/auth/login"
                  onClick={closeMobile}
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-brand-primary-600 border border-brand-primary-200 hover:bg-brand-primary-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={closeMobile}
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-primary-600 hover:bg-brand-primary-700 transition-colors shadow-xs"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
