import pool from '../database/connection';
import { IExpenseRepository } from '../../domain/repositories/expense.repository';
import { Expense } from '../../domain/entities/expense.entity';
import { PaginatedResponse, ExpenseFilters } from '../../domain/types/pagination.types';

/**
 * Implementación concreta del repositorio de gastos.
 * Cada query filtra por user_id para seguridad a nivel de datos.
 */
export class ExpenseRepositoryImpl implements IExpenseRepository {
  async create(
    expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Expense> {
    const query = `
      INSERT INTO expenses (user_id, category, description, amount, date, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      expense.user_id,
      expense.category,
      expense.description,
      expense.amount,
      expense.date,
      expense.payment_method,
    ];

    const result = await pool.query(query, values);
    return result.rows[0] as Expense;
  }

  async findAllByUser(
    userId: string,
    filters: ExpenseFilters,
  ): Promise<PaginatedResponse<Expense>> {
    const conditions: string[] = ['user_id = $1'];
    const values: (string | number)[] = [userId];
    let paramIndex = 2;

    if (filters.category) {
      conditions.push(`category = $${paramIndex}`);
      values.push(filters.category);
      paramIndex++;
    }

    if (filters.startDate) {
      conditions.push(`date >= $${paramIndex}`);
      values.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      conditions.push(`date <= $${paramIndex}`);
      values.push(filters.endDate);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    // Contar total
    const countQuery = `SELECT COUNT(*) FROM expenses WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = parseInt(countResult.rows[0].count, 10);

    // Paginación
    const offset = (filters.page - 1) * filters.limit;
    const dataQuery = `
      SELECT * FROM expenses
      WHERE ${whereClause}
      ORDER BY date DESC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await pool.query(dataQuery, [...values, filters.limit, offset]);

    return {
      data: dataResult.rows as Expense[],
      meta: {
        page: filters.page,
        limit: filters.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / filters.limit),
      },
    };
  }

  async findById(id: string, userId: string): Promise<Expense | null> {
    const query = `SELECT * FROM expenses WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);
    return (result.rows[0] as Expense) || null;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
  ): Promise<Expense | null> {
    const fields: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value as string | number);
        paramIndex++;
      }
    }

    if (fields.length === 0) return this.findById(id, userId);

    fields.push(`updated_at = now()`);

    const query = `
      UPDATE expenses
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;
    values.push(id, userId);

    const result = await pool.query(query, values);
    return (result.rows[0] as Expense) || null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const query = `DELETE FROM expenses WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
