import { Router } from 'express';
import { DebtController } from '../controllers/debt.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate.middleware';
import { createDebtSchema, updateDebtSchema, debtQuerySchema } from '../../application/dtos/debt.dto';
import { uuidParamSchema } from '../../application/dtos/shared.dto';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /api/v1/debts:
 *   post:
 *     tags:
 *       - Debts
 *     summary: Crea una nueva deuda
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - creditor
 *               - amount
 *             properties:
 *               creditor:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: float
 *               interest_rate:
 *                 type: number
 *                 format: float
 *               monthly_payment:
 *                 type: number
 *                 format: float
 *               due_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, paid]
 *   get:
 *     tags:
 *       - Debts
 *     summary: Lista deudas paginadas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de deudas
 * /api/v1/debts/{id}:
 *   get:
 *     tags:
 *       - Debts
 *     summary: Obtiene una deuda por id
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
 *         description: Detalle de la deuda
 *       404:
 *         description: Deuda no encontrada
 *   put:
 *     tags:
 *       - Debts
 *     summary: Actualiza una deuda
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
 *               creditor:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: float
 *               interest_rate:
 *                 type: number
 *                 format: float
 *               monthly_payment:
 *                 type: number
 *                 format: float
 *               due_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, paid]
 *     responses:
 *       200:
 *         description: Deuda actualizada
 *       404:
 *         description: Deuda no encontrada
 *   delete:
 *     tags:
 *       - Debts
 *     summary: Elimina una deuda
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
 *         description: Deuda eliminada
 */
router.post('/', validateBody(createDebtSchema), DebtController.create);
router.get('/', validateQuery(debtQuerySchema), DebtController.findAll);
router.get('/:id', validateParams(uuidParamSchema), DebtController.findById);
router.put('/:id', validateParams(uuidParamSchema), validateBody(updateDebtSchema), DebtController.update);
router.delete('/:id', validateParams(uuidParamSchema), DebtController.delete);

export default router;
