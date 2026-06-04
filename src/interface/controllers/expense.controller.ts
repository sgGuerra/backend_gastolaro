import { Request, Response } from 'express';
import { ExpenseRepositoryImpl } from '../../infrastructure/repositories/expense.repository.impl';

const expenseRepository = new ExpenseRepositoryImpl();

/**
 * Controller de gastos.
 * Implementa CRUD completo con paginación y filtros.
 */
export class ExpenseController {
  /**
   * POST /api/v1/expenses — Crear gasto
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const expense = await expenseRepository.create({
        ...req.body,
        user_id: userId,
      });

      res.status(201).json({ data: expense });
    } catch (error) {
      console.error('[ExpenseController.create]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/expenses — Listar gastos (paginado + filtros)
   */
  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { page, limit, category, startDate, endDate } = req.query as unknown as {
        page: number;
        limit: number;
        category?: string;
        startDate?: string;
        endDate?: string;
      };

      const result = await expenseRepository.findAllByUser(userId, {
        page: Number(page),
        limit: Number(limit),
        category,
        startDate,
        endDate,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('[ExpenseController.findAll]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * GET /api/v1/expenses/:id — Detalle de un gasto
   */
  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const expense = await expenseRepository.findById(req.params.id as string, userId);

      if (!expense) {
        res.status(404).json({ message: 'Expense not found' });
        return;
      }

      res.status(200).json({ data: expense });
    } catch (error) {
      console.error('[ExpenseController.findById]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * PUT /api/v1/expenses/:id — Editar gasto
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const expense = await expenseRepository.update(req.params.id as string, userId, req.body);

      if (!expense) {
        res.status(404).json({ message: 'Expense not found' });
        return;
      }

      res.status(200).json({ data: expense });
    } catch (error) {
      console.error('[ExpenseController.update]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/v1/expenses/:id — Eliminar gasto
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const deleted = await expenseRepository.delete(req.params.id as string, userId);

      if (!deleted) {
        res.status(404).json({ message: 'Expense not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('[ExpenseController.delete]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
