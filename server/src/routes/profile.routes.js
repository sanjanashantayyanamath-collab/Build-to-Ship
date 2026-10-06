import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateSchema } from '../schemas/profile.schema.js';
import { getProfileHandler, updateProfileHandler } from '../controllers/profile.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getProfileHandler);
router.put('/', validate({ body: profileUpdateSchema }), updateProfileHandler);

export default router;
