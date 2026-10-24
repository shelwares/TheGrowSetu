import { z } from 'zod'

export const TIMELINE_OPTIONS = [
  'Urgent (Within 2 weeks)',
  '1 Month',
  '2-3 Months',
] as const

export const ProductRequestSchema = z.object({
  product_name: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .max(255, 'Product name is too long'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than 0'),
  timeline: z.string().min(1, 'Please select a timeline'),
  additional_details: z
    .string()
    .trim()
    .max(1500, 'Additional details cannot exceed 1500 characters')
    .optional()
    .or(z.literal('')),
})

export type ProductRequestInput = z.infer<typeof ProductRequestSchema>

export interface ProductRequestRecord {
  id: string
  buyer_id: string
  product_name: string
  quantity: number
  timeline: string
  additional_details: string | null
  status: 'pending' | 'reviewing' | 'sourced' | 'rejected'
  created_at: string
  profiles?:
    | {
        full_name?: string | null
        company_name?: string | null
        phone?: string | null
      }
    | {
        full_name?: string | null
        company_name?: string | null
        phone?: string | null
      }[]
    | null
}
