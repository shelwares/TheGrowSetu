import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works — Pooled Buying in 5 Steps',
  description: 'Learn how TheGrowSetu pooled buying works. Join a pool, watch prices drop as more buyers join, then get quality-checked products delivered. Factory rates, no factory MOQ.',
  alternates: { canonical: 'https://thegrowsetu.com/how-it-works' },
}

const steps = [
  {
    number: '01',
    title: 'Browse Active Pools',
    description:
      'Explore our curated list of active product pools — perfume, garments, cosmetics, and more. Each pool shows the current quantity, pricing tiers, and deadline.',
    icon: '🔍',
  },
  {
    number: '02',
    title: 'Join with Your Quantity',
    description:
      'Commit to the quantity you need. No upfront payment required. Your slot is reserved instantly. The more buyers that join, the lower the price drops for everyone.',
    icon: '✋',
  },
  {
    number: '03',
    title: 'Watch the Price Drop',
    description:
      'As the pool fills up, pricing tiers unlock automatically. Every new buyer benefits the entire pool — a true collective buying advantage.',
    icon: '📉',
  },
  {
    number: '04',
    title: 'Pool Closes & Manufacturing Begins',
    description:
      'Once the pool hits its target (or deadline), we confirm the order, collect payment, and place the factory order. You pay only the final locked-in price.',
    icon: '🏭',
  },
  {
    number: '05',
    title: 'QC Check + Delivery to Your Door',
    description:
      'We run a strict 2-step quality inspection — at the factory and before dispatch. Products are then shipped directly to each buyer\'s address.',
    icon: '🚚',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-ink-900 mb-4 font-display">How It Works</h1>
      <p className="text-xl text-ink-500 mb-16 max-w-2xl">
        Pooled buying in 5 simple steps. Join any quantity, get factory pricing, zero inventory risk.
      </p>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="flex gap-8 items-start group"
          >
            {/* Step number + connector */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary-600 text-white flex items-center justify-center text-xl font-bold shadow-lg group-hover:bg-brand-primary-700 transition-colors">
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-12 bg-brand-primary-200 mt-3" />
              )}
            </div>

            {/* Content */}
            <div className="pb-4">
              <div className="text-xs font-bold text-brand-primary-500 uppercase tracking-widest mb-1">
                Step {step.number}
              </div>
              <h2 className="text-xl font-bold text-ink-900 mb-2 font-display">{step.title}</h2>
              <p className="text-ink-600 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-brand-primary-50 rounded-2xl p-8 border border-brand-primary-100 text-center">
        <h2 className="text-2xl font-bold text-ink-900 mb-3 font-display">Ready to start?</h2>
        <p className="text-ink-600 mb-6">Browse active pools and join your first one today.</p>
        <a
          href="/pools"
          className="inline-block bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Explore Active Pools →
        </a>
      </div>
    </div>
  )
}
