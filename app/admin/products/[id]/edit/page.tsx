import { getAdminProduct } from '@/lib/actions/admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import EditProductForm from './EditProductForm'

export const metadata = {
  title: 'Edit Product | Admin',
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getAdminProduct(id)

  if (!product) {
    return notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-slate-500 hover:text-slate-700 text-sm">
          ← Back to Products
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
        <p className="text-slate-500 text-sm mt-1">
          Update product information and catalog details.
        </p>
      </div>

      <EditProductForm product={product} />
    </div>
  )
}
