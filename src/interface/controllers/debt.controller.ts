import { Request, Response } from 'express';
import { DebtRepositoryImpl } from '../../infrastructure/repositories/debt.repository.impl';

const debtRepository = new DebtRepositoryImpl();

export class DebtController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const debt = await debtRepository.create({
        ...req.body,
        user_id: userId,
      });

      res.status(201).json({ data: debt });
    } catch (error) {
      console.error('[DebtController.create]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { page, limit, startDate, endDate } = req.query as unknown as {
        page: number;
        limit: number;
        startDate?: string;
        endDate?: string;
      };

      const result = await debtRepository.findAllByUser(userId, {
        page: Number(page),
        limit: Number(limit),
        startDate,
        endDate,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('[DebtController.findAll]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const debt = await debtRepository.findById(req.params.id as string, userId);

      if (!debt) {
        res.status(404).json({ message: 'Debt not found' });
        return;
      }

      res.status(200).json({ data: debt });
    } catch (error) {
      console.error('[DebtController.findById]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const debt = await debtRepository.update(req.params.id as string, userId, req.body);

      if (!debt) {
        res.status(404).json({ message: 'Debt not found' });
        return;
      }

      res.status(200).json({ data: debt });
    } catch (error) {
      console.error('[DebtController.update]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const deleted = await debtRepository.delete(req.params.id as string, userId);

      if (!deleted) {
        res.status(404).json({ message: 'Debt not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('[DebtController.delete]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
