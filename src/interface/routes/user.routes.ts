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

router.get('/', UserController.findAll);
router.delete('/:id', validateParams(uuidParamSchema), UserController.delete);

export default router;
