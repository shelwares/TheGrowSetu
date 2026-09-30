'use client'

import Link from 'next/link'
import DashboardSidebar from './DashboardSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar for mobile */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-bold text-indigo-700">TheGrowSetu</Link>
        <Link href="/pools" className="text-sm text-indigo-600 font-medium">Browse Pools</Link>
      </div>

      <div className="flex">
        {/* Sidebar — hidden on mobile */}
        <div className="hidden md:block sticky top-0 h-screen">
          <DashboardSidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
