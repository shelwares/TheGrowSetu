import { createBrowserClient } from '@supabase/ssr'

export function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // PKCE is more secure than implicit flow: prevents auth code interception attacks
        flowType: 'pkce',
        detectSessionInUrl: true,
      },
    }
  );
}
