"use client";

import Link from 'next/link'
import { signup } from '@/lib/actions/auth'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<{success?: string, error?: string} | null>(null);

  const handleGoogleSignup = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Google signup error:", error.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-ink-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display tracking-tight">
            <span className="text-brand-primary-700">The</span>
            <span className="text-brand-accent-500">GrowSetu</span>
          </h1>
          <p className="mt-2 text-ink-500 text-sm">Factory Rates. Without the Factory MOQ.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-ink-200 p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ink-900 font-display">Create Account</h2>
            <p className="mt-1 text-ink-500 text-sm">Join thousands of buyers on TheGrowSetu</p>
          </div>

          {/* Google Signup Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-ink-200 text-ink-700 h-11 rounded-lg hover:bg-ink-50 transition font-medium disabled:opacity-50 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing up..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-ink-500 font-medium">or sign up with email</span>
            </div>
          </div>

          {formState?.error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
              {formState.error}
            </div>
          )}
          {formState?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm text-center font-medium">
              {formState.success}
            </div>
          )}

          {/* Signup Form — logic untouched */}
          <form className="space-y-4" action={async (formData) => {
            setLoading(true);
            setFormState(null);
            const res = await signup(formData);
            if (res) setFormState(res);
            setLoading(false);
          }}>
            {[
              { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'John Doe' },
              { label: 'Company Name', name: 'company_name', type: 'text', placeholder: 'Acme Corp' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 9876543210' },
              { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@company.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-700">{label}</label>
                <input
                  name={name}
                  type={type}
                  required={name !== 'address' && name !== 'company_name'}
                  placeholder={placeholder}
                  className="h-11 w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Delivery Address</label>
              <textarea
                name="address"
                rows={2}
                placeholder="123, Main Street, City, State - 400001"
                className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all resize-none"
              />
            </div>

            {/* Age Verification */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="age_verify"
                name="age_verify"
                required
                className="mt-1 w-4 h-4 rounded border-ink-300 text-brand-primary-600 focus:ring-brand-primary-500"
              />
              <label htmlFor="age_verify" className="text-sm text-ink-600">
                I confirm I am <strong>18 years or older</strong> and eligible to use this B2B platform. <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Terms & Privacy Consent */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms_consent"
                name="terms_consent"
                required
                className="mt-1 w-4 h-4 rounded border-ink-300 text-brand-primary-600 focus:ring-brand-primary-500"
              />
              <label htmlFor="terms_consent" className="text-sm text-ink-600">
                I agree to the{" "}
                <a href="/terms" target="_blank" className="text-brand-primary-600 underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="text-brand-primary-600 underline">
                  Privacy Policy
                </a>
                . I consent to processing of my personal data for account creation and order fulfillment. <span className="text-red-500">*</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand-primary-500 text-white rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors shadow-sm mt-2 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center text-sm">
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
