import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate.middleware';
import { createExpenseSchema, updateExpenseSchema, expenseQuerySchema } from '../../application/dtos/expense.dto';
import { uuidParamSchema } from '../../application/dtos/shared.dto';

const router = Router();

// Todas las rutas de expenses requieren autenticación
router.use(authenticate);

/**
 * POST   /api/v1/expenses       — Crear gasto
 * GET    /api/v1/expenses       — Listar gastos (paginado + filtros)
 * GET    /api/v1/expenses/:id   — Detalle de un gasto
 * PUT    /api/v1/expenses/:id   — Editar gasto
 * DELETE /api/v1/expenses/:id   — Eliminar gasto
 */
router.post('/', validateBody(createExpenseSchema), ExpenseController.create);
router.get('/', validateQuery(expenseQuerySchema), ExpenseController.findAll);
router.get('/:id', validateParams(uuidParamSchema), ExpenseController.findById);
router.put('/:id', validateParams(uuidParamSchema), validateBody(updateExpenseSchema), ExpenseController.update);
router.delete('/:id', validateParams(uuidParamSchema), ExpenseController.delete);

export default router;
