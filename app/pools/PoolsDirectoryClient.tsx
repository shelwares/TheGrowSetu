'use client'

import { useState, useMemo } from 'react'
import PoolCard from '@/components/PoolCard'
import { Search, SlidersHorizontal } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PoolsDirectoryClient({ initialPools }: { initialPools: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Derive unique categories from existing products
  const categories = useMemo(() => {
    const set = new Set<string>()
    initialPools.forEach((pool) => {
      const cat = pool?.products?.category?.trim()
      if (cat) set.add(cat)
    })
    return ['All', ...Array.from(set)]
  }, [initialPools])

  // Filter pools client-side
  const filteredPools = useMemo(() => {
    return initialPools.filter((pool) => {
      const productName = pool?.products?.name?.toLowerCase() || ''
      const productDesc = pool?.products?.description?.toLowerCase() || ''
      const productCat = pool?.products?.category || ''
      const query = searchQuery.trim().toLowerCase()

      const matchesSearch =
        !query || productName.includes(query) || productDesc.includes(query)
      const matchesCategory =
        selectedCategory === 'All' ||
        productCat.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [initialPools, searchQuery, selectedCategory])

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active pools by product name..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-primary-500 focus:ring-4 focus:ring-brand-primary-100 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 self-start sm:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Showing {filteredPools.length} of {initialPools.length} pools</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-primary-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Pools Grid or Empty State */}
      {filteredPools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No matching pools found</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm mb-6">
            We couldn&apos;t find any pools matching &quot;{searchQuery}&quot; in {selectedCategory}. Try resetting your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
            className="px-4 py-2 text-sm font-semibold text-brand-primary-700 bg-brand-primary-50 hover:bg-brand-primary-100 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}

