import { z } from 'zod';
import { paginationQuerySchema } from './shared.dto';

/**
 * Schema para crear una deuda.
 */
export const createDebtSchema = z.object({
  creditor: z.string().min(1, 'Creditor is required'),
  amount: z.number().positive('Amount must be a positive number'),
  interest_rate: z.number().min(0).optional().default(0),
  monthly_payment: z.number().positive().optional(),
  due_date: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
  status: z.enum(['active', 'paid']).optional().default('active'),
});

export type CreateDebtDto = z.infer<typeof createDebtSchema>;

/**
 * Schema para actualizar una deuda.
 */
export const updateDebtSchema = z.object({
  creditor: z.string().min(1, 'Creditor is required').optional(),
  amount: z.number().positive('Amount must be a positive number').optional(),
  interest_rate: z.number().min(0).optional(),
  monthly_payment: z.number().positive().optional(),
  due_date: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
  status: z.enum(['active', 'paid']).optional(),
});

export type UpdateDebtDto = z.infer<typeof updateDebtSchema>;

/**
 * Schema para query params de listado de deudas.
 */
export const debtQuerySchema = paginationQuerySchema;

export type DebtQueryDto = z.infer<typeof debtQuerySchema>;
