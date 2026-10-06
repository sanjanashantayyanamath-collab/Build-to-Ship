import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { advisoryLimiter } from '../middleware/rateLimit.js';
import { advisoryCreateSchema, advisoryListQuerySchema } from '../schemas/advisory.schema.js';
import { idParamSchema } from '../schemas/common.schema.js';
import {
  createAdvisoryHandler,
  listAdvisoriesHandler,
  getAdvisoryStatsHandler,
  getAdvisoryByIdHandler,
  deleteAdvisoryByIdHandler,
} from '../controllers/advisory.controller.js';

const router = Router();

// All advisory routes require authentication
router.use(requireAuth);

router.post('/', advisoryLimiter, validate({ body: advisoryCreateSchema }), createAdvisoryHandler);
router.get('/', validate({ query: advisoryListQuerySchema }), listAdvisoriesHandler);
router.get('/stats', getAdvisoryStatsHandler);
router.get('/:id', validate({ params: idParamSchema }), getAdvisoryByIdHandler);
router.delete('/:id', validate({ params: idParamSchema }), deleteAdvisoryByIdHandler);

export default router;
