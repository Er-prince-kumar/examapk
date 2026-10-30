import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server.js';
import { calculateWellnessScore, DEFAULT_WEIGHTS } from './services/wellnessScoreService.js';

describe('Wellness Score Engine', () => {
  it('should calculate perfect 100 score when all goals are met', () => {
    const result = calculateWellnessScore({
      studyMinutes: 240,
      targetStudyMinutes: 240,
      studyTasksCompleted: 5,
      totalStudyTasks: 5,
      mealsLogged: 4,
      waterMl: 2500,
      waterGoalMl: 2500,
      sleepHours: 7.5,
      sleepGoalHours: 7.5,
      isOngoingDay: false
    });

    expect(result.overallScore).toBe(100);
    expect(result.categories.study.score).toBe(100);
    expect(result.categories.meals.score).toBe(100);
    expect(result.categories.hydration.score).toBe(100);
    expect(result.categories.sleep.score).toBe(100);
  });

  it('should correctly apply 30-25-20-25 weights', () => {
    expect(DEFAULT_WEIGHTS.study).toBe(0.30);
    expect(DEFAULT_WEIGHTS.meals).toBe(0.25);
    expect(DEFAULT_WEIGHTS.hydration).toBe(0.20);
    expect(DEFAULT_WEIGHTS.sleep).toBe(0.25);
  });

  it('should handle partial ongoing day without harshly zeroing missing sleep', () => {
    const result = calculateWellnessScore({
      studyMinutes: 120,
      targetStudyMinutes: 240,
      studyTasksCompleted: 2,
      totalStudyTasks: 4,
      mealsLogged: 2,
      waterMl: 1500,
      waterGoalMl: 2500,
      sleepHours: 0,
      isOngoingDay: true
    });

    expect(result.overallScore).toBeGreaterThan(40);
    expect(result.categories.sleep.details).toContain('Awaiting');
  });
});

describe('Backend API Endpoints', () => {
  it('GET /api/health returns 200 OK with health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  it('POST /api/wellness/score returns calculated score', async () => {
    const res = await request(app)
      .post('/api/wellness/score')
      .set('Authorization', 'Bearer guest-token')
      .send({
        studyMinutes: 180,
        targetStudyMinutes: 240,
        studyTasksCompleted: 3,
        totalStudyTasks: 4,
        mealsLogged: 3,
        waterMl: 2000,
        waterGoalMl: 2500,
        sleepHours: 7.0,
        sleepGoalHours: 7.5
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overallScore).toBeGreaterThan(60);
  });

  it('GET /api/dashboard returns structured student statistics', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', 'Bearer guest-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.nearestExam).toBeDefined();
    expect(res.body.data.wellnessScore).toBeDefined();
  });
});
