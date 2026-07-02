// ============================================================
// Anchor — Auth Zod Validation Schemas
// ============================================================

import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: 'Please enter a valid email address' }
    ),
  timezone: z.string().optional(),
  fcmToken: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

export type LoginFormData = z.infer<typeof loginSchema>;