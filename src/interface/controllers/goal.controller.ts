import { Request, Response } from 'express';
import { GoalRepositoryImpl } from '../../infrastructure/repositories/goal.repository.impl';

const goalRepository = new GoalRepositoryImpl();

/**
 * Controller de metas.
 * Implementa CRUD completo con paginación y filtros.
 */
export class GoalController {
  /**
   * POST /api/v1/goals — Crear meta
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const goal = await goalRepository.create({
        ...req.body,
        user_id: userId,
      });

      res.status(201).json({ data: goal });
    } catch (error) {
      console.error('[GoalController.create]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/goals — Listar metas (paginado + filtros)
   */
  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { page, limit, status, startDate, endDate } = req.query as unknown as {
        page: number;
        limit: number;
        status?: 'active' | 'completed';
        startDate?: string;
        endDate?: string;
      };

      const result = await goalRepository.findAllByUser(userId, {
        page: Number(page),
        limit: Number(limit),
        status,
        startDate,
        endDate,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('[GoalController.findAll]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/goals/:id — Detalle de una meta
   */
  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const goal = await goalRepository.findById(req.params.id as string, userId);

      if (!goal) {
        res.status(404).json({ message: 'Goal not found' });
        return;
      }

      res.status(200).json({ data: goal });
    } catch (error) {
      console.error('[GoalController.findById]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * PUT /api/v1/goals/:id — Editar meta
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const goal = await goalRepository.update(req.params.id as string, userId, req.body);

      if (!goal) {
        res.status(404).json({ message: 'Goal not found' });
        return;
      }

      res.status(200).json({ data: goal });
    } catch (error) {
      console.error('[GoalController.update]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/v1/goals/:id — Eliminar meta
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const deleted = await goalRepository.delete(req.params.id as string, userId);

      if (!deleted) {
        res.status(404).json({ message: 'Goal not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('[GoalController.delete]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
