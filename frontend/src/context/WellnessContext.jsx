import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { storageService } from '../services/storageService.js';
import { computeLocalWellnessScore } from '../utils/scoreEngine.js';
import { useNotification } from './NotificationContext.jsx';
import { useAuth } from './AuthContext.jsx';

const WellnessContext = createContext(null);

export const WellnessProvider = ({ children }) => {
  const { profile } = useAuth();
  const { addToast } = useNotification();

  // Load state from persistent storage
  const [exams, setExams] = useState(() => storageService.getExams());
  const [subjects, setSubjects] = useState(() => storageService.getSubjects());
  const [syllabus, setSyllabus] = useState(() => storageService.getSyllabus());
  const [studyTasks, setStudyTasks] = useState(() => storageService.getStudyTasks());
  const [meals, setMeals] = useState(() => storageService.getMeals());
  const [waterLogs, setWaterLogs] = useState(() => storageService.getWaterLogs());
  const [sleepLogs, setSleepLogs] = useState(() => storageService.getSleepLogs());
  const [reminders, setReminders] = useState(() => storageService.getReminders());

  // Goals
  const waterGoalMl = profile?.daily_water_goal_ml || 2500;
  const sleepGoalHours = profile?.daily_sleep_goal_hours || 7.5;
  const targetStudyMinutes = 240; // 4 hours

  // Current day aggregations
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's water total
  const todayWaterLogs = useMemo(() => {
    return waterLogs.filter((log) => log.log_date === todayStr);
  }, [waterLogs, todayStr]);

  const currentWaterMl = useMemo(() => {
    return todayWaterLogs.reduce((sum, item) => sum + (Number(item.amount_ml) || 0), 0);
  }, [todayWaterLogs]);

  // Today's meals
  const todayMeals = useMemo(() => {
    return meals.filter((meal) => meal.log_date === todayStr);
  }, [meals, todayStr]);

  const mealsLoggedCount = useMemo(() => {
    return todayMeals.filter((m) => m.is_completed).length;
  }, [todayMeals]);

  // Today's study tasks
  const todayTasks = useMemo(() => {
    return studyTasks.filter((t) => t.target_date === todayStr);
  }, [studyTasks, todayStr]);

  const studyTasksCompleted = useMemo(() => {
    return todayTasks.filter((t) => t.is_completed).length;
  }, [todayTasks]);

  const studyMinutesToday = useMemo(() => {
    return studyTasks
      .filter((t) => t.target_date === todayStr && t.is_completed)
      .reduce((sum, t) => sum + (Number(t.actual_minutes || t.estimated_minutes) || 0), 0);
  }, [studyTasks, todayStr]);

  // Most recent sleep record
  const latestSleep = useMemo(() => {
    return sleepLogs.length > 0 ? sleepLogs[0] : null;
  }, [sleepLogs]);

  const sleepHours = latestSleep?.duration_hours || 0;

  // Real-time explainable wellness score
  const wellnessScore = useMemo(() => {
    return computeLocalWellnessScore({
      studyMinutes: studyMinutesToday,
      targetStudyMinutes,
      studyTasksCompleted,
      totalStudyTasks: todayTasks.length,
      mealsLogged: mealsLoggedCount,
      waterMl: currentWaterMl,
      waterGoalMl,
      sleepHours,
      sleepGoalHours,
      isOngoingDay: true
    });
  }, [studyMinutesToday, studyTasksCompleted, todayTasks.length, mealsLoggedCount, currentWaterMl, waterGoalMl, sleepHours, sleepGoalHours]);

  // --- ACTIONS ---

  // 1. Water Actions
  const addWater = (amountMl) => {
    const newLog = {
      id: `w-${Date.now()}`,
      amount_ml: amountMl,
      log_date: todayStr,
      logged_at: new Date().toISOString()
    };
    const updated = [newLog, ...waterLogs];
    setWaterLogs(updated);
    storageService.saveWaterLogs(updated);

    addToast({
      title: 'Water Logged',
      message: `+${amountMl} ml added! Daily total: ${currentWaterMl + amountMl} / ${waterGoalMl} ml.`,
      type: 'success'
    });

    // Confetti if goal reached
    if (currentWaterMl < waterGoalMl && (currentWaterMl + amountMl) >= waterGoalMl) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
      addToast({
        title: 'Goal Achieved! 💧',
        message: 'You reached your daily hydration goal! Excellent exam-week stamina.',
        type: 'success'
      });
    }
  };

  const removeWaterLog = (id) => {
    const updated = waterLogs.filter((w) => w.id !== id);
    setWaterLogs(updated);
    storageService.saveWaterLogs(updated);
    addToast({ title: 'Record removed', message: 'Water entry deleted', type: 'info' });
  };

  // 2. Meal Actions
  const toggleMeal = (mealType, description = '') => {
    let existingIndex = meals.findIndex((m) => m.log_date === todayStr && m.meal_type === mealType);
    let updated;

    if (existingIndex >= 0) {
      const existing = meals[existingIndex];
      const newStatus = !existing.is_completed;
      updated = [...meals];
      updated[existingIndex] = {
        ...existing,
        is_completed: newStatus,
        description: description || existing.description,
        updated_at: new Date().toISOString()
      };
    } else {
      const newMeal = {
        id: `meal-${Date.now()}`,
        meal_type: mealType,
        log_date: todayStr,
        meal_time: new Date().toTimeString().slice(0, 5),
        is_completed: true,
        description: description || ''
      };
      updated = [newMeal, ...meals];
    }

    setMeals(updated);
    storageService.saveMeals(updated);
    addToast({
      title: 'Meal Log Updated',
      message: `Marked ${mealType} as completed. Keep your energy high!`,
      type: 'success'
    });
  };

  // 3. Sleep Actions
  const logSleep = ({ bedtime, wakeTime, durationHours, quality, notes }) => {
    const newLog = {
      id: `sleep-${Date.now()}`,
      sleep_date: todayStr,
      bedtime,
      wake_time: wakeTime,
      duration_hours: Number(durationHours),
      quality: quality || 'good',
      notes: notes || '',
      created_at: new Date().toISOString()
    };
    // Replace today's log if exists, else prepend
    const filtered = sleepLogs.filter((s) => s.sleep_date !== todayStr);
    const updated = [newLog, ...filtered];
    setSleepLogs(updated);
    storageService.saveSleepLogs(updated);

    addToast({
      title: 'Sleep Logged',
      message: `Recorded ${durationHours} hours of sleep. Quality: ${quality}.`,
      type: 'success'
    });
  };

  // 4. Study Tasks
  const toggleTaskCompletion = (taskId) => {
    const updated = studyTasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.is_completed;
        return {
          ...t,
          is_completed: nextState,
          actual_minutes: nextState ? (t.actual_minutes || t.estimated_minutes) : 0,
          completed_at: nextState ? new Date().toISOString() : null
        };
      }
      return t;
    });

    setStudyTasks(updated);
    storageService.saveStudyTasks(updated);

    const toggled = updated.find((t) => t.id === taskId);
    if (toggled?.is_completed) {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
      addToast({
        title: 'Task Completed! 🎯',
        message: `Awesome job finishing "${toggled.title}". Wellness score boosted!`,
        type: 'success'
      });
    }
  };

  const addStudyTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      subject_id: taskData.subject_id,
      topic_id: taskData.topic_id || null,
      target_date: taskData.target_date || todayStr,
      estimated_minutes: Number(taskData.estimated_minutes) || 45,
      actual_minutes: 0,
      priority: taskData.priority || 'medium',
      is_completed: false,
      notes: taskData.notes || ''
    };
    const updated = [newTask, ...studyTasks];
    setStudyTasks(updated);
    storageService.saveStudyTasks(updated);
    addToast({ title: 'Study Task Created', message: `Added "${newTask.title}"`, type: 'success' });
  };

  const deleteTask = (taskId) => {
    const updated = studyTasks.filter((t) => t.id !== taskId);
    setStudyTasks(updated);
    storageService.saveStudyTasks(updated);
    addToast({ title: 'Task Deleted', message: 'Study task removed', type: 'info' });
  };

  // 5. Exam Actions
  const addExam = (examData) => {
    const newExam = {
      id: `exam-${Date.now()}`,
      title: examData.title,
      subject_id: examData.subject_id || null,
      exam_type: examData.exam_type || 'MTT',
      exam_date: examData.exam_date,
      exam_time: examData.exam_time || '10:00',
      venue: examData.venue || '',
      priority: examData.priority || 'high',
      notes: examData.notes || '',
      is_completed: false
    };
    const updated = [...exams, newExam].sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
    setExams(updated);
    storageService.saveExams(updated);
    addToast({ title: 'Exam Added', message: `Scheduled ${newExam.exam_type}: ${newExam.title}`, type: 'success' });
  };

  const updateExam = (id, examData) => {
    const updated = exams.map((e) => (e.id === id ? { ...e, ...examData } : e));
    setExams(updated);
    storageService.saveExams(updated);
    addToast({ title: 'Exam Updated', message: 'Changes have been saved', type: 'success' });
  };

  const deleteExam = (id) => {
    const updated = exams.filter((e) => e.id !== id);
    setExams(updated);
    storageService.saveExams(updated);
    addToast({ title: 'Exam Removed', message: 'Exam deleted from planner', type: 'info' });
  };

  // 6. Subject & Syllabus Actions
  const addSubject = (subjectData) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      code: subjectData.code,
      name: subjectData.name,
      color: subjectData.color || '#06b6d4',
      credits: Number(subjectData.credits) || 3
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    storageService.saveSubjects(updated);
    addToast({ title: 'Subject Added', message: `${newSub.code} - ${newSub.name} created`, type: 'success' });
  };

  const updateTopicStatus = (topicId, status) => {
    const updated = syllabus.map((t) => (t.id === topicId ? { ...t, status, revision_count: status === 'completed' ? (t.revision_count || 0) + 1 : t.revision_count } : t));
    setSyllabus(updated);
    storageService.saveSyllabus(updated);
    addToast({ title: 'Syllabus Updated', message: `Topic status marked as ${status.replace('_', ' ')}`, type: 'info' });
  };

  const addTopic = (topicData) => {
    const newTopic = {
      id: `top-${Date.now()}`,
      subject_id: topicData.subject_id,
      chapter_name: topicData.chapter_name || 'General',
      title: topicData.title,
      status: 'not_started',
      difficulty: topicData.difficulty || 'medium',
      revision_count: 0
    };
    const updated = [...syllabus, newTopic];
    setSyllabus(updated);
    storageService.saveSyllabus(updated);
    addToast({ title: 'Topic Added', message: `Added ${newTopic.title}`, type: 'success' });
  };

  // 7. Reminders Actions
  const toggleReminder = (id) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r));
    setReminders(updated);
    storageService.saveReminders(updated);
  };

  const addReminder = (remData) => {
    const newRem = {
      id: `rem-${Date.now()}`,
      reminder_type: remData.reminder_type,
      title: remData.title,
      reminder_time: remData.reminder_time,
      is_active: true,
      frequency: remData.frequency || 'daily'
    };
    const updated = [...reminders, newRem];
    setReminders(updated);
    storageService.saveReminders(updated);
    addToast({ title: 'Reminder Set', message: `Reminder for ${newRem.title} scheduled`, type: 'success' });
  };

  const deleteReminder = (id) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    storageService.saveReminders(updated);
  };

  return (
    <WellnessContext.Provider
      value={{
        exams,
        subjects,
        syllabus,
        studyTasks,
        todayTasks,
        meals,
        todayMeals,
        waterLogs,
        todayWaterLogs,
        sleepLogs,
        latestSleep,
        reminders,
        currentWaterMl,
        waterGoalMl,
        mealsLoggedCount,
        studyTasksCompleted,
        studyMinutesToday,
        sleepHours,
        sleepGoalHours,
        wellnessScore,
        addWater,
        removeWaterLog,
        toggleMeal,
        logSleep,
        toggleTaskCompletion,
        addStudyTask,
        deleteTask,
        addExam,
        updateExam,
        deleteExam,
        addSubject,
        addTopic,
        updateTopicStatus,
        toggleReminder,
        addReminder,
        deleteReminder
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};
