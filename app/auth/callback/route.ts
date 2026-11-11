import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  // Sanitize the 'next' parameter to prevent open-redirect attacks.
  let redirectNext = searchParams.get("next") ?? "/";
  if (
    !redirectNext.startsWith("/") ||
    redirectNext.startsWith("//") ||
    redirectNext.startsWith("/\\")
  ) {
    redirectNext = "/";
  }

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // For password recovery, always go directly to reset-password
      if (type === "recovery" || redirectNext === "/auth/reset-password") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }

      // If explicit next param exists, honor it (already sanitized above)
      if (redirectNext && redirectNext !== "/") {
        return NextResponse.redirect(`${origin}${redirectNext}`);
      }

      // Otherwise, redirect based on role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      const redirectTo = profile?.role === 'admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(`${origin}${redirectTo}`);
    } else if (error) {
      // If recovery code exchange fails or expired, redirect to reset-password with expired status
      if (type === "recovery" || redirectNext === "/auth/reset-password") {
        return NextResponse.redirect(`${origin}/auth/reset-password?error=expired`);
      }
    }
  }

  // Handle explicit error parameter forwarded by Supabase
  const authError = searchParams.get("error");
  if (authError && (type === "recovery" || redirectNext === "/auth/reset-password")) {
    return NextResponse.redirect(`${origin}/auth/reset-password?error=expired`);
  }

  return NextResponse.redirect(
    `${origin}/auth/login?message=Unable to verify email`
  );
}
