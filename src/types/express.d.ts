/**
 * Extensión de tipos de Express para inyectar req.user
 * desde el middleware authenticate.
 */
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'user' | 'admin';
    };
  }
}
