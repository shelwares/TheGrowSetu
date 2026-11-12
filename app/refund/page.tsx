import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'TheGrowSetu refund and cancellation policy. No advance payment required. We only collect payment after your pool is successfully filled.',
  alternates: { canonical: 'https://thegrowsetu.com/refund' },
}

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-ink-900 mb-2">Refund &amp; Cancellation Policy</h1>
      <p className="text-ink-500 mb-6">Last updated: 12 November 2026</p>

      {/* Peace-of-mind alert banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 mb-10 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">🛡️</span>
        <div>
          <p className="font-semibold text-green-900">Peace of Mind: We only collect payment AFTER your pool is full.</p>
          <p className="text-green-800 text-sm mt-1">If the pool fails to reach its target, you pay absolutely nothing — no charge, no penalty, no hassle.</p>
        </div>
      </div>

      <div className="prose prose-ink max-w-none space-y-6 text-ink-700">

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">1. Our &ldquo;Pay Only When Pool Fills&rdquo; Model</h2>
          <p className="mb-3">TheGrowSetu operates on a commitment-first, pay-later model:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>No advance payment</strong> is collected when you join a pool.</li>
            <li>Joining a pool is a quantity <strong>commitment only</strong> — your slot is reserved but no money changes hands.</li>
            <li>Once the pool successfully reaches its target quantity, our team will <strong>contact you by phone/WhatsApp</strong> to confirm and collect payment.</li>
            <li>If the pool fails to reach its target by the deadline, your commitment is automatically cancelled. <strong>You owe nothing.</strong></li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">2. Pool Failure (Target Not Reached)</h2>
          <p className="mb-3">If a pool does not reach its minimum target quantity by the deadline:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your order commitment is <strong>automatically cancelled</strong>.</li>
            <li><strong>No payment was collected from you</strong> — there is nothing to refund.</li>
            <li>You will be notified via Email and/or WhatsApp.</li>
            <li>You are free to join another pool or try again on the next cycle.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">3. Cancellation by Buyer</h2>
          <p className="mb-3">Here is what happens depending on when you cancel:</p>

          <div className="space-y-4">
            <div className="bg-ink-50 rounded-lg p-4">
              <p className="font-semibold text-ink-900">Before the pool closes (pool still open):</p>
              <p className="text-ink-700 mt-1">You can cancel anytime. <strong>Zero penalty. No payment was made.</strong> Your slot is simply released back to the pool.</p>
            </div>
            <div className="bg-ink-50 rounded-lg p-4">
              <p className="font-semibold text-ink-900">After the pool closes, before our payment call:</p>
              <p className="text-ink-700 mt-1">You may still cancel at this stage. <strong>Zero penalty. No payment was made.</strong> Please contact us promptly so we can update the factory order.</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="font-semibold text-ink-900">After payment is collected, before dispatch:</p>
              <p className="text-ink-700 mt-1">A <strong>5% deduction</strong> applies to cover payment processing costs. <strong>95% of your payment</strong> will be refunded within 7–10 business days to your original payment method.</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="font-semibold text-ink-900">After dispatch:</p>
              <p className="text-ink-700 mt-1">Cancellation is <strong>not possible</strong> once the order is shipped. You may raise a quality claim after delivery if the product is defective.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">4. Quality Issues &amp; Returns</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>For orders above <strong>₹1,00,000</strong>, we conduct a 2-step factory quality inspection before dispatch.</li>
            <li>Report any defect or damage <strong>within 24 hours</strong> of delivery.</li>
            <li>An <strong>unboxing video</strong> is mandatory for all quality claims — claims without video evidence cannot be processed.</li>
            <li>If the claim is validated: we offer a <strong>full refund or replacement</strong> at our discretion.</li>
            <li>Refunds for validated quality claims: processed within <strong>7–10 business days</strong> to the original payment method.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">5. How to Request a Refund (If Payment Was Made)</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Email <a href="mailto:refunds@thegrowsetu.com" className="text-brand-primary-600 underline">refunds@thegrowsetu.com</a> with your <strong>Order ID</strong> and reason.</li>
            <li>Attach your <strong>unboxing video</strong> for quality-related claims.</li>
            <li>Our team will respond within <strong>2 business days</strong>.</li>
            <li>Approved refunds are processed within <strong>7–10 business days</strong>.</li>
          </ol>
        </section>

        {/* Section 6 — Refund Timeline Table */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">6. Refund Timeline Summary</h2>
          <div className="overflow-x-auto rounded-xl border border-ink-200 mt-3">
            <table className="w-full text-sm">
              <thead className="bg-ink-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-ink-900">Situation</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-900">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-900">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                <tr>
                  <td className="px-4 py-3">Pool fails to reach target</td>
                  <td className="px-4 py-3 text-green-700 font-medium">Nothing (never paid)</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Cancel before pool fills</td>
                  <td className="px-4 py-3 text-green-700 font-medium">Nothing (never paid)</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Cancel after pool fills, before payment</td>
                  <td className="px-4 py-3 text-green-700 font-medium">Nothing (never paid)</td>
                  <td className="px-4 py-3">N/A</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Cancel after payment, before dispatch</td>
                  <td className="px-4 py-3 font-medium">95% of amount paid</td>
                  <td className="px-4 py-3">7–10 business days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Quality issue (validated with unboxing video)</td>
                  <td className="px-4 py-3 font-medium">Full refund or replacement</td>
                  <td className="px-4 py-3">7–10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">7. Non-Refundable Cases</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Change of mind after delivery</li>
            <li>Products that have been used or damaged by the buyer</li>
            <li>Quality claims submitted without an unboxing video</li>
            <li>Custom orders with the buyer&apos;s own branding/logo</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">8. Contact</h2>
          <p>For refund or cancellation queries, email <a href="mailto:refunds@thegrowsetu.com" className="text-brand-primary-600 underline">refunds@thegrowsetu.com</a>. Our team typically responds within 2 business days.</p>
        </section>

      </div>
    </div>
  );
}
