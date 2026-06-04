/**
 * Entidad de dominio: User
 * Representa un usuario del sistema GastoClaro.
 */
export interface User {
  id: string;            // UUID
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  profile_type?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Datos del usuario sin información sensible (para respuestas HTTP).
 */
export type SafeUser = Omit<User, 'password_hash'>;
