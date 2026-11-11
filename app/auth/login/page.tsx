'use client'

import { logger } from '@/lib/logger'
import Link from 'next/link'
import { login } from '@/lib/actions/auth'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, CheckCircle2, TrendingDown, Users } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('message')
    }
    return null
  })

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle()
        router.push(profile?.role === 'admin' ? '/admin' : '/dashboard')
      }
    }
    checkSession()
  }, [router])

  const handleGoogleLogin = async () => {
    setLoading(true)
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      logger.error('Google login error', error.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Column: Form */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-4 py-12 sm:px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold font-display tracking-tight">
                <span className="text-brand-primary-700">The</span>
                <span className="text-brand-accent-500">GrowSetu</span>
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-ink-900 font-display mt-6">Welcome back</h2>
            <p className="mt-1 text-ink-500 text-sm">Sign in to your account to track your orders and pools.</p>
          </div>

          {message && (
            <div className="bg-success/10 text-success p-3 rounded-xl text-sm text-center font-medium border border-success/20">
              {message}
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-ink-200 text-ink-700 h-11 rounded-xl hover:bg-ink-50 transition font-medium disabled:opacity-50 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-ink-500 font-medium">or sign in with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form action={login} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-ink-800">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-ink-800">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-brand-primary-600 hover:text-brand-primary-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-brand-primary-600 text-white rounded-xl font-semibold hover:bg-brand-primary-700 transition-colors shadow-sm"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-ink-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-brand-primary-600 hover:text-brand-primary-700 font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Dark Trust Pane (Desktop only) */}
      <div className="hidden lg:col-span-5 lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-primary-950 via-brand-primary-900 to-brand-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-accent-400 text-xs font-semibold backdrop-blur-md mb-8 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified B2B Supply Platform</span>
          </div>
          <h3 className="text-3xl font-bold font-display leading-tight mb-4 text-white">
            Access India&apos;s best factory prices with zero MOQ risk.
          </h3>
          <p className="text-brand-primary-100 text-base leading-relaxed">
            Join verified retailers and MSMEs pooling their buying volume directly with vetted manufacturers.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="relative z-10 space-y-4 my-auto py-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Users className="w-5 h-5 text-brand-accent-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white text-sm">Collective Buying Power</div>
              <div className="text-xs text-brand-primary-200 mt-0.5">Pool demand with other buyers to unlock tier-1 manufacturer discounts.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-brand-accent-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white text-sm">Pay When Pool Fills</div>
              <div className="text-xs text-brand-primary-200 mt-0.5">No advance payment required to join. Payment collected only after demand is confirmed.</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <TrendingDown className="w-5 h-5 text-brand-accent-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white text-sm">Save 30% to 50%</div>
              <div className="text-xs text-brand-primary-200 mt-0.5">Cut out intermediaries and distributor markups completely.</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-brand-primary-300 flex items-center justify-between">
          <span>© {new Date().getFullYear()} TheGrowSetu</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-accent-400" />
            ISO 9001 Factory Partners
          </span>
        </div>
      </div>
    </main>
  )
}
