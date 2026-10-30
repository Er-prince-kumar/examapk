import express from 'express';
import { successResponse } from '../utils/responseFormatter.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const reminders = [
    { id: 'rem-1', type: 'water', title: 'Hydration check - drink 250ml water', reminder_time: '11:00:00', is_active: true, frequency: 'hourly' },
    { id: 'rem-2', type: 'meal', title: 'Lunch Routine - step away from books', reminder_time: '13:00:00', is_active: true, frequency: 'daily' },
    { id: 'rem-3', type: 'break', title: 'Pomodoro stretch & posture check', reminder_time: '16:00:00', is_active: true, frequency: 'daily' },
    { id: 'rem-4', type: 'meal', title: 'Dinner Routine & brain fuel', reminder_time: '20:30:00', is_active: true, frequency: 'daily' },
    { id: 'rem-5', type: 'sleep', title: 'Bedtime wind-down (screens off)', reminder_time: '22:45:00', is_active: true, frequency: 'daily' }
  ];
  return successResponse(res, reminders, 'Reminders retrieved');
});

export default router;
