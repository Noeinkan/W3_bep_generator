import { z } from 'zod';

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
});

/**
 * Registration schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please provide a valid email address')
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});
