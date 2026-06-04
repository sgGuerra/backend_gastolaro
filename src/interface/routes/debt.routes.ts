import { Router } from 'express';
import { DebtController } from '../controllers/debt.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate.middleware';
import { createDebtSchema, updateDebtSchema, debtQuerySchema } from '../../application/dtos/debt.dto';
import { uuidParamSchema } from '../../application/dtos/shared.dto';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createDebtSchema), DebtController.create);
router.get('/', validateQuery(debtQuerySchema), DebtController.findAll);
router.get('/:id', validateParams(uuidParamSchema), DebtController.findById);
router.put('/:id', validateParams(uuidParamSchema), validateBody(updateDebtSchema), DebtController.update);
router.delete('/:id', validateParams(uuidParamSchema), DebtController.delete);

export default router;
