import express from 'express';
import cors from 'cors';
import { errorHandler } from './interface/middlewares/error-handler.middleware';
import { setupSwagger } from './infrastructure/config/swagger';

import authRouter from './interface/routes/auth.routes';
import expensesRouter from './interface/routes/expense.routes';
import goalsRouter from './interface/routes/goal.routes';
import savingsRouter from './interface/routes/saving.routes';
import debtsRouter from './interface/routes/debt.routes';
import usersRouter from './interface/routes/user.routes';

const app = express();

// ── Global Middlewares ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Swagger Documentation ───────────────────────────────────
setupSwagger(app);

// ── Health Check ────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ──────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/expenses', expensesRouter);
app.use('/api/v1/goals', goalsRouter);
app.use('/api/v1/savings', savingsRouter);
app.use('/api/v1/debts', debtsRouter);
app.use('/api/v1/users', usersRouter);

// ── 404 Handler ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Error Handler (centralizado) ────────────────────────────
app.use(errorHandler);

export default app;
