/**
 * Client-Side Wellness Score Engine
 * Computes explainable daily wellness score (0-100)
 * Study progress: 30%
 * Meals: 25%
 * Hydration: 20%
 * Sleep: 25%
 *
 * Disclaimer: Motivational habit consistency indicator, not medical advice.
 */

export const DEFAULT_WEIGHTS = {
  study: 0.30,
  meals: 0.25,
  hydration: 0.20,
  sleep: 0.25
};

export const computeLocalWellnessScore = ({
  studyMinutes = 0,
  targetStudyMinutes = 240,
  studyTasksCompleted = 0,
  totalStudyTasks = 0,
  mealsLogged = 0,
  waterMl = 0,
  waterGoalMl = 2500,
  sleepHours = 0,
  sleepGoalHours = 7.5,
  isOngoingDay = true,
  customWeights = DEFAULT_WEIGHTS
}) => {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  // 1. Study Score (30%)
  let studyScore = 0;
  let studyDetails = '';
  const timeProgress = Math.min(100, Math.round((studyMinutes / Math.max(1, targetStudyMinutes)) * 100));
  
  if (totalStudyTasks > 0) {
    const taskProgress = Math.min(100, Math.round((studyTasksCompleted / totalStudyTasks) * 100));
    studyScore = Math.round((timeProgress * 0.5) + (taskProgress * 0.5));
    studyDetails = `${studyTasksCompleted}/${totalStudyTasks} tasks completed (${studyMinutes}m studied)`;
  } else {
    studyScore = timeProgress;
    studyDetails = `${studyMinutes}/${targetStudyMinutes}m studied`;
  }

  // 2. Meal Score (25%) - 4 daily meal slots
  const mealScore = Math.min(100, Math.round((mealsLogged / 4) * 100));
  const mealDetails = `${mealsLogged}/4 meals logged`;

  // 3. Hydration Score (20%)
  const waterRatio = waterGoalMl > 0 ? waterMl / waterGoalMl : 0;
  const waterScore = Math.min(100, Math.round(waterRatio * 100));
  const hydrationDetails = `${waterMl}/${waterGoalMl} ml logged`;

  // 4. Sleep Score (25%)
  let sleepScore = 0;
  let sleepDetails = '';
  if (sleepHours === 0 && isOngoingDay) {
    sleepScore = 70; // baseline pending tonight
    sleepDetails = 'Awaiting tonight log';
  } else {
    const sleepRatio = sleepGoalHours > 0 ? sleepHours / sleepGoalHours : 0;
    if (sleepRatio >= 0.9 && sleepRatio <= 1.2) {
      sleepScore = 100;
    } else if (sleepRatio < 0.9) {
      sleepScore = Math.max(20, Math.round(sleepRatio * 100));
    } else {
      sleepScore = Math.max(60, Math.round(100 - (sleepRatio - 1.2) * 40));
    }
    sleepDetails = `${sleepHours} hrs logged (Goal: ${sleepGoalHours}h)`;
  }

  // Weighted overall
  const raw = (studyScore * weights.study) +
              (mealScore * weights.meals) +
              (waterScore * weights.hydration) +
              (sleepScore * weights.sleep);
  const overallScore = Math.min(100, Math.max(0, Math.round(raw)));

  const getStatus = (score) => {
    if (score >= 85) return { label: 'Optimal', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 65) return { label: 'Good', badge: 'bg-cyan-100 text-cyan-800 border-cyan-300' };
    if (score >= 45) return { label: 'Moderate', badge: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: 'Needs Attention', badge: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  return {
    overallScore,
    status: getStatus(overallScore),
    disclaimer: 'Motivational habit consistency indicator. Not medical advice or academic prediction.',
    categories: {
      study: {
        title: 'Study Progress',
        score: studyScore,
        weight: weights.study * 100,
        status: getStatus(studyScore),
        details: studyDetails
      },
      meals: {
        title: 'Nutrition & Meals',
        score: mealScore,
        weight: weights.meals * 100,
        status: getStatus(mealScore),
        details: mealDetails
      },
      hydration: {
        title: 'Hydration',
        score: waterScore,
        weight: weights.hydration * 100,
        status: getStatus(waterScore),
        details: hydrationDetails
      },
      sleep: {
        title: 'Sleep Duration',
        score: sleepScore,
        weight: weights.sleep * 100,
        status: getStatus(sleepScore),
        details: sleepDetails
      }
    }
  };
};
