'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const verifyResetSession = async () => {
      // 1. Check URL parameters for explicit errors (e.g. from Supabase email link expiration)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        const urlError = params.get('error') || hashParams.get('error')
        const errorCode = params.get('error_code') || hashParams.get('error_code')
        const errorDesc = params.get('error_description') || hashParams.get('error_description')

        if (urlError || errorCode === 'otp_expired' || urlError === 'expired' || errorDesc) {
          setSessionError('This reset link has expired. Please request a new one.')
          return
        }

        // 2. Check if a code parameter is in URL (PKCE direct land)
        const code = params.get('code')
        const supabase = getSupabaseClient()

        if (code) {
          try {
            const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code)
            if (exchangeErr) {
              setSessionError('This reset link has expired. Please request a new one.')
              return
            }
          } catch {
            setSessionError('This reset link has expired. Please request a new one.')
            return
          }
        }

        // 3. Check if active authenticated recovery session exists
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setSessionReady(true)
          return
        }

        // 4. Fallback grace check for onAuthStateChange hydration
        setTimeout(async () => {
          const { data: { session: secondCheck } } = await supabase.auth.getSession()
          if (secondCheck) {
            setSessionReady(true)
          } else {
            setSessionError('This reset link has expired. Please request a new one.')
          }
        }, 1500)
      }
    }

    verifyResetSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least 1 uppercase letter.')
      return
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least 1 number.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    setLoading(true)
    const supabase = getSupabaseClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      router.push(
        '/auth/login?message=Password updated successfully! Please sign in with your new password.'
      )
    }, 2000)
  }

  // Password requirements checklist
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isMatching = password.length > 0 && password === confirmPassword

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-ink-50/50">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold font-display tracking-tight">
              <span className="text-brand-primary-700">The</span>
              <span className="text-brand-accent-500">GrowSetu</span>
            </h1>
          </Link>
          <p className="mt-2 text-ink-500 text-sm">
            Factory Rates. Without the Factory MOQ.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-ink-200 p-6 sm:p-8 space-y-6">
          {/* Expired / Invalid Link State */}
          {sessionError && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-red-100 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-xs">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-ink-900 font-display">
                  Reset Link Expired
                </h2>
                <p className="text-sm text-red-600 font-medium">
                  {sessionError}
                </p>
                <p className="text-xs text-ink-500 pt-1 leading-relaxed">
                  For your security, password reset links can only be used once and expire after 1 hour.
                </p>
              </div>
              <div className="pt-3">
                <Link
                  href="/auth/forgot-password"
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm"
                >
                  Request a New Reset Link
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Loading verification state */}
          {!sessionError && !sessionReady && (
            <div className="py-10 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary-600 mx-auto" />
              <p className="text-sm font-medium text-ink-600">
                Verifying your reset link...
              </p>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-ink-900 font-display">
                  Password Updated!
                </h2>
                <p className="text-sm text-emerald-700">
                  Your new password has been set. Redirecting you to sign in...
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-brand-primary-600 hover:underline inline-flex items-center gap-1"
                >
                  Click here if not redirected automatically
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Reset password form */}
          {!sessionError && sessionReady && !success && (
            <>
              <div className="text-center space-y-1 pb-1">
                <div className="w-12 h-12 bg-brand-primary-50 border border-brand-primary-100 rounded-2xl flex items-center justify-center mx-auto text-brand-primary-600 mb-2 shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ink-900 font-display">
                  Set New Password
                </h2>
                <p className="text-sm text-ink-500">
                  Enter your new password below to secure your account.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Enter new password"
                      className="h-11 w-full rounded-xl border border-ink-300 bg-white pl-3.5 pr-10 py-2 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-ink-400 hover:text-ink-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Re-enter your new password"
                      className="h-11 w-full rounded-xl border border-ink-300 bg-white pl-3.5 pr-10 py-2 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      className="absolute right-3 top-3 text-ink-400 hover:text-ink-600"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements Checklist */}
                <div className="p-3 bg-ink-50 rounded-xl space-y-1.5 text-xs text-ink-600 border border-ink-100">
                  <p className="font-semibold text-ink-700 pb-0.5">Password requirements:</p>
                  <div className="flex items-center gap-1.5">
                    <span className={hasMinLength ? 'text-emerald-600 font-bold' : 'text-ink-400'}>
                      {hasMinLength ? '✓' : '○'}
                    </span>
                    <span className={hasMinLength ? 'text-ink-800 font-medium' : ''}>
                      Minimum 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hasUppercase ? 'text-emerald-600 font-bold' : 'text-ink-400'}>
                      {hasUppercase ? '✓' : '○'}
                    </span>
                    <span className={hasUppercase ? 'text-ink-800 font-medium' : ''}>
                      At least 1 uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hasNumber ? 'text-emerald-600 font-bold' : 'text-ink-400'}>
                      {hasNumber ? '✓' : '○'}
                    </span>
                    <span className={hasNumber ? 'text-ink-800 font-medium' : ''}>
                      At least 1 number
                    </span>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className={isMatching ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                        {isMatching ? '✓' : '✕'}
                      </span>
                      <span className={isMatching ? 'text-emerald-700 font-medium' : 'text-red-600 font-medium'}>
                        {isMatching ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Set New Password'
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-ink-100">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold text-ink-600 hover:text-ink-900 transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
