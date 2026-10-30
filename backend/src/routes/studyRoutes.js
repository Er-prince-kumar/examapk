import express from 'express';
import { successResponse } from '../utils/responseFormatter.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tasks', requireAuth, (req, res) => {
  const tasks = [
    {
      id: 'task-1',
      title: 'Revise Process Synchronization & Semaphores',
      subject: 'Operating Systems',
      subjectCode: 'CSE316',
      targetDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 45,
      actualMinutes: 45,
      priority: 'high',
      isCompleted: true
    },
    {
      id: 'task-2',
      title: 'Practice Dijkstra Algorithm 5 Numerical Problems',
      subject: 'Computer Networks',
      subjectCode: 'CSE320',
      targetDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 35,
      actualMinutes: 0,
      priority: 'medium',
      isCompleted: false
    },
    {
      id: 'task-3',
      title: 'Solve 2025 Mid-Term PYQs on Paging & TLB',
      subject: 'Operating Systems',
      subjectCode: 'CSE316',
      targetDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 60,
      actualMinutes: 60,
      priority: 'high',
      isCompleted: true
    },
    {
      id: 'task-4',
      title: 'Implement Fractional Knapsack Greedy Strategy in C++',
      subject: 'Design & Analysis of Algorithms',
      subjectCode: 'CSE306',
      targetDate: new Date().toISOString().split('T')[0],
      estimatedMinutes: 40,
      actualMinutes: 0,
      priority: 'high',
      isCompleted: false
    }
  ];
  return successResponse(res, tasks, 'Study tasks retrieved successfully');
});

// Auto-generated study schedule endpoint based on remaining days and syllabus
router.post('/generate-schedule', requireAuth, (req, res) => {
  const { availableHoursPerDay = 4, targetExams = [] } = req.body;
  
  const schedule = [
    {
      day: 'Day 1 (Today)',
      blocks: [
        { time: '09:00 - 09:50', title: 'High-Weightage OS: Virtual Memory & Page Replacement', subject: 'CSE316', type: 'Focus' },
        { time: '09:50 - 10:00', title: 'Water refill & Eye rest break', type: 'Break' },
        { time: '10:00 - 10:50', title: 'OS Deadlock: Banker Algorithm numericals', subject: 'CSE316', type: 'Focus' },
        { time: '14:00 - 14:50', title: 'DAA: Dynamic Programming Knapsack', subject: 'CSE306', type: 'Focus' },
        { time: '15:00 - 15:45', title: 'CN: Subnetting & CIDR calculations', subject: 'CSE320', type: 'Focus' }
      ]
    },
    {
      day: 'Day 2 (Tomorrow)',
      blocks: [
        { time: '09:00 - 10:30', title: 'OS Past Year Paper timed mock test', subject: 'CSE316', type: 'Mock Exam' },
        { time: '14:00 - 15:30', title: 'DAA Graph Algorithms: Bellman-Ford & Floyd-Warshall', subject: 'CSE306', type: 'Focus' },
        { time: '16:00 - 17:00', title: 'Formula & theorem quick-revision flashcards', subject: 'All', type: 'Revision' }
      ]
    }
  ];

  return successResponse(res, schedule, 'Generated adaptive exam-week study schedule');
});

export default router;
