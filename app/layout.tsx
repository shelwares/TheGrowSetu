import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800']
});
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-body' 
});
const mono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://thegrowsetu.com'),
  title: {
    default: 'TheGrowSetu — Factory Rates Without Factory MOQ',
    template: '%s | TheGrowSetu',
  },
  description: "Join India's first B2B demand aggregation platform. Pool orders with other buyers to unlock factory-level pricing on perfume, garments, cosmetics and more. Low MOQ, factory rates.",
  keywords: [
    'B2B pooled buying',
    'demand aggregation',
    'factory rates India',
    'low MOQ wholesale',
    'D2C brand sourcing',
    'bulk order platform',
    'startup manufacturing',
    'B2B procurement India',
    'pool buying platform',
  ],
  authors: [{ name: 'TheGrowSetu' }],
  creator: 'TheGrowSetu',
  publisher: 'TheGrowSetu',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://thegrowsetu.com',
    siteName: 'TheGrowSetu',
    title: 'TheGrowSetu — Factory Rates Without Factory MOQ',
    description: "Join India's first B2B demand aggregation platform. Pool orders with other buyers to unlock factory-level pricing.",
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TheGrowSetu — Factory Rates Without Factory MOQ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheGrowSetu — Factory Rates Without Factory MOQ',
    description: "Join India's first B2B demand aggregation platform.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://thegrowsetu.com',
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
}

import '@/lib/env'
import { AuthProvider } from '@/lib/auth/auth-context'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider initialUser={session?.user ?? null} initialSession={session}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}
