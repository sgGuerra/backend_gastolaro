import { z } from 'zod';
import { paginationQuerySchema } from './shared.dto';

/**
 * Schema para crear un ahorro.
 */
export const createSavingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().positive('Amount must be a positive number'),
  source: z.string().optional().default(''),
  date: z.string().date('Must be a valid date (YYYY-MM-DD)'),
});

export type CreateSavingDto = z.infer<typeof createSavingSchema>;

/**
 * Schema para actualizar un ahorro.
 */
export const updateSavingSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  amount: z.number().positive('Amount must be a positive number').optional(),
  source: z.string().optional(),
  date: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
});

export type UpdateSavingDto = z.infer<typeof updateSavingSchema>;

/**
 * Schema para query params de listado de ahorros.
 */
export const savingQuerySchema = paginationQuerySchema;

export type SavingQueryDto = z.infer<typeof savingQuerySchema>;
