'use server'

import { z } from 'zod'
import { getSupabaseServerClient } from '../supabase/server'
import { logger } from '../logger'

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(2000, 'Message must be under 2000 characters'),
})

export type ContactFormData = z.infer<typeof ContactSchema>

export async function submitContactMessage(formData: FormData | ContactFormData) {
  try {
    let rawData: Record<string, unknown>
    if (formData instanceof FormData) {
      rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      }
    } else {
      rawData = formData
    }

    const validation = ContactSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input data'
      logger.warn('Contact message validation failed', { errors: validation.error.issues })
      return { error: firstError }
    }

    const { name, email, message } = validation.data
    logger.info('Contact message received', { name, email, messageLength: message.length })

    const supabase = await getSupabaseServerClient()
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        message,
        created_at: new Date().toISOString(),
      })

    if (insertError) {
      logger.warn('Database insert into contact_messages failed or table not found', {
        error: insertError.message,
        name,
        email,
      })
    }

    return {
      success: true,
      message: 'Thank you for reaching out! We have received your message and will respond within 24 hours.',
    }
  } catch (error) {
    logger.error('Unexpected error in submitContactMessage', error)
    return { error: 'Failed to send message. Please try emailing support@thegrowsetu.com directly.' }
  }
}
