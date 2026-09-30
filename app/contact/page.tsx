export const metadata = {
  title: 'Contact Us | TheGrowSetu',
  description: 'Get in touch with TheGrowSetu team',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-ink-900 mb-2">Contact Us</h1>
      <p className="text-ink-500 mb-8">We'd love to hear from you</p>

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
              <a href="tel:+919999999999" className="text-brand-primary-600 hover:underline">
                +91 99999 99999
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">Your Name</label>
              <input
                type="text"
                className="w-full border border-ink-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-ink-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">Message</label>
              <textarea
                rows={4}
                className="w-full border border-ink-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 outline-none resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <a
              href="mailto:support@thegrowsetu.com"
              className="block w-full text-center bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-semibold py-2.5 rounded-lg transition"
            >
              Send Message
            </a>

            <p className="text-xs text-ink-500 text-center">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-brand-primary-50 rounded-2xl p-6 border border-brand-primary-100">
        <h2 className="text-lg font-bold text-ink-900 mb-2">Registered Office</h2>
        <p className="text-ink-700 text-sm">
          TheGrowSetu<br />
          [Your Business Address]<br />
          Maharashtra, India
        </p>
        <p className="text-xs text-ink-500 mt-3">
          Update this with your actual registered business address.
        </p>
      </div>
    </div>
  );
}
