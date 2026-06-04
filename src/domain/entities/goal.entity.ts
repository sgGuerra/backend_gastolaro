/**
 * Entidad de dominio: Goal
 * Representa una meta de ahorro del usuario.
 */
export interface Goal {
  id: string;              // UUID
  user_id: string;         // FK → users.id
  title: string;
  description?: string;
  target_amount: number;   // NUMERIC(12,2) — siempre positivo
  current_amount: number;  // NUMERIC(12,2) — ≥ 0
  deadline: string;        // ISO date (YYYY-MM-DD)
  status: 'active' | 'completed';
  created_at: Date;
  updated_at: Date;
}
