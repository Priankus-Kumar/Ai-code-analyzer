import { Router } from 'express';
import {
  create,
  list,
  getOne,
  remove,
  updateFinding
} from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';
import { analysisLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import {
  createAnalysisSchema,
  getAnalysesQuerySchema,
  updateFindingStatusSchema
} from '../validators/analysisValidators.js';

const router = Router();

// Protect all analysis routes
router.use(protect);

router.post('/', analysisLimiter, validate(createAnalysisSchema), create);
router.get('/', validate(getAnalysesQuerySchema, 'query'), list);
router.get('/:id', getOne);
router.delete('/:id', remove);
router.patch('/:id/findings/:findingId', validate(updateFindingStatusSchema), updateFinding);

export default router;
