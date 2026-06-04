import { Expense } from '../entities/expense.entity';
import { PaginatedResponse, ExpenseFilters } from '../types/pagination.types';

/**
 * Contrato del repositorio de gastos.
 */
export interface IExpenseRepository {
  create(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense>;
  findAllByUser(userId: string, filters: ExpenseFilters): Promise<PaginatedResponse<Expense>>;
  findById(id: string, userId: string): Promise<Expense | null>;
  update(id: string, userId: string, data: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Expense | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
