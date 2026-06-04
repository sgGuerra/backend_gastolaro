import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validateParams } from '../middlewares/validate.middleware';
import { uuidParamSchema } from '../../application/dtos/shared.dto';

const router = Router();

// Todas las rutas de users requieren autenticación y rol de admin
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lista todos los usuarios (solo admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 * /api/v1/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Elimina un usuario por id (solo admin)
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
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/', UserController.findAll);
router.delete('/:id', validateParams(uuidParamSchema), UserController.delete);

export default router;
