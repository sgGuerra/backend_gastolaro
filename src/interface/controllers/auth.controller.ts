import { Request, Response } from 'express';
import { RegisterUseCase, ConflictError } from '../../application/use-cases/auth/register.use-case';
import { LoginUseCase, AuthenticationError } from '../../application/use-cases/auth/login.use-case';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user.repository.impl';

const userRepository = new UserRepositoryImpl();

/**
 * Controller de autenticación.
 * Recibe req/res, llama al use-case y retorna la respuesta HTTP.
 * NO contiene lógica de negocio.
 */
export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const useCase = new RegisterUseCase(userRepository);
      const result = await useCase.execute(req.body);

      res.status(201).json({
        message: 'User registered successfully',
        data: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof ConflictError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error('[AuthController.register]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const useCase = new LoginUseCase(userRepository);
      const result = await useCase.execute(req.body);

      res.status(200).json({
        message: 'Login successful',
        data: result.user,
        token: result.token,
      });
    } catch (error) {
      if (error instanceof AuthenticationError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      console.error('[AuthController.login]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
