import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App.jsx';
import { computeLocalWellnessScore } from '../utils/scoreEngine.js';

describe('ExamWeekWithoutTheCrash Frontend Suite', () => {
  it('renders landing page with headline and action buttons', () => {
    render(<App />);
    const brandElements = screen.getAllByText(/ExamNoCrash/i);
    expect(brandElements.length).toBeGreaterThan(0);

    const taglineElements = screen.getAllByText(/Study Smart • Stay Healthy • Perform Better/i);
    expect(taglineElements.length).toBeGreaterThan(0);
    expect(taglineElements[0]).toBeInTheDocument();
  });

  it('computes accurate client-side wellness score', () => {
    const score = computeLocalWellnessScore({
      studyMinutes: 240,
      targetStudyMinutes: 240,
      studyTasksCompleted: 4,
      totalStudyTasks: 4,
      mealsLogged: 4,
      waterMl: 2500,
      waterGoalMl: 2500,
      sleepHours: 7.5,
      sleepGoalHours: 7.5,
      isOngoingDay: false
    });

    expect(score.overallScore).toBe(100);
    expect(score.categories.study.score).toBe(100);
    expect(score.categories.hydration.score).toBe(100);
    expect(score.status.label).toBe('Optimal');
  });

  it('honestly displays awaiting status for ongoing midday sleep calculations', () => {
    const score = computeLocalWellnessScore({
      studyMinutes: 120,
      targetStudyMinutes: 240,
      studyTasksCompleted: 2,
      totalStudyTasks: 4,
      mealsLogged: 2,
      waterMl: 1250,
      waterGoalMl: 2500,
      sleepHours: 0,
      sleepGoalHours: 7.5,
      isOngoingDay: true
    });

    expect(score.categories.sleep.details).toContain('Awaiting');
    expect(score.overallScore).toBeGreaterThan(40);
  });
});
