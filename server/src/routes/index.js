import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { healthController } from './health.routes.js';
import { advisoryRoutes } from './advisory.routes.js';
import { profileRoutes } from './profile.routes.js';

const router = express.Router();

router.get('/health', healthController);

router.get('/profile', authMiddleware, (req, res) => profileRoutes.getProfile(req, res));
router.put('/profile', authMiddleware, (req, res) => profileRoutes.updateProfile(req, res));

router.post('/advisories', authMiddleware, (req, res) => advisoryRoutes.create(req, res));
router.get('/advisories', authMiddleware, (req, res) => advisoryRoutes.list(req, res));
router.get('/advisories/stats', authMiddleware, (req, res) => advisoryRoutes.stats(req, res));
router.get('/advisories/:id', authMiddleware, (req, res) => advisoryRoutes.getById(req, res));
router.delete('/advisories/:id', authMiddleware, (req, res) => advisoryRoutes.delete(req, res));

export default router;
