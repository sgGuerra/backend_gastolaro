import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Formatea errores de Zod al formato requerido por la rúbrica:
 * { message: "Validation error", details: [{ field, message }] }
 */
const formatZodError = (error: ZodError) => {
  return {
    message: 'Validation error',
    details: error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
};

/**
 * Valida req.body contra un schema Zod.
 * Si falla → 400 con { message, details }.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json(formatZodError(result.error));
      return;
    }
    req.body = result.data;
    next();
  };
};

/**
 * Valida req.query contra un schema Zod.
 * Si falla → 400 con { message, details }.
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json(formatZodError(result.error));
      return;
    }
    req.query = result.data;
    next();
  };
};

/**
 * Valida req.params contra un schema Zod.
 * Si falla → 400 con { message, details }.
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json(formatZodError(result.error));
      return;
    }
    next();
  };
};
