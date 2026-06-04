/**
 * Entidad de dominio: Saving
 * Representa un ahorro registrado por un usuario.
 */
export interface Saving {
  id: string;            // UUID
  user_id: string;       // FK → users.id
  name: string;
  amount: number;        // NUMERIC(12,2) — siempre positivo
  source?: string;
  date: string;          // ISO date (YYYY-MM-DD)
  created_at: Date;
  updated_at: Date;
}
