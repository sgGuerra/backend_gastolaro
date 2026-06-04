import { Router } from 'express';
import { GoalController } from '../controllers/goal.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validateBody, validateQuery, validateParams } from '../middlewares/validate.middleware';
import { createGoalSchema, updateGoalSchema, goalQuerySchema } from '../../application/dtos/goal.dto';
import { uuidParamSchema } from '../../application/dtos/shared.dto';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createGoalSchema), GoalController.create);
router.get('/', validateQuery(goalQuerySchema), GoalController.findAll);
router.get('/:id', validateParams(uuidParamSchema), GoalController.findById);
router.put('/:id', validateParams(uuidParamSchema), validateBody(updateGoalSchema), GoalController.update);
router.delete('/:id', validateParams(uuidParamSchema), GoalController.delete);

export default router;
