'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/lib/actions/auth'
import {
  KeyRound,
  Mail,
  MailCheck,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get('email') as string || '').trim()
    setSubmittedEmail(email)

    const result = await resetPassword(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

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
          {success ? (
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                <MailCheck className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-ink-900 font-display">
                  Check Your Email
                </h2>
                <p className="text-sm text-ink-600 leading-relaxed">
                  We have sent a secure password reset link to:
                </p>
                <p className="text-sm font-bold text-brand-primary-700 bg-brand-primary-50 px-3 py-1.5 rounded-lg border border-brand-primary-100 inline-block font-mono">
                  {submittedEmail}
                </p>
                <p className="text-xs text-ink-500 pt-2 leading-relaxed">
                  Click the link in the email to set a new password. The link will expire in 1 hour.
                </p>
              </div>

              <div className="pt-2 border-t border-ink-100 space-y-3">
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-xs text-brand-primary-600 hover:text-brand-primary-700 font-semibold cursor-pointer"
                >
                  Didn&apos;t receive it? Try a different email
                </button>
                <div>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 bg-brand-primary-50 border border-brand-primary-100 rounded-2xl flex items-center justify-center mx-auto text-brand-primary-600 mb-3 shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ink-900 font-display">
                  Forgot Password?
                </h2>
                <p className="text-sm text-ink-500">
                  No worries. Enter your registered email and we&apos;ll send you a password reset link.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-700">
                    Business Email Address
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="h-11 w-full rounded-xl border border-ink-300 bg-white pl-3.5 pr-9 py-2 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
                    />
                    <Mail className="w-4 h-4 text-ink-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    'Send Password Reset Link'
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-ink-100">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-ink-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
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
