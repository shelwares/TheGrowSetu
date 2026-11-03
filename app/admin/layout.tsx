import { requireAdmin } from '@/lib/actions/admin'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  // User has MFA set up but hasn't verified this session
  if (aal?.currentLevel === 'aal1' && aal?.nextLevel === 'aal2') {
    redirect('/auth/mfa-verify');
  }

  // User has NO MFA set up at all — force setup
  if (aal?.currentLevel === 'aal1' && aal?.nextLevel === 'aal1') {
    redirect('/dashboard/security?reason=setup-required');
  }

  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <div className="hidden md:block sticky top-0 h-screen">
          <AdminSidebar />
        </div>
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
