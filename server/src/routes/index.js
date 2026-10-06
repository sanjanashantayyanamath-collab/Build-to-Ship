import { Router } from 'express';
import healthRoutes from './health.routes.js';
import advisoryRoutes from './advisory.routes.js';
import profileRoutes from './profile.routes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/advisories', advisoryRoutes);
router.use('/profile', profileRoutes);

export default router;
