/**
 * Entidad de dominio: Expense
 * Representa un gasto registrado por un usuario.
 */
export interface Expense {
  id: string;              // UUID
  user_id: string;         // FK → users.id
  category: string;
  description: string;
  amount: number;          // NUMERIC(12,2) — siempre positivo
  date: string;            // ISO date (YYYY-MM-DD)
  payment_method: string;
  created_at: Date;
  updated_at: Date;
}
