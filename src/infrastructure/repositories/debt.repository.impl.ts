import pool from '../database/connection';
import { IDebtRepository } from '../../domain/repositories/debt.repository';
import { Debt } from '../../domain/entities/debt.entity';
import { PaginatedResponse, PaginationParams } from '../../domain/types/pagination.types';

export class DebtRepositoryImpl implements IDebtRepository {
  async create(debt: Omit<Debt, 'id' | 'created_at' | 'updated_at'>): Promise<Debt> {
    const query = `
      INSERT INTO debts (user_id, creditor, amount, interest_rate, monthly_payment, due_date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      debt.user_id,
      debt.creditor,
      debt.amount,
      debt.interest_rate || 0,
      debt.monthly_payment,
      debt.due_date,
      debt.status || 'active',
    ];

    const result = await pool.query(query, values);
    return result.rows[0] as Debt;
  }

  async findAllByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Debt>> {
    const conditions: string[] = ['user_id = $1'];
    const values: (string | number)[] = [userId];
    let paramIndex = 2;

    if (params.startDate) {
      conditions.push(`due_date >= $${paramIndex}`);
      values.push(params.startDate);
      paramIndex++;
    }

    if (params.endDate) {
      conditions.push(`due_date <= $${paramIndex}`);
      values.push(params.endDate);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM debts WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = parseInt(countResult.rows[0].count, 10);

    const offset = (params.page - 1) * params.limit;
    const dataQuery = `
      SELECT * FROM debts
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await pool.query(dataQuery, [...values, params.limit, offset]);

    return {
      data: dataResult.rows as Debt[],
      meta: {
        page: params.page,
        limit: params.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / params.limit),
      },
    };
  }

  async findById(id: string, userId: string): Promise<Debt | null> {
    const query = `SELECT * FROM debts WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);
    return (result.rows[0] as Debt) || null;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
  ): Promise<Debt | null> {
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
      UPDATE debts
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;
    values.push(id, userId);

    const result = await pool.query(query, values);
    return (result.rows[0] as Debt) || null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const query = `DELETE FROM debts WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
