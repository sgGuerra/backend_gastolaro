import { z } from 'zod';

/**
 * Schema compartido: valida que un param :id sea UUID.
 */
export const uuidParamSchema = z.object({
  id: z.string().uuid('Must be a valid UUID'),
});

/**
 * Schema compartido: paginación base (query params).
 */
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().int().positive('Page must be a positive integer')),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform(Number)
    .pipe(z.number().int().min(1).max(100, 'Limit must be between 1 and 100')),
  startDate: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
  endDate: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
});
