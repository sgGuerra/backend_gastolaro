import { z } from 'zod';

/**
 * Schema de registro de usuario.
 */
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin']).optional().default('user'),
  profile_type: z.string().optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;

/**
 * Schema de login.
 */
export const loginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;
