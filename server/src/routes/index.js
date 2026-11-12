import { Router } from 'express';
import authRoutes from './authRoutes.js';
import analysisRoutes from './analysisRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/analyses', analysisRoutes);
router.use('/health', healthRoutes);

export default router;
