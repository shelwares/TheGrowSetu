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
  metadataBase: new URL('https://thegrowsetu.com'),
  title: {
    default: 'TheGrowSetu — Factory Rates. Without the Factory MOQ.',
    template: '%s | TheGrowSetu',
  },
  description: 'India\'s B2B demand aggregation platform. Join collective buying pools with other business owners, unlock factory-direct pricing, and get quality-checked products delivered to your doorstep.',
  keywords: [
    'B2B pooling platform',
    'factory direct pricing',
    'wholesale India',
    'bulk order pooling',
    'D2B aggregation',
    'low MOQ sourcing',
    'TheGrowSetu',
    'Indian manufacturers',
  ],
  authors: [{ name: 'TheGrowSetu' }],
  creator: 'TheGrowSetu',
  publisher: 'TheGrowSetu',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://thegrowsetu.com',
    siteName: 'TheGrowSetu',
    title: 'TheGrowSetu — Factory Rates. Without the Factory MOQ.',
    description: 'Join collective buying pools. Unlock factory pricing. Zero inventory risk.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TheGrowSetu — B2B Pooling Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheGrowSetu — Factory Rates. Without the Factory MOQ.',
    description: 'Join collective buying pools. Unlock factory pricing.',
    images: ['/og-image.png'],
  },
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
