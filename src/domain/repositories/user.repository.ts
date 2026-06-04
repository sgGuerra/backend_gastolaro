import { User, SafeUser } from '../entities/user.entity';

/**
 * Contrato del repositorio de usuarios.
 * La implementación concreta vive en infrastructure/repositories/.
 */
export interface IUserRepository {
  create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<SafeUser>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<SafeUser | null>;
  findAll(): Promise<SafeUser[]>;
  delete(id: string): Promise<void>;
}
