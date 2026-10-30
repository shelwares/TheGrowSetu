import { z } from 'zod';

export const JoinPoolSchema = z.object({
  poolId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const UpdateProfileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(100, 'Full name is too long')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone is too long')
    .regex(/^[+\d\s\-()]+$/, 'Invalid phone format')
    .optional()
    .or(z.literal('')),
  company_name: z
    .string()
    .trim()
    .max(200, 'Company name is too long')
    .optional()
    .or(z.literal('')),
  address_line1: z.string().trim().min(5, 'Address is required').max(200),
  address_line2: z.string().trim().max(200).optional().or(z.literal('')),
  area: z.string().trim().min(2, 'Area is required').max(100),
  city: z.string().trim().min(2, 'City is required').max(100),
  district: z.string().trim().min(2, 'District is required').max(100),
  state: z.string().trim().min(2, 'State is required').max(100),
  pincode: z.string().trim().regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  country: z.string().trim().default('India'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number'),
});

export const SignupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number'),
  full_name: z.string().min(1, 'Full name required'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  company_name: z.string().min(2).max(100).optional(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  category: z.string().min(1).max(100),
  base_image: z.string().optional(),
});

export const ProductSchema = CreateProductSchema;
export const UpdateProductSchema = CreateProductSchema;


export const CreatePoolSchema = z.object({
  product_id: z.string().uuid(),
  target_quantity: z.number().int().positive(),
  deadline: z.string().datetime({ offset: true }).or(z.string()), // Accept ISO dates or valid strings
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['joined', 'confirmed', 'shipped', 'delivered', 'cancelled']),
});
