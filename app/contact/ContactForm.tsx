'use client'

import { useState } from 'react'
import { submitContactMessage } from '@/lib/actions/contact'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, Send } from 'lucide-react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await submitContactMessage({ name, email, message })
    setLoading(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(res.message || 'Message sent successfully!')
      setSuccess(true)
      setName('')
      setEmail('')
      setMessage('')
    }
  }

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="text-lg font-bold text-ink-900">Message Received!</h3>
        <p className="text-sm text-ink-600">
          Thank you for reaching out. A member of our team will review your inquiry and get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm text-brand-primary-600 font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-ink-700 mb-1">
          Your Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-ink-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 outline-none transition-all"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-ink-700 mb-1">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-ink-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 outline-none transition-all"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-ink-700 mb-1">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="w-full border border-ink-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 outline-none resize-none transition-all"
          placeholder="How can we help your business?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-brand-primary-600 hover:bg-brand-primary-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-ink-500 text-center">
        We typically respond within 24 hours.
      </p>
    </form>
  )
}
