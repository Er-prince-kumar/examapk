import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import { calculateWellnessScore } from '../services/wellnessScoreService.js';
import { generateDailyPlan } from '../services/geminiService.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const user = req.user;
    const now = new Date();
    const hours = now.getHours();

    let greeting = 'Good morning';
    if (hours >= 12 && hours < 17) greeting = 'Good afternoon';
    else if (hours >= 17) greeting = 'Good evening';

    const studentName = user?.user_metadata?.full_name || 'Student';

    // Baseline mock/persisted dashboard figures (in guest mode or default state)
    const dashboardData = {
      greeting: `${greeting}, ${studentName}!`,
      date: now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      nearestExam: {
        id: 'exam-sample-1',
        title: 'Operating Systems & System Programming',
        code: 'CSE316',
        exam_type: 'MTT',
        exam_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        exam_time: '10:00:00',
        priority: 'high',
        daysLeft: 3
      },
      stats: {
        study: {
          hoursStudiedToday: 2.5,
          targetHours: 4.0,
          tasksCompletedToday: 3,
          totalTasksToday: 5,
          percent: 60
        },
        meals: {
          loggedCount: 3,
          targetCount: 4,
          percent: 75,
          completedTypes: ['breakfast', 'lunch', 'snacks']
        },
        hydration: {
          currentMl: 1750,
          goalMl: 2500,
          percent: 70
        },
        sleep: {
          lastNightDurationHours: 7.2,
          goalHours: 7.5,
          quality: 'good',
          percent: 96
        }
      },
      wellnessScore: calculateWellnessScore({
        studyMinutes: 150,
        targetStudyMinutes: 240,
        studyTasksCompleted: 3,
        totalStudyTasks: 5,
        mealsLogged: 3,
        waterMl: 1750,
        waterGoalMl: 2500,
        sleepHours: 7.2,
        sleepGoalHours: 7.5
      }),
      pendingTasks: [
        { id: 'task-1', title: 'Revise Process Synchronization & Semaphores', subject: 'Operating Systems', estimatedMinutes: 45, priority: 'high', isCompleted: false },
        { id: 'task-2', title: 'Practice Dijkstra Algorithm 5 Numerical Problems', subject: 'Computer Networks', estimatedMinutes: 35, priority: 'medium', isCompleted: false },
        { id: 'task-3', title: 'Solve 2025 Mid-Term PYQs on Paging & TLB', subject: 'Operating Systems', estimatedMinutes: 60, priority: 'high', isCompleted: true }
      ],
      upcomingReminders: [
        { id: 'rem-1', title: 'Drink 250ml Water', time: '14:30', type: 'water' },
        { id: 'rem-2', title: 'Evening Snack Break & Eye Stretch', time: '17:00', type: 'break' },
        { id: 'rem-3', title: 'Dinner Routine', time: '20:30', type: 'meal' }
      ]
    };

    return successResponse(res, dashboardData, 'Dashboard data retrieved successfully');
  } catch (err) {
    next(err);
  }
};
