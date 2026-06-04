import { Router } from 'express';
import { SavingController } from '../controllers/saving.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate.middleware';
import { createSavingSchema, updateSavingSchema, savingQuerySchema } from '../../application/dtos/saving.dto';
import { uuidParamSchema } from '../../application/dtos/shared.dto';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /api/v1/savings:
 *   post:
 *     tags:
 *       - Savings
 *     summary: Crea un nuevo ahorro
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - amount
 *               - date
 *             properties:
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: float
 *               source:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *   get:
 *     tags:
 *       - Savings
 *     summary: Lista ahorros paginados
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
 *         description: Lista de ahorros
 * /api/v1/savings/{id}:
 *   get:
 *     tags:
 *       - Savings
 *     summary: Obtiene un ahorro por id
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
 *         description: Detalle del ahorro
 *       404:
 *         description: Ahorro no encontrado
 *   put:
 *     tags:
 *       - Savings
 *     summary: Actualiza un ahorro
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
 *               name:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: float
 *               source:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Ahorro actualizado
 *       404:
 *         description: Ahorro no encontrado
 *   delete:
 *     tags:
 *       - Savings
 *     summary: Elimina un ahorro
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
 *         description: Ahorro eliminado
 */
router.post('/', validateBody(createSavingSchema), SavingController.create);
router.get('/', validateQuery(savingQuerySchema), SavingController.findAll);
router.get('/:id', validateParams(uuidParamSchema), SavingController.findById);
router.put('/:id', validateParams(uuidParamSchema), validateBody(updateSavingSchema), SavingController.update);
router.delete('/:id', validateParams(uuidParamSchema), SavingController.delete);

export default router;
