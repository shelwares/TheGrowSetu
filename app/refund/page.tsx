export const metadata = {
  title: 'Refund Policy | TheGrowSetu',
  description: 'Refund and cancellation policy for TheGrowSetu orders',
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-ink-900 mb-2">Refund Policy</h1>
      <p className="text-ink-500 mb-8">Last updated: 25 September 2026</p>

      <div className="prose prose-ink max-w-none space-y-6 text-ink-700">
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">1. Overview</h2>
          <p>At TheGrowSetu, we want you to be satisfied with your purchase. This policy outlines when and how refunds are processed.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">2. Pool Failure Refunds</h2>
          <p className="mb-3">If a pool does not reach its minimum target quantity by the deadline:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>100% refund</strong> of all payments made</li>
            <li>Refund processed within <strong>5-7 business days</strong></li>
            <li>Refunded to the original payment method (UPI/bank account)</li>
            <li>No deduction or cancellation fee</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">3. Quality Issues</h2>
          <p className="mb-3">If you receive a defective or damaged product:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Report within <strong>24 hours</strong> of delivery</li>
            <li>Provide an <strong>unboxing video</strong> as proof</li>
            <li>Our QC team will review the complaint</li>
            <li>If valid: <strong>Full refund or replacement</strong> offered</li>
            <li>If invalid: No refund (unboxing video required as per terms)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">4. Cancellation by Buyer</h2>
          <p className="mb-3">Cancellations are permitted only in the following cases:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Before pool closes:</strong> 100% refund (no questions asked)</li>
            <li><strong>After pool closes, before dispatch:</strong> 90% refund (10% handling fee)</li>
            <li><strong>After dispatch:</strong> No refund (order already shipped)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">5. Non-Refundable Cases</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Change of mind after delivery</li>
            <li>Products that have been used or damaged by buyer</li>
            <li>Orders where unboxing video is not provided for quality claims</li>
            <li>Custom orders with buyer's own branding/logo</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">6. How to Request a Refund</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Email <a href="mailto:refunds@thegrowsetu.com" className="text-brand-primary-600 underline">refunds@thegrowsetu.com</a> with your order ID</li>
            <li>Attach supporting evidence (video/photos if applicable)</li>
            <li>Our team will respond within 2 business days</li>
            <li>Approved refunds are processed within 5-7 business days</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">7. Refund Timeline</h2>
          <table className="w-full border border-ink-200 rounded-lg overflow-hidden mt-3">
            <thead className="bg-ink-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Refund Type</th>
                <th className="text-left px-4 py-2 font-semibold">Processing Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              <tr><td className="px-4 py-2">Pool failure</td><td className="px-4 py-2">5-7 business days</td></tr>
              <tr><td className="px-4 py-2">Quality issue</td><td className="px-4 py-2">7-10 business days</td></tr>
              <tr><td className="px-4 py-2">Buyer cancellation (pre-close)</td><td className="px-4 py-2">5-7 business days</td></tr>
              <tr><td className="px-4 py-2">Buyer cancellation (post-close)</td><td className="px-4 py-2">7-10 business days</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">8. Contact</h2>
          <p>For refund queries, email <a href="mailto:refunds@thegrowsetu.com" className="text-brand-primary-600 underline">refunds@thegrowsetu.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
