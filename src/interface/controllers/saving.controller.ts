import { Request, Response } from 'express';
import { SavingRepositoryImpl } from '../../infrastructure/repositories/saving.repository.impl';

const savingRepository = new SavingRepositoryImpl();

export class SavingController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const saving = await savingRepository.create({
        ...req.body,
        user_id: userId,
      });

      res.status(201).json({ data: saving });
    } catch (error) {
      console.error('[SavingController.create]', error);
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

      const result = await savingRepository.findAllByUser(userId, {
        page: Number(page),
        limit: Number(limit),
        startDate,
        endDate,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('[SavingController.findAll]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const saving = await savingRepository.findById(req.params.id as string, userId);

      if (!saving) {
        res.status(404).json({ message: 'Saving not found' });
        return;
      }

      res.status(200).json({ data: saving });
    } catch (error) {
      console.error('[SavingController.findById]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const saving = await savingRepository.update(req.params.id as string, userId, req.body);

      if (!saving) {
        res.status(404).json({ message: 'Saving not found' });
        return;
      }

      res.status(200).json({ data: saving });
    } catch (error) {
      console.error('[SavingController.update]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const deleted = await savingRepository.delete(req.params.id as string, userId);

      if (!deleted) {
        res.status(404).json({ message: 'Saving not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('[SavingController.delete]', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
