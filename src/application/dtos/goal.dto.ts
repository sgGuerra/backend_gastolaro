import { z } from 'zod';
import { paginationQuerySchema } from './shared.dto';

/**
 * Schema para crear una meta.
 */
export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  target_amount: z.number().positive('Target amount must be a positive number'),
  current_amount: z.number().min(0, 'Current amount must be >= 0').optional().default(0),
  deadline: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  status: z.enum(['active', 'completed']).optional().default('active'),
});

export type CreateGoalDto = z.infer<typeof createGoalSchema>;

/**
 * Schema para actualizar una meta.
 */
export const updateGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  target_amount: z.number().positive('Target amount must be a positive number').optional(),
  current_amount: z.number().min(0, 'Current amount must be >= 0').optional(),
  deadline: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
  status: z.enum(['active', 'completed']).optional(),
});

export type UpdateGoalDto = z.infer<typeof updateGoalSchema>;

/**
 * Schema para query params de listado de metas.
 */
export const goalQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['active', 'completed']).optional(),
});

export type GoalQueryDto = z.infer<typeof goalQuerySchema>;
