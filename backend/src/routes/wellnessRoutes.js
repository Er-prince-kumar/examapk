import express from 'express';
import { computeScore } from '../controllers/wellnessController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/score', requireAuth, computeScore);

export default router;
