/**
 * Entidad de dominio: Debt
 * Representa una deuda registrada por un usuario.
 */
export interface Debt {
  id: string;              // UUID
  user_id: string;         // FK → users.id
  creditor: string;
  amount: number;          // NUMERIC(12,2) — siempre positivo
  interest_rate: number;   // NUMERIC(5,2) — ≥ 0
  monthly_payment: number; // NUMERIC(12,2)
  due_date: string;        // ISO date (YYYY-MM-DD)
  status: 'active' | 'paid';
  created_at: Date;
  updated_at: Date;
}
