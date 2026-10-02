'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { LayoutDashboard, Package, Layers, ShoppingCart, ClipboardCheck, Globe, LogOut, Shield } from 'lucide-react'

const navItems = [
  { label: 'Overview',  href: '/admin',          icon: LayoutDashboard },
  { label: 'Products',  href: '/admin/products',  icon: Package },
  { label: 'Pools',     href: '/admin/pools',     icon: Layers },
  { label: 'Orders',    href: '/admin/orders',    icon: ShoppingCart },
  { label: 'QC',        href: '/admin/qc',        icon: ClipboardCheck },
  { label: 'Security',  href: '/dashboard/security', icon: Shield },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="w-60 bg-ink-900 text-ink-200 flex flex-col min-h-full">
      <div className="p-6 border-b border-ink-800">
        <Link href="/admin" className="text-xl font-bold font-display tracking-tight">
          <span className="text-brand-primary-400">The</span>
          <span className="text-brand-accent-400">GrowSetu</span>
          <span className="ml-2 text-xs font-normal bg-brand-accent-500/20 text-brand-accent-400 px-2 py-0.5 rounded-full">Admin</span>
        </Link>
        <p className="text-xs text-ink-500 mt-2 truncate">{user?.email}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-primary-600 text-white shadow-sm'
                  : 'text-ink-400 hover:bg-ink-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-ink-800 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-ink-400 hover:bg-ink-800 hover:text-white transition-colors"
        >
          <Globe className="w-4 h-4" />
          View Site
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-danger/80 hover:bg-danger/10 hover:text-danger transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
