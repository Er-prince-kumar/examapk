import { successResponse } from '../utils/responseFormatter.js';
import { generateDailyPlan, chatWithAssistant } from '../services/geminiService.js';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1500, 'Message cannot exceed 1500 characters'),
  history: z.array(z.object({
    sender: z.enum(['user', 'assistant', 'system']),
    text: z.string()
  })).optional().default([]),
  studentContext: z.record(z.any()).optional().default({})
});

export const getDailyPlan = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const result = await generateDailyPlan(payload);
    return successResponse(res, result, 'AI Daily Plan generated successfully');
  } catch (err) {
    next(err);
  }
};

export const postChatMessage = async (req, res, next) => {
  try {
    const parsed = chatSchema.parse(req.body);
    const result = await chatWithAssistant(parsed);
    return successResponse(res, result, 'AI response generated successfully');
  } catch (err) {
    next(err);
  }
};
