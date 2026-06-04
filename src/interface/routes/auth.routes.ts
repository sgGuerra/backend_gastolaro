import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../../application/dtos/auth.dto';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Body validado con Zod (registerSchema).
 */
router.post('/register', validateBody(registerSchema), AuthController.register);

/**
 * POST /api/v1/auth/login
 * Body validado con Zod (loginSchema).
 */
router.post('/login', validateBody(loginSchema), AuthController.login);

export default router;
