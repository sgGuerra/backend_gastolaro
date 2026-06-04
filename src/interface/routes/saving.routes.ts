import { Router } from 'express';
import { SavingController } from '../controllers/saving.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate.middleware';
import { createSavingSchema, updateSavingSchema, savingQuerySchema } from '../../application/dtos/saving.dto';
import { uuidParamSchema } from '../../application/dtos/shared.dto';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createSavingSchema), SavingController.create);
router.get('/', validateQuery(savingQuerySchema), SavingController.findAll);
router.get('/:id', validateParams(uuidParamSchema), SavingController.findById);
router.put('/:id', validateParams(uuidParamSchema), validateBody(updateSavingSchema), SavingController.update);
router.delete('/:id', validateParams(uuidParamSchema), SavingController.delete);

export default router;
