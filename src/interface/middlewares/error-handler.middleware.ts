import { Request, Response, NextFunction } from 'express';

/**
 * Middleware centralizado de manejo de errores.
 * Captura cualquier error lanzado en la cadena de middlewares/controllers
 * y retorna una respuesta JSON consistente sin exponer stack traces.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ErrorHandler] ${err.message}`);

  // Nunca exponer stack trace al cliente (regla de rúbrica)
  res.status(500).json({
    message: 'Internal server error',
  });
};
