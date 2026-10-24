import type { Metadata } from 'next'
import { getProductRequests } from '@/lib/actions/admin'
import AdminRequestsClient from './AdminRequestsClient'

export const metadata: Metadata = {
  title: 'Product Requests & Demand Analytics',
  description: 'View buyer requested products and aggregate demand analytics.',
}

export default async function AdminRequestsPage() {
  const requests = await getProductRequests()

  return <AdminRequestsClient initialRequests={requests} />
}
