import { Saving } from '../entities/saving.entity';
import { PaginatedResponse, PaginationParams } from '../types/pagination.types';

/**
 * Contrato del repositorio de ahorros.
 */
export interface ISavingRepository {
  create(saving: Omit<Saving, 'id' | 'created_at' | 'updated_at'>): Promise<Saving>;
  findAllByUser(userId: string, params: PaginationParams): Promise<PaginatedResponse<Saving>>;
  findById(id: string, userId: string): Promise<Saving | null>;
  update(id: string, userId: string, data: Partial<Omit<Saving, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Saving | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
