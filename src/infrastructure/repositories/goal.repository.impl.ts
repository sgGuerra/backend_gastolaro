import pool from '../database/connection';
import { IGoalRepository } from '../../domain/repositories/goal.repository';
import { Goal } from '../../domain/entities/goal.entity';
import { PaginatedResponse, GoalFilters } from '../../domain/types/pagination.types';

/**
 * Implementación concreta del repositorio de metas.
 */
export class GoalRepositoryImpl implements IGoalRepository {
  async create(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal> {
    const query = `
      INSERT INTO goals (user_id, title, description, target_amount, current_amount, deadline, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      goal.user_id,
      goal.title,
      goal.description || '',
      goal.target_amount,
      goal.current_amount || 0,
      goal.deadline,
      goal.status || 'active',
    ];

    const result = await pool.query(query, values);
    return result.rows[0] as Goal;
  }

  async findAllByUser(
    userId: string,
    filters: GoalFilters,
  ): Promise<PaginatedResponse<Goal>> {
    const conditions: string[] = ['user_id = $1'];
    const values: (string | number)[] = [userId];
    let paramIndex = 2;

    if (filters.status) {
      conditions.push(`status = $${paramIndex}`);
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.startDate) {
      conditions.push(`deadline >= $${paramIndex}`);
      values.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      conditions.push(`deadline <= $${paramIndex}`);
      values.push(filters.endDate);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    const countQuery = `SELECT COUNT(*) FROM goals WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const totalItems = parseInt(countResult.rows[0].count, 10);

    const offset = (filters.page - 1) * filters.limit;
    const dataQuery = `
      SELECT * FROM goals
      WHERE ${whereClause}
      ORDER BY deadline ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await pool.query(dataQuery, [...values, filters.limit, offset]);

    return {
      data: dataResult.rows as Goal[],
      meta: {
        page: filters.page,
        limit: filters.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / filters.limit),
      },
    };
  }

  async findById(id: string, userId: string): Promise<Goal | null> {
    const query = `SELECT * FROM goals WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);
    return (result.rows[0] as Goal) || null;
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
  ): Promise<Goal | null> {
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
      UPDATE goals
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `;
    values.push(id, userId);

    const result = await pool.query(query, values);
    return (result.rows[0] as Goal) || null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const query = `DELETE FROM goals WHERE id = $1 AND user_id = $2`;
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}
