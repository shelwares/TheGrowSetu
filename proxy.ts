import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Update Supabase session
  const response = (await updateSession(request)) || NextResponse.next();

  // Add Security Headers
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Allow self + GA/GTM scripts (required for next/script strategy="afterInteractive")
      // 'unsafe-eval' removed - not needed in production builds
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      // Restrict image sources to self, Supabase storage, and analytics pixels
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://www.googletagmanager.com https://www.google-analytics.com",
      "font-src 'self' data:",
      // Allow GA beacon + Supabase API calls
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://*.supabase.co",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - Static file extensions (svg, png, jpg, etc.)
     * - SEO / metadata routes that must be publicly reachable:
     *     sitemap.xml, robots.txt, manifest.webmanifest,
     *     icon, apple-icon, opengraph-image
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|icon|apple-icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
