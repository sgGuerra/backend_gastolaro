import { Request, Response } from 'express';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user.repository.impl';

const userRepository = new UserRepositoryImpl();

/**
 * Controller de administración de usuarios.
 * Rutas protegidas por authorize('admin').
 */
export class UserController {
  /**
   * GET /api/v1/users — Listar todos los usuarios
   */
  static async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userRepository.findAll();
      res.status(200).json({ data: users });
    } catch (error) {
      console.error('[UserController.findAll]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/v1/users/:id — Eliminar usuario
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id as string;
      
      // Asegurarse de que el usuario existe antes de borrar
      const user = await userRepository.findById(userId);
      if (!user) {
         res.status(404).json({ message: 'User not found' });
         return;
      }
      
      await userRepository.delete(userId);

      res.status(204).send();
    } catch (error) {
      console.error('[UserController.delete]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
