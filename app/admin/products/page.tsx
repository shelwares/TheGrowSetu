/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminProducts } from '@/lib/actions/admin'
import Link from 'next/link'
import ProductListClient from './ProductListClient'

export default async function AdminProductsPage() {
  const products = await getAdminProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-3">🏷️</div>
          <h3 className="font-bold text-slate-900 mb-1">No products yet</h3>
          <p className="text-slate-500 text-sm mb-4">Add your first product to get started.</p>
          <Link href="/admin/products/new" className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
            Add Product
          </Link>
        </div>
      ) : (
        <ProductListClient products={products} />
      )}
    </div>
  )
}
