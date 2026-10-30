/**
 * Wellness Score Engine
 * Computes an explainable daily habit consistency score (0 to 100).
 * Category Weights:
 * - Study Progress: 30%
 * - Meals: 25%
 * - Hydration: 20%
 * - Sleep: 25%
 *
 * Disclaimer: Motivational habit consistency indicator, not a medical assessment.
 */

export const DEFAULT_WEIGHTS = {
  study: 0.30,
  meals: 0.25,
  hydration: 0.20,
  sleep: 0.25
};

export const calculateWellnessScore = ({
  studyMinutes = 0,
  targetStudyMinutes = 240, // default 4 hours
  studyTasksCompleted = 0,
  totalStudyTasks = 0,
  mealsLogged = 0, // out of 4 (breakfast, lunch, snacks, dinner)
  waterMl = 0,
  waterGoalMl = 2500,
  sleepHours = 0,
  sleepGoalHours = 7.5,
  isOngoingDay = true,
  customWeights = DEFAULT_WEIGHTS
}) => {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  // 1. Study Score (30%)
  // Blends duration target (50%) and task completion (50%) if tasks exist
  let studyScore = 0;
  let studyDetails = '';
  const timeProgress = Math.min(100, Math.round((studyMinutes / Math.max(1, targetStudyMinutes)) * 100));
  
  if (totalStudyTasks > 0) {
    const taskProgress = Math.min(100, Math.round((studyTasksCompleted / totalStudyTasks) * 100));
    studyScore = Math.round((timeProgress * 0.5) + (taskProgress * 0.5));
    studyDetails = `${studyTasksCompleted}/${totalStudyTasks} tasks completed (${studyMinutes} mins studied)`;
  } else {
    studyScore = timeProgress;
    studyDetails = `${studyMinutes}/${targetStudyMinutes} mins studied`;
  }

  // 2. Meal Score (25%)
  // 4 target meals = 25 pts each
  const expectedMeals = 4;
  const mealScore = Math.min(100, Math.round((mealsLogged / expectedMeals) * 100));
  const mealDetails = `${mealsLogged}/${expectedMeals} meals logged`;

  // 3. Hydration Score (20%)
  const hydrationRatio = waterGoalMl > 0 ? waterMl / waterGoalMl : 0;
  const waterScore = Math.min(100, Math.round(hydrationRatio * 100));
  const hydrationDetails = `${waterMl}/${waterGoalMl} ml logged`;

  // 4. Sleep Score (25%)
  // Score is optimized around reaching user's target (e.g. 7.5 hrs). Severe deficit (<4h) or excess (>11h) scales down.
  let sleepScore = 0;
  let sleepDetails = '';
  if (sleepHours === 0 && isOngoingDay) {
    // If sleep hasn't been logged yet for the upcoming night, handle missing data honestly
    sleepScore = 70; // baseline neutral until night log
    sleepDetails = 'Awaiting tonight log';
  } else {
    const sleepRatio = sleepGoalHours > 0 ? sleepHours / sleepGoalHours : 0;
    if (sleepRatio >= 0.9 && sleepRatio <= 1.2) {
      sleepScore = 100;
    } else if (sleepRatio < 0.9) {
      sleepScore = Math.max(20, Math.round(sleepRatio * 100));
    } else {
      // Over-sleeping slightly deducts
      sleepScore = Math.max(60, Math.round(100 - (sleepRatio - 1.2) * 40));
    }
    sleepDetails = `${sleepHours} hrs logged (Goal: ${sleepGoalHours} hrs)`;
  }

  // Calculate Weighted Overall Score
  const rawOverall = (studyScore * weights.study) +
                     (mealScore * weights.meals) +
                     (waterScore * weights.hydration) +
                     (sleepScore * weights.sleep);
  const overallScore = Math.min(100, Math.max(0, Math.round(rawOverall)));

  // Generate category status & feedback
  const getStatus = (score) => {
    if (score >= 85) return { label: 'Optimal', color: 'emerald' };
    if (score >= 65) return { label: 'Good', color: 'cyan' };
    if (score >= 45) return { label: 'Moderate', color: 'amber' };
    return { label: 'Needs Attention', color: 'rose' };
  };

  return {
    overallScore,
    status: getStatus(overallScore),
    disclaimer: 'Motivational habit consistency indicator. Not medical advice or academic prediction.',
    categories: {
      study: {
        score: studyScore,
        weight: weights.study * 100,
        status: getStatus(studyScore),
        details: studyDetails
      },
      meals: {
        score: mealScore,
        weight: weights.meals * 100,
        status: getStatus(mealScore),
        details: mealDetails
      },
      hydration: {
        score: waterScore,
        weight: weights.hydration * 100,
        status: getStatus(waterScore),
        details: hydrationDetails
      },
      sleep: {
        score: sleepScore,
        weight: weights.sleep * 100,
        status: getStatus(sleepScore),
        details: sleepDetails
      }
    }
  };
};
