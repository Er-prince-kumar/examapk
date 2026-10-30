import express from 'express';
import { successResponse } from '../utils/responseFormatter.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mock store or pass-through for exams
router.get('/', requireAuth, (req, res) => {
  const exams = [
    {
      id: 'exam-1',
      title: 'Operating Systems & System Programming',
      code: 'CSE316',
      exam_type: 'MTT',
      exam_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      exam_time: '10:00:00',
      venue: 'Block 34, Room 402',
      priority: 'high',
      notes: 'Focus on Deadlock detection, Banker Algorithm & Page Replacement algorithms.',
      is_completed: false
    },
    {
      id: 'exam-2',
      title: 'Design and Analysis of Algorithms',
      code: 'CSE306',
      exam_type: 'MTT',
      exam_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      exam_time: '14:00:00',
      venue: 'Block 36, Hall 1',
      priority: 'urgent',
      notes: 'Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain Multiplication.',
      is_completed: false
    },
    {
      id: 'exam-3',
      title: 'Computer Networks',
      code: 'CSE320',
      exam_type: 'ETT',
      exam_date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      exam_time: '09:30:00',
      venue: 'Auditorium Hall C',
      priority: 'medium',
      notes: 'Subnetting CIDR, TCP 3-way handshake, Flow Control & Congestion Control.',
      is_completed: false
    }
  ];
  return successResponse(res, exams, 'Exams retrieved successfully');
});

export default router;
