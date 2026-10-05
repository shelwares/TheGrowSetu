/**
 * SEO Structured Data Components
 * Renders JSON-LD schema.org structured data for rich search results.
 * All components are server-renderable (no 'use client' needed).
 */

// ---------------------------------------------------------------------------
// Organization + WebSite Schema
// ---------------------------------------------------------------------------
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://thegrowsetu.com/#organization',
        name: 'TheGrowSetu',
        url: 'https://thegrowsetu.com',
        logo: 'https://thegrowsetu.com/logo.png',
        description: 'B2B demand aggregation platform for pooled purchasing',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@thegrowsetu.com',
          contactType: 'Customer Support',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://thegrowsetu.com/#website',
        url: 'https://thegrowsetu.com',
        name: 'TheGrowSetu',
        publisher: { '@id': 'https://thegrowsetu.com/#organization' },
        inLanguage: 'en-IN',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ---------------------------------------------------------------------------
// Product Schema — for pool detail pages
// ---------------------------------------------------------------------------
interface PricingTier {
  buyer_price: number
  min_qty: number
  max_qty: number
}

interface ProductSchemaProps {
  product: {
    name: string
    description?: string | null
    base_image?: string | null
  }
  pricingTiers: PricingTier[]
}

export function ProductSchema({ product, pricingTiers }: ProductSchemaProps) {
  const prices = pricingTiers.map((t) => t.buyer_price).filter((p) => p > 0)
  const lowPrice = prices.length > 0 ? Math.min(...prices) : 0
  const highPrice = prices.length > 0 ? Math.max(...prices) : 0

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: product.base_image ?? undefined,
    brand: {
      '@type': 'Brand',
      name: 'TheGrowSetu',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice,
      highPrice,
      offerCount: pricingTiers.length,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ---------------------------------------------------------------------------
// FAQ Schema — for FAQ page
// ---------------------------------------------------------------------------
interface FAQ {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQ[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ---------------------------------------------------------------------------
// Breadcrumb Schema — for pool detail pages
// ---------------------------------------------------------------------------
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
