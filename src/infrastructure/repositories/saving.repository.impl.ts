import pool from '../database/connection';
import { ISavingRepository } from '../../domain/repositories/saving.repository';
import { Saving } from '../../domain/entities/saving.entity';
import { PaginatedResponse, PaginationParams } from '../../domain/types/pagination.types';

export class SavingRepositoryImpl implements ISavingRepository {
  async create(saving: Omit<Saving, 'id' | 'created_at' | 'updated_at'>): Promise<Saving> {
    const query = `
      INSERT INTO savings (user_id, name, amount, source, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      saving.user_id,
      saving.name,
      saving.amount,
      saving.source,
      saving.date,
    ];

    const result = await pool.query(query, values);
    return result.rows[0] as Saving;
  }

  async findAllByUser(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Saving>> {
    const conditions: string[] = ['user_id = $1'];
    const values: (string | number)[] = [userId];
    let paramIndex = 2;

    if (params.startDate) {
      conditions.push(`date >= $${paramIndex}`);
      values.push(params.startDate);
      paramIndex++;
    }

    if (params.endDate) {
      conditions.push(`date <= $${paramIndex}`);
      values.push(params.endDate);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM savings WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = parseInt(countResult.rows[0].count, 10);

    const offset = (params.page - 1) * params.limit;
    const dataQuery = `
      SELECT * FROM savings
      WHERE ${whereClause}
      ORDER BY date DESC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await pool.query(dataQuery, [...values, params.limit, offset]);

    return {
      data: dataResult.rows as Saving[],
      meta: {
        page: params.page,
        limit: params.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / params.limit),
      },
    };
  }

  async findById(id: string, userId: string): Promise<Saving | null> {
    const query = `SELECT * FROM savings WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);
    return (result.rows[0] as Saving) || null;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Omit<Saving, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
  ): Promise<Saving | null> {
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
      UPDATE savings
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;
    values.push(id, userId);

    const result = await pool.query(query, values);
    return (result.rows[0] as Saving) || null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const query = `DELETE FROM savings WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
