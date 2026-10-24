'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: '🏠' },
  { label: 'My Orders', href: '/dashboard/orders', icon: '📦' },
  { label: 'Request a Product', href: '/request-product', icon: '✨' },
  { label: 'My Profile', href: '/dashboard/profile', icon: '👤' },
  { label: 'Security', href: '/dashboard/security', icon: '🛡️' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-full">
      <div className="p-6 border-b border-slate-200">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl mb-3">
          {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'B'}
        </div>
        <p className="font-semibold text-slate-900 text-sm truncate">
          {user?.user_metadata?.full_name || 'Buyer'}
        </p>
        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Link
          href="/pools"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors mb-1"
        >
          <span>🛍️</span>
          Browse Pools
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}
