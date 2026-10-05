import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About TheGrowSetu — How Pooled Buying Works',
  description: "TheGrowSetu is India's first B2B demand aggregation platform. We unite startup founders, D2C brands, and small retailers to pool orders and unlock factory-level pricing without large MOQs.",
  alternates: { canonical: 'https://thegrowsetu.com/about' },
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-ink-900 mb-4 font-display">About TheGrowSetu</h1>
      <p className="text-xl text-ink-500 mb-12">
        India&apos;s first B2B demand aggregation platform — factory pricing for every business, regardless of size.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 font-display">Our Mission</h2>
          <p className="text-ink-700 text-lg leading-relaxed">
            Small businesses in India have always been priced out of factory-direct deals.
            Minimum order quantities (MOQs) of thousands of units lock out startups, D2C brands, and
            small retailers from the pricing tiers that large corporations enjoy. TheGrowSetu changes that.
          </p>
          <p className="text-ink-700 text-lg leading-relaxed mt-4">
            We pool demand from hundreds of small buyers into a single large order — unlocking factory-direct
            pricing for everyone, with no inventory risk and our strict 2-step quality check.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 font-display">Who We Serve</h2>
          <ul className="space-y-3 text-ink-700 text-lg">
            <li className="flex items-start gap-3">
              <span className="text-brand-primary-600 font-bold mt-0.5">→</span>
              <span><strong>D2C Brands</strong> — source products at margins that make your business viable</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-primary-600 font-bold mt-0.5">→</span>
              <span><strong>Startup Founders</strong> — validate products before committing to large factory runs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-primary-600 font-bold mt-0.5">→</span>
              <span><strong>Online Sellers</strong> — Meesho, Amazon, Flipkart sellers looking for better margins</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-primary-600 font-bold mt-0.5">→</span>
              <span><strong>Small Retailers</strong> — physical store owners who need quality goods at fair prices</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 font-display">Our Promise</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-brand-primary-50 rounded-2xl p-6 border border-brand-primary-100">
              <div className="text-3xl mb-3">🏭</div>
              <h3 className="font-bold text-ink-900 mb-2">Factory Rates</h3>
              <p className="text-ink-600 text-sm">Real factory pricing, not marked-up wholesale</p>
            </div>
            <div className="bg-brand-primary-50 rounded-2xl p-6 border border-brand-primary-100">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-bold text-ink-900 mb-2">2-Step QC</h3>
              <p className="text-ink-600 text-sm">Quality checked at factory and before dispatch</p>
            </div>
            <div className="bg-brand-primary-50 rounded-2xl p-6 border border-brand-primary-100">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-bold text-ink-900 mb-2">Zero Inventory Risk</h3>
              <p className="text-ink-600 text-sm">No upfront payment until the pool closes</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mb-4 font-display">Contact Us</h2>
          <p className="text-ink-700">
            Questions? Reach us at{' '}
            <a href="mailto:support@thegrowsetu.com" className="text-brand-primary-600 underline hover:text-brand-primary-700">
              support@thegrowsetu.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
