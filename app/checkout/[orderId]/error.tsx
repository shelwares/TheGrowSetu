'use client'

import { logger } from '@/lib/logger'
import Link from "next/link";
import { useEffect } from "react";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Checkout error", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 text-center">
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-slate-600 mb-6">
        We couldn&apos;t load this order. It may still have been created successfully.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="px-5 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
