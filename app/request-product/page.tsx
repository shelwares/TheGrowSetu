import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getBuyerProductRequests } from '@/lib/actions/product-request'
import { getProfile } from '@/lib/actions/profile'
import RequestProductClient from './RequestProductClient'

export const metadata: Metadata = {
  title: 'Request a Product',
  description: 'Submit a custom product sourcing request to unlock pooled factory pricing.',
}

export default async function RequestProductPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?next=/request-product')
  }

  const [profile, requests] = await Promise.all([
    getProfile(),
    getBuyerProductRequests(),
  ])

  return (
    <RequestProductClient
      initialRequests={requests}
      buyerName={profile?.full_name || undefined}
    />
  )
}
