import { successResponse } from '../utils/responseFormatter.js';
import { calculateWellnessScore } from '../services/wellnessScoreService.js';
import { z } from 'zod';

const scoreCalculateSchema = z.object({
  studyMinutes: z.number().nonnegative().optional().default(0),
  targetStudyMinutes: z.number().positive().optional().default(240),
  studyTasksCompleted: z.number().nonnegative().optional().default(0),
  totalStudyTasks: z.number().nonnegative().optional().default(0),
  mealsLogged: z.number().min(0).max(4).optional().default(0),
  waterMl: z.number().nonnegative().optional().default(0),
  waterGoalMl: z.number().positive().optional().default(2500),
  sleepHours: z.number().nonnegative().optional().default(0),
  sleepGoalHours: z.number().positive().optional().default(7.5),
  isOngoingDay: z.boolean().optional().default(true),
  customWeights: z.object({
    study: z.number().optional(),
    meals: z.number().optional(),
    hydration: z.number().optional(),
    sleep: z.number().optional()
  }).optional()
});

export const computeScore = (req, res, next) => {
  try {
    const params = scoreCalculateSchema.parse(req.body);
    const scoreResult = calculateWellnessScore(params);
    return successResponse(res, scoreResult, 'Wellness score calculated');
  } catch (err) {
    next(err);
  }
};
