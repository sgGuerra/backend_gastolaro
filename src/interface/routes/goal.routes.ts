import { Router } from 'express';
import { GoalController } from '../controllers/goal.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate.middleware';
import { createGoalSchema, updateGoalSchema, goalQuerySchema } from '../../application/dtos/goal.dto';
import { uuidParamSchema } from '../../application/dtos/shared.dto';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /api/v1/goals:
 *   post:
 *     tags:
 *       - Goals
 *     summary: Crea una nueva meta
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - target_amount
 *               - deadline
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               target_amount:
 *                 type: number
 *                 format: float
 *               current_amount:
 *                 type: number
 *                 format: float
 *               deadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, completed]
 *   get:
 *     tags:
 *       - Goals
 *     summary: Lista metas paginadas y filtradas
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de metas
 * /api/v1/goals/{id}:
 *   get:
 *     tags:
 *       - Goals
 *     summary: Obtiene una meta por id
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
 *         description: Detalle de la meta
 *       404:
 *         description: Meta no encontrada
 *   put:
 *     tags:
 *       - Goals
 *     summary: Actualiza una meta
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               target_amount:
 *                 type: number
 *                 format: float
 *               current_amount:
 *                 type: number
 *                 format: float
 *               deadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, completed]
 *     responses:
 *       200:
 *         description: Meta actualizada
 *       404:
 *         description: Meta no encontrada
 *   delete:
 *     tags:
 *       - Goals
 *     summary: Elimina una meta
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
 *         description: Meta eliminada
 */
router.post('/', validateBody(createGoalSchema), GoalController.create);
router.get('/', validateQuery(goalQuerySchema), GoalController.findAll);
router.get('/:id', validateParams(uuidParamSchema), GoalController.findById);
router.put('/:id', validateParams(uuidParamSchema), validateBody(updateGoalSchema), GoalController.update);
router.delete('/:id', validateParams(uuidParamSchema), GoalController.delete);

export default router;
