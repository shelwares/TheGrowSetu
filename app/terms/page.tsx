import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using the TheGrowSetu B2B pooled buying platform.',
  alternates: { canonical: 'https://thegrowsetu.com/terms' },
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-ink-900 mb-2">Terms & Conditions</h1>
      <p className="text-ink-500 mb-8">Last updated: 25 September 2026</p>

      <div className="prose prose-ink max-w-none space-y-6 text-ink-700">
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using TheGrowSetu ("the Platform"), you accept and agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the Platform.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">2. About TheGrowSetu</h2>
          <p>TheGrowSetu is a B2B demand aggregation platform that pools orders from multiple buyers to unlock factory-direct pricing. We act as an aggregator and brand, sourcing products from verified manufacturers and delivering to buyers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">3. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate and complete information during registration.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must be at least 18 years old to use the Platform.</li>
            <li>We reserve the right to suspend accounts that violate these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">4. Pool Ordering & Pricing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Buyers join product pools by committing to a quantity.</li>
            <li>Product prices decrease as total pool quantity increases (dynamic pricing).</li>
            <li>Delivery fees are calculated based on each buyer's individual quantity.</li>
            <li>Once a pool closes and is confirmed, orders cannot be cancelled.</li>
            <li>If a pool fails to reach its minimum target, all committed amounts are refunded.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">5. Payment Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>No payment is collected when joining a pool.</li>
            <li>Payment is collected only after the pool closes successfully.</li>
            <li>We currently accept UPI, bank transfer, and other manual payment methods.</li>
            <li>Payment gateway integration is planned for future releases.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">6. Quality Control & Delivery</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>We perform 2-step quality checks: at the factory and at delivery.</li>
            <li>Products are inspected before dispatch.</li>
            <li>Delivery timelines depend on supplier lead times and logistics partners.</li>
            <li>We are not liable for delays caused by external factors (weather, strikes, etc.).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">7. Prohibited Activities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Using the Platform for illegal activities.</li>
            <li>Attempting to bypass our payment or delivery systems.</li>
            <li>Impersonating other users or entities.</li>
            <li>Attempting to contact suppliers directly to bypass the Platform.</li>
            <li>Posting false reviews or misleading information.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">8. Limitation of Liability</h2>
          <p>TheGrowSetu shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Platform. Our total liability shall not exceed the amount paid by the user for the specific order in question.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">9. Intellectual Property</h2>
          <p>All content on the Platform — including logos, text, and design — is owned by TheGrowSetu and protected by applicable laws. You may not reproduce or redistribute any content without permission.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">10. Changes to Terms</h2>
          <p>We reserve the right to update these terms at any time. Continued use of the Platform after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">11. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Maharashtra.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">12. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:support@thegrowsetu.com" className="text-brand-primary-600 underline">support@thegrowsetu.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
