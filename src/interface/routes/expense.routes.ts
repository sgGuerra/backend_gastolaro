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
 * @openapi
 * /api/v1/expenses:
 *   post:
 *     tags:
 *       - Expenses
 *     summary: Crea un nuevo gasto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - amount
 *               - date
 *             properties:
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: float
 *               date:
 *                 type: string
 *                 format: date
 *               payment_method:
 *                 type: string
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Lista gastos paginados y filtrados
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página actual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Elementos por página
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtra por categoría
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final
 *     responses:
 *       200:
 *         description: Lista de gastos
 * /api/v1/expenses/{id}:
 *   get:
 *     tags:
 *       - Expenses
 *     summary: Obtiene un gasto por id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detalle del gasto
 *       404:
 *         description: Gasto no encontrado
 *   put:
 *     tags:
 *       - Expenses
 *     summary: Actualiza un gasto existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: float
 *               date:
 *                 type: string
 *                 format: date
 *               payment_method:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gasto actualizado
 *       404:
 *         description: Gasto no encontrado
 *   delete:
 *     tags:
 *       - Expenses
 *     summary: Elimina un gasto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Gasto eliminado
 */
router.post('/', validateBody(createExpenseSchema), ExpenseController.create);
router.get('/', validateQuery(expenseQuerySchema), ExpenseController.findAll);
router.get('/:id', validateParams(uuidParamSchema), ExpenseController.findById);
router.put('/:id', validateParams(uuidParamSchema), validateBody(updateExpenseSchema), ExpenseController.update);
router.delete('/:id', validateParams(uuidParamSchema), ExpenseController.delete);

export default router;
