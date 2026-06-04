/**
 * SQL para crear todas las tablas del sistema GastoClaro.
 * Ejecutar en Supabase SQL Editor o como migración manual.
 *
 * Orden: users → expenses, goals, savings, debts (FK dependencia).
 */

-- ══════════════════════════════════════════════
-- Tabla: users
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  profile_type  TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- Tabla: expenses
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS expenses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category        TEXT NOT NULL,
  description     TEXT,
  amount          NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  date            DATE NOT NULL,
  payment_method  TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- Tabla: goals
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS goals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  target_amount   NUMERIC(12,2) NOT NULL CHECK (target_amount > 0),
  current_amount  NUMERIC(12,2) DEFAULT 0 CHECK (current_amount >= 0),
  deadline        DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- Tabla: savings
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS savings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  source      TEXT,
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- Tabla: debts
-- ══════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS debts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creditor        TEXT NOT NULL,
  amount          NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  interest_rate   NUMERIC(5,2) DEFAULT 0,
  monthly_payment NUMERIC(12,2),
  due_date        DATE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- Índices para performance
-- ══════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_savings_user_id ON savings(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_status ON debts(status);
