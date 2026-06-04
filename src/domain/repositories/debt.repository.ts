import { Debt } from '../entities/debt.entity';
import { PaginatedResponse, PaginationParams } from '../types/pagination.types';

/**
 * Contrato del repositorio de deudas.
 */
export interface IDebtRepository {
  create(debt: Omit<Debt, 'id' | 'created_at' | 'updated_at'>): Promise<Debt>;
  findAllByUser(userId: string, params: PaginationParams): Promise<PaginatedResponse<Debt>>;
  findById(id: string, userId: string): Promise<Debt | null>;
  update(id: string, userId: string, data: Partial<Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Debt | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
