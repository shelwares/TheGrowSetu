import type { Metadata } from 'next'
import ContactForm from './ContactForm'

const BUSINESS_PHONE = "+91 8805984797";
const BUSINESS_ADDRESS = "Ulhasnagar, Maharashtra, India — Serving Pan India";

export const metadata: Metadata = {
  title: 'Contact TheGrowSetu',
  description: 'Get in touch with the TheGrowSetu team. Email support@thegrowsetu.com or use our contact form. We respond within 24 hours.',
  alternates: { canonical: 'https://thegrowsetu.com/contact' },
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-ink-900 mb-2">Contact Us</h1>
      <p className="text-ink-500 mb-8">We would love to hear from you</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-ink-200 p-6">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Get in Touch</h2>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-ink-500 uppercase mb-1">Customer Support</p>
              <a href="mailto:support@thegrowsetu.com" className="text-brand-primary-600 hover:underline">
                support@thegrowsetu.com
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink-500 uppercase mb-1">Refunds & Complaints</p>
              <a href="mailto:refunds@thegrowsetu.com" className="text-brand-primary-600 hover:underline">
                refunds@thegrowsetu.com
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink-500 uppercase mb-1">Business Enquiries</p>
              <a href="mailto:business@thegrowsetu.com" className="text-brand-primary-600 hover:underline">
                business@thegrowsetu.com
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink-500 uppercase mb-1">Grievance Officer (DPDP)</p>
              <a href="mailto:dpo@thegrowsetu.com" className="text-brand-primary-600 hover:underline">
                dpo@thegrowsetu.com
              </a>
              <p className="text-xs text-ink-500 mt-1">Response within 30 days</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink-500 uppercase mb-1">Phone</p>
              <a href={`tel:${BUSINESS_PHONE.replace(/\s+/g, '')}`} className="text-brand-primary-600 hover:underline">
                {BUSINESS_PHONE}
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink-500 uppercase mb-1">Business Hours</p>
              <p className="text-ink-700 text-sm">
                Monday – Saturday<br />
                10:00 AM – 7:00 PM IST
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ink-200 p-6">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Send us a Message</h2>
          <ContactForm />
        </div>
      </div>

      <div className="mt-12 bg-brand-primary-50 rounded-2xl p-6 border border-brand-primary-100">
        <h2 className="text-lg font-bold text-ink-900 mb-2">Registered Office</h2>
        <p className="text-ink-700 text-sm">
          TheGrowSetu<br />
          {BUSINESS_ADDRESS}
        </p>
      </div>
    </div>
  );
}
