import pool from '../database/connection';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { User, SafeUser } from '../../domain/entities/user.entity';

/**
 * Implementación concreta del repositorio de usuarios.
 * Usa pg Pool para ejecutar queries SQL contra PostgreSQL (Supabase).
 */
export class UserRepositoryImpl implements IUserRepository {
  async create(
    userData: Omit<User, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<SafeUser> {
    const query = `
      INSERT INTO users (name, email, password_hash, role, profile_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, profile_type, created_at, updated_at
    `;
    const values = [
      userData.name,
      userData.email,
      userData.password_hash,
      userData.role,
      userData.profile_type || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0] as SafeUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return (result.rows[0] as User) || null;
  }

  async findById(id: string): Promise<SafeUser | null> {
    const query = `
      SELECT id, name, email, role, profile_type, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return (result.rows[0] as SafeUser) || null;
  }

  async findAll(): Promise<SafeUser[]> {
    const query = `
      SELECT id, name, email, role, profile_type, created_at, updated_at
      FROM users ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows as SafeUser[];
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM users WHERE id = $1`;
    await pool.query(query, [id]);
  }
}
