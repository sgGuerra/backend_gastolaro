import { z } from 'zod';
import { paginationQuerySchema } from './shared.dto';

/**
 * Schema para crear un gasto.
 */
export const createExpenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional().default(''),
  amount: z.number().positive('Amount must be a positive number'),
  date: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  payment_method: z.string().optional().default(''),
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;

/**
 * Schema para actualizar un gasto (todos los campos opcionales).
 */
export const updateExpenseSchema = z.object({
  category: z.string().min(1, 'Category is required').optional(),
  description: z.string().optional(),
  amount: z.number().positive('Amount must be a positive number').optional(),
  date: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
  payment_method: z.string().optional(),
});

export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;

/**
 * Schema para query params de listado de gastos (extiende paginación).
 */
export const expenseQuerySchema = paginationQuerySchema.extend({
  category: z.string().optional(),
});

export type ExpenseQueryDto = z.infer<typeof expenseQuerySchema>;
