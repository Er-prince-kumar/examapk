import express from 'express';
import { successResponse } from '../utils/responseFormatter.js';

const router = express.Router();

router.get('/', (req, res) => {
  return successResponse(res, {
    status: 'healthy',
    service: 'ExamWeekWithoutTheCrash Backend API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }, 'Service is operational');
});

export default router;
