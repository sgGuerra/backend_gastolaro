import { Goal } from '../entities/goal.entity';
import { PaginatedResponse, GoalFilters } from '../types/pagination.types';

/**
 * Contrato del repositorio de metas.
 */
export interface IGoalRepository {
  create(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal>;
  findAllByUser(userId: string, filters: GoalFilters): Promise<PaginatedResponse<Goal>>;
  findById(id: string, userId: string): Promise<Goal | null>;
  update(id: string, userId: string, data: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Goal | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
