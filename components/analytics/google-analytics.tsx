'use client';
import Script from 'next/script';

export function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  
  // Debug log (remove after verifying)
  if (typeof window !== 'undefined') {
    console.log('[GA] Measurement ID:', GA_ID || 'NOT SET');
  }
  
  if (!GA_ID) {
    // Don't render anything if not configured
    return null;
  }
  
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
