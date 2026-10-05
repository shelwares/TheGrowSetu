import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How TheGrowSetu collects, uses, and protects your personal data in accordance with DPDP Act 2023.',
  alternates: { canonical: 'https://thegrowsetu.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-ink-900 mb-2">Privacy Policy</h1>
      <p className="text-ink-500 mb-8">Last updated: 25 September 2026</p>

      <div className="prose prose-ink max-w-none space-y-6 text-ink-700">
        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">1. Introduction</h2>
          <p>TheGrowSetu ("we", "us", "our") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">2. Information We Collect</h2>
          <p className="mb-3">We collect the following information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email, phone number, company name</li>
            <li><strong>Delivery Information:</strong> Full address (address line, area, city, district, state, PIN code, country)</li>
            <li><strong>Order Information:</strong> Products, quantities, order history, payment status</li>
            <li><strong>Technical Information:</strong> IP address, device type, browser, pages visited</li>
            <li><strong>Authentication:</strong> Login timestamps, session data, Google account info (if using Google sign-in)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To create and manage your account</li>
            <li>To process and deliver your orders</li>
            <li>To communicate order status, confirmations, and updates</li>
            <li>To improve our Platform and user experience</li>
            <li>To prevent fraud and ensure Platform security</li>
            <li>To comply with legal requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">4. Information Sharing</h2>
          <p className="mb-3">We do NOT sell your personal information. We share data only with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Suppliers:</strong> Product, quantity, and delivery address (for order fulfillment)</li>
            <li><strong>Logistics Partners:</strong> Name, phone, and delivery address (for delivery)</li>
            <li><strong>Service Providers:</strong> Hosting (Vercel), database (Supabase), email (Brevo/Resend) — bound by confidentiality</li>
            <li><strong>Legal Authorities:</strong> When required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">5. Data Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All data is encrypted in transit (HTTPS) and at rest.</li>
            <li>Passwords are hashed — we never store them in plain text.</li>
            <li>Sessions use secure, HttpOnly cookies.</li>
            <li>Row-level security (RLS) ensures users can only access their own data.</li>
            <li>We regularly audit our systems for security vulnerabilities.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">6. Your Rights</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct your information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Portability:</strong> Request your data in a portable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
          </ul>
          <p className="mt-3">To exercise these rights, email <a href="mailto:privacy@thegrowsetu.com" className="text-brand-primary-600 underline">privacy@thegrowsetu.com</a>.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">7. Cookies</h2>
          <p>We use essential cookies only — for authentication and session management. We do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">8. Third-Party Services</h2>
          <p>We use the following trusted services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Supabase (database & authentication)</li>
            <li>Vercel (hosting)</li>
            <li>Brevo (transactional emails)</li>
            <li>Google OAuth (optional sign-in)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">9. Data Retention</h2>
          <p>We retain your data as long as your account is active. After account deletion, we retain minimal data for legal compliance (up to 7 years for tax records).</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">10. Children's Privacy</h2>
          <p>Our Platform is not intended for users under 18. We do not knowingly collect data from minors.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">11. Changes to This Policy</h2>
          <p>We may update this policy periodically. Material changes will be notified via email or Platform announcement.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">12. Consent</h2>
          <p>
            By creating an account, you explicitly consent to the collection and processing of your personal data as described in this policy. You must be 18 years or older to use the Platform.
          </p>
          <p className="mt-3">
            You may withdraw your consent at any time by:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Deleting your account from Dashboard → Profile settings</li>
            <li>Emailing <a href="mailto:privacy@thegrowsetu.com" className="text-brand-primary-600 underline">privacy@thegrowsetu.com</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">13. Grievance Officer</h2>
          <p>In accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the details of our Grievance Officer are:</p>
          <div className="bg-ink-50 rounded-lg p-4 mt-3">
            <p><strong>Name:</strong> Data Protection Officer</p>
            <p><strong>Email:</strong> <a href="mailto:dpo@thegrowsetu.com" className="text-brand-primary-600 underline">dpo@thegrowsetu.com</a></p>
            <p><strong>Response Time:</strong> Within 30 days of receiving the complaint</p>
            <p className="mt-2 text-sm text-ink-600">TheGrowSetu, Maharashtra, India</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">14. Data Breach Notification</h2>
          <p>
            In the event of a personal data breach, we will:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Notify the Data Protection Board of India within <strong>72 hours</strong></li>
            <li>Inform affected users without undue delay</li>
            <li>Provide details of the breach and steps taken</li>
            <li>Offer support and remediation where applicable</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink-900 mt-8 mb-3">15. Contact</h2>
          <p>For privacy concerns, contact us at <a href="mailto:privacy@thegrowsetu.com" className="text-brand-primary-600 underline">privacy@thegrowsetu.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
