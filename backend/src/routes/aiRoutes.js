import express from 'express';
import { getDailyPlan, postChatMessage } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(aiLimiter);
router.post('/daily-plan', requireAuth, getDailyPlan);
router.post('/chat', requireAuth, postChatMessage);

export default router;
