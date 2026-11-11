'use client'

import { logger } from '@/lib/logger'
import Link from 'next/link'
import { signup } from '@/lib/actions/auth'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useState } from 'react'
import {
  User,
  Building2,
  Lock,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formState, setFormState] = useState<{
    success?: string
    error?: string
    fieldErrors?: Record<string, string>
  } | null>(null)

  const handleGoogleSignup = async () => {
    setLoading(true)
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      logger.error('Google signup error', error.message)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setFormState(null)

    const formData = new FormData(e.currentTarget)
    const res = await signup(formData)
    if (res) {
      setFormState(res)
    }
    setLoading(false)
  }

  const fieldErrors = formState?.fieldErrors || {}

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 bg-ink-50/50">
      <div className="w-full max-w-xl">
        {/* Logo */}
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
          <div className="text-center pb-2 border-b border-ink-100">
            <h2 className="text-2xl font-bold text-ink-900 font-display">
              Create Your Buyer Account
            </h2>
            <p className="mt-1 text-ink-500 text-sm">
              Join Indian D2C brands & retailers unlocking pooled factory pricing
            </p>
          </div>

          {/* Google Signup Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-ink-200 text-ink-700 h-11 rounded-xl hover:bg-ink-50 transition-colors font-medium disabled:opacity-50 shadow-xs cursor-pointer text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Connecting with Google...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-ink-500 font-medium">
                or sign up with business email
              </span>
            </div>
          </div>

          {/* Global Alert Banners */}
          {formState?.error && !Object.keys(fieldErrors).length && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{formState.error}</span>
            </div>
          )}

          {formState?.success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{formState.success}</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Click the link in the email to activate your account and start joining pools.
                </p>
              </div>
            </div>
          )}

          {/* Structured Multi-Section Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* SECTION 1: Personal Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-ink-100 text-ink-800">
                <User className="w-4 h-4 text-brand-primary-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">
                  1. Personal Details
                </h3>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  className={`h-11 w-full rounded-xl border px-3.5 py-2 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:ring-4 transition-all ${
                    fieldErrors.full_name
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
                      : 'border-ink-300 focus:border-brand-primary-500 focus:ring-brand-primary-100 bg-white'
                  }`}
                />
                {fieldErrors.full_name ? (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fieldErrors.full_name}
                  </p>
                ) : (
                  <p className="text-xs text-ink-500">Primary contact person for your orders.</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-700">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      className={`h-11 w-full rounded-xl border pl-3.5 pr-9 py-2 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:ring-4 transition-all ${
                        fieldErrors.email
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
                          : 'border-ink-300 focus:border-brand-primary-500 focus:ring-brand-primary-100 bg-white'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-ink-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                  {fieldErrors.email ? (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.email}
                    </p>
                  ) : (
                    <p className="text-xs text-ink-500">We send your verification link here.</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="phone"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      className={`h-11 w-full rounded-xl border pl-3.5 pr-9 py-2 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:ring-4 transition-all ${
                        fieldErrors.phone
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
                          : 'border-ink-300 focus:border-brand-primary-500 focus:ring-brand-primary-100 bg-white'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-ink-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                  {fieldErrors.phone ? (
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {fieldErrors.phone}
                    </p>
                  ) : (
                    <p className="text-xs text-ink-500">10-digit mobile number for order updates.</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: Business Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-ink-100 text-ink-800">
                <Building2 className="w-4 h-4 text-brand-primary-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">
                  2. Business Details
                </h3>
              </div>

              {/* Company Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-700">
                  Company / Brand Name <span className="text-ink-400 text-xs font-normal">(optional)</span>
                </label>
                <input
                  name="company_name"
                  type="text"
                  placeholder="e.g. Acme Fragrances Pvt Ltd (or D2C Brand Name)"
                  className={`h-11 w-full rounded-xl border px-3.5 py-2 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:ring-4 transition-all ${
                    fieldErrors.company_name
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
                      : 'border-ink-300 focus:border-brand-primary-500 focus:ring-brand-primary-100 bg-white'
                  }`}
                />
                {fieldErrors.company_name ? (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fieldErrors.company_name}
                  </p>
                ) : (
                  <p className="text-xs text-ink-500">
                    Your registered enterprise or brand name for invoicing.
                  </p>
                )}
              </div>

              {/* Delivery Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-700">
                  Delivery Address <span className="text-ink-400 text-xs font-normal">(optional — can update later)</span>
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    rows={2}
                    placeholder="e.g. Unit 402, Building A, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra - 400093"
                    className="w-full rounded-xl border border-ink-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all resize-none"
                  />
                  <MapPin className="w-4 h-4 text-ink-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-xs text-ink-500">
                  Primary warehouse or office address for bulk shipment deliveries.
                </p>
              </div>
            </div>

            {/* SECTION 3: Security & Compliance */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1.5 border-b border-ink-100 text-ink-800">
                <Lock className="w-4 h-4 text-brand-primary-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500">
                  3. Account Security
                </h3>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Create a strong password"
                    className={`h-11 w-full rounded-xl border pl-3.5 pr-10 py-2 text-sm text-ink-900 shadow-xs placeholder:text-ink-400 focus:outline-none focus:ring-4 transition-all ${
                      fieldErrors.password
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/20'
                        : 'border-ink-300 focus:border-brand-primary-500 focus:ring-brand-primary-100 bg-white'
                    }`}
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
                {fieldErrors.password ? (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fieldErrors.password}
                  </p>
                ) : (
                  <p className="text-xs text-ink-500">
                    Must be at least 8 characters, with 1 uppercase letter and 1 number.
                  </p>
                )}
              </div>

              {/* Age Verification Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="age_verify"
                  name="age_verify"
                  required
                  className="mt-1 w-4 h-4 rounded border-ink-300 text-brand-primary-600 focus:ring-brand-primary-500 cursor-pointer"
                />
                <label htmlFor="age_verify" className="text-xs text-ink-600 leading-relaxed cursor-pointer">
                  I confirm that I am <strong>18 years or older</strong> and represent a business or enterprise eligible to use this B2B wholesale platform. <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Terms & Privacy Consent Checkbox */}
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms_consent"
                  name="terms_consent"
                  required
                  className="mt-1 w-4 h-4 rounded border-ink-300 text-brand-primary-600 focus:ring-brand-primary-500 cursor-pointer"
                />
                <label htmlFor="terms_consent" className="text-xs text-ink-600 leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-brand-primary-600 underline font-medium">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" className="text-brand-primary-600 underline font-medium">
                    Privacy Policy
                  </Link>
                  . I consent to processing of my personal and business data for order aggregation. <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Create Buyer Account
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm pt-2 border-t border-ink-100">
            <p className="text-ink-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-brand-primary-600 hover:text-brand-primary-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
