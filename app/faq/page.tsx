import type { Metadata } from 'next'
import { FAQSchema } from '@/components/seo/structured-data'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about TheGrowSetu pooled buying platform — MOQ, pricing tiers, logistics, quality control, order tracking, refunds, payment methods, and more.',
  alternates: { canonical: 'https://thegrowsetu.com/faq' },
}

const faqs = [
  {
    question: 'What is pooled buying and how does it work?',
    answer:
      'Pooled buying is when multiple buyers commit to purchasing the same product together to meet a combined minimum order quantity (MOQ). On TheGrowSetu, you join a pool with the quantity you need. As more buyers join, the total quantity grows, unlocking cheaper factory pricing tiers for everyone in the pool.',
  },
  {
    question: 'What is the minimum order quantity (MOQ) to join a pool?',
    answer:
      'There is no platform-level MOQ. Each pool has its own minimum tier — typically starting from as few as 10–50 units depending on the product. You can see the exact tier minimums on each pool\'s detail page. You only need to meet the pool\'s first tier minimum, not the factory\'s full MOQ.',
  },
  {
    question: 'How does the pricing tier system work?',
    answer:
      'Each pool has multiple pricing tiers based on total pooled quantity. For example, if 200 pcs are pooled, the price per piece might be ₹150; if 500 pcs are pooled, it drops to ₹120; and at 1000 pcs, it drops further to ₹95. The price you pay depends on the total quantity in the pool when it closes — everyone in the pool gets the same final price regardless of when they joined.',
  },
  {
    question: 'What quality control measures does TheGrowSetu have?',
    answer:
      'We run a mandatory 2-step quality check process: (1) Factory QC — our team or a third-party inspector verifies quality at the manufacturing facility before goods are packaged; (2) Pre-dispatch QC — products are checked again at our fulfilment centre before they are shipped to buyers. If any batch fails QC, we either reject it or work with the factory on rework.',
  },
  {
    question: 'How does order tracking work?',
    answer:
      'Once a pool closes and manufacturing begins, you can track your order status from your Dashboard → Orders page. Status updates include: Pool Closed → Manufacturing → QC Passed → Dispatched → Delivered. You will also receive email notifications at each major milestone.',
  },
  {
    question: 'What is the refund policy if the pool fails to reach its target?',
    answer:
      'If a pool does not reach its minimum target quantity by the deadline, all committed buyers receive a 100% full refund to their original payment method (UPI/bank account) within 5–7 business days. No cancellation fee or deduction is applied.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We currently accept UPI and bank transfer (NEFT/RTGS/IMPS). Payment is only collected after the pool successfully closes — you do not pay anything when joining a pool. Payment gateway integration (credit/debit cards, Razorpay) is planned for upcoming releases.',
  },
  {
    question: 'What is the typical delivery time?',
    answer:
      'Delivery timelines depend on the product category and the factory\'s lead time. Typical timelines after pool closure: Manufacturing — 15–30 days; QC & Packaging — 5–7 days; Logistics — 3–7 days (within India). Total estimated delivery is shown on each pool\'s detail page. We always communicate any delays proactively.',
  },
  {
    question: 'Can I cancel my order after joining a pool?',
    answer:
      'Yes, with conditions: Before the pool closes — 100% refund, no questions asked. After the pool closes but before dispatch — 90% refund (10% handling fee applies). After dispatch — No refund as the order has already been shipped. To cancel, email refunds@thegrowsetu.com with your order ID.',
  },
  {
    question: 'How do I contact TheGrowSetu support?',
    answer:
      'You can reach us at support@thegrowsetu.com for general enquiries, refunds@thegrowsetu.com for refund requests, and business@thegrowsetu.com for business partnerships. Our support team is available Monday–Saturday, 10 AM–7 PM IST. We typically respond within 24 hours.',
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <FAQSchema faqs={faqs} />

      <h1 className="text-4xl font-bold text-ink-900 mb-4 font-display">
        Frequently Asked Questions
      </h1>
      <p className="text-xl text-ink-500 mb-12">
        Everything you need to know about pooled buying on TheGrowSetu.
      </p>

      <div className="space-y-0 divide-y divide-ink-200 border border-ink-200 rounded-2xl overflow-hidden">
        {faqs.map((faq, index) => (
          <details key={index} className="group bg-white">
            <summary className="flex justify-between items-start gap-4 px-6 py-5 cursor-pointer list-none hover:bg-ink-50 transition-colors">
              <h2 className="text-base font-semibold text-ink-900 font-display">
                {faq.question}
              </h2>
              <span className="text-brand-primary-600 font-bold text-xl flex-shrink-0 mt-0.5 group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <div className="px-6 pb-5 text-ink-600 leading-relaxed border-t border-ink-100 pt-4">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-ink-600 mb-4">Still have questions?</p>
        <a
          href="/contact"
          className="inline-block bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}
