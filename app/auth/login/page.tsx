'use client'

import { logger } from '@/lib/logger'
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get("message");
    }
    return null;
  });

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        router.push(profile?.role === 'admin' ? '/admin' : '/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      logger.error("Google login error", error.message);
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
            <h2 className="text-2xl font-bold text-ink-900 font-display">Welcome back</h2>
            <p className="mt-1 text-ink-500 text-sm">Sign in to your account</p>
          </div>

          {message && (
            <div className="bg-success/10 text-success p-3 rounded-lg text-sm text-center font-medium">
              {message}
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-ink-200 text-ink-700 h-11 rounded-lg hover:bg-ink-50 transition font-medium disabled:opacity-50 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
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

          {/* Email/Password Form — logic untouched */}
          <form action={login} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="h-11 w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-700">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-11 w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 shadow-sm placeholder:text-ink-400 focus:outline-none focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-brand-primary-500 text-white rounded-lg font-semibold hover:bg-brand-primary-600 transition-colors shadow-sm"
            >
              Sign In
            </button>
          </form>

          <div className="text-center space-y-2 text-sm">
            <Link href="/auth/forgot-password" className="block text-brand-primary-600 hover:text-brand-primary-700 font-medium transition-colors">
              Forgot password?
            </Link>
            <p className="text-ink-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-brand-primary-600 hover:text-brand-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
