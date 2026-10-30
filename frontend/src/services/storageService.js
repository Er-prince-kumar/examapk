/**
 * Offline-First Persistent Storage Service for ExamWeekWithoutTheCrash
 * Handles initial seed data, local CRUD operations, and sync readiness.
 */

const STORAGE_KEYS = {
  PROFILE: 'ewnc_profile',
  SUBJECTS: 'ewnc_subjects',
  SYLLABUS: 'ewnc_syllabus',
  EXAMS: 'ewnc_exams',
  STUDY_TASKS: 'ewnc_study_tasks',
  STUDY_SESSIONS: 'ewnc_study_sessions',
  MEALS: 'ewnc_meals',
  WATER_LOGS: 'ewnc_water_logs',
  SLEEP_LOGS: 'ewnc_sleep_logs',
  REMINDERS: 'ewnc_reminders',
  SETTINGS: 'ewnc_settings',
  DAILY_SCORES: 'ewnc_daily_scores'
};

// Seed initial profile
const DEFAULT_PROFILE = {
  id: 'guest-student-local',
  full_name: 'Alex Rivera',
  university: 'Lovely Professional University (LPU)',
  branch: 'Computer Science & Engineering',
  current_semester: 5,
  timezone: 'Asia/Kolkata',
  daily_water_goal_ml: 2500,
  daily_sleep_goal_hours: 7.5,
  pomodoro_work_minutes: 25,
  pomodoro_break_minutes: 5,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
};

// Seed initial subjects
const DEFAULT_SUBJECTS = [
  { id: 'sub-1', code: 'CSE316', name: 'Operating Systems', color: '#06b6d4', credits: 4 },
  { id: 'sub-2', code: 'CSE306', name: 'Design & Analysis of Algorithms', color: '#3b82f6', credits: 4 },
  { id: 'sub-3', code: 'CSE320', name: 'Computer Networks', color: '#8b5cf6', credits: 3 },
  { id: 'sub-4', code: 'INT335', name: 'Artificial Intelligence', color: '#10b981', credits: 3 }
];

// Seed initial syllabus topics
const DEFAULT_SYLLABUS = [
  { id: 'top-1', subject_id: 'sub-1', chapter_name: 'Process Management', title: 'Process Scheduling & Synchronization (Semaphores)', status: 'completed', difficulty: 'hard', revision_count: 2 },
  { id: 'top-2', subject_id: 'sub-1', chapter_name: 'Deadlocks', title: 'Banker Algorithm & Resource Allocation Graph', status: 'in_progress', difficulty: 'medium', revision_count: 1 },
  { id: 'top-3', subject_id: 'sub-1', chapter_name: 'Memory Management', title: 'Paging, Segmentation and TLB Hit Ratio', status: 'not_started', difficulty: 'hard', revision_count: 0 },
  { id: 'top-4', subject_id: 'sub-2', chapter_name: 'Dynamic Programming', title: '0/1 Knapsack & Matrix Chain Multiplication', status: 'completed', difficulty: 'hard', revision_count: 3 },
  { id: 'top-5', subject_id: 'sub-2', chapter_name: 'Graph Algorithms', title: 'Bellman-Ford & Dijkstra Shortest Paths', status: 'in_progress', difficulty: 'medium', revision_count: 1 },
  { id: 'top-6', subject_id: 'sub-3', chapter_name: 'Network Layer', title: 'IP Subnetting & CIDR Address Calculation', status: 'completed', difficulty: 'medium', revision_count: 2 },
  { id: 'top-7', subject_id: 'sub-3', chapter_name: 'Transport Layer', title: 'TCP 3-Way Handshake & Flow Control', status: 'not_started', difficulty: 'easy', revision_count: 0 },
  { id: 'top-8', subject_id: 'sub-4', chapter_name: 'Search Algorithms', title: 'A* Search & Heuristic Admissibility', status: 'completed', difficulty: 'medium', revision_count: 2 }
];

// Seed initial upcoming MTT and ETT exams
const today = new Date();
const inDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const DEFAULT_EXAMS = [
  {
    id: 'exam-1',
    subject_id: 'sub-1',
    title: 'Operating Systems & System Programming',
    exam_type: 'MTT',
    exam_date: inDays(3),
    exam_time: '10:00',
    venue: 'Block 34, Hall 202',
    priority: 'high',
    notes: 'Revise virtual memory numericals, page replacement (FIFO, LRU, Optimal).',
    is_completed: false
  },
  {
    id: 'exam-2',
    subject_id: 'sub-2',
    title: 'Design and Analysis of Algorithms',
    exam_type: 'MTT',
    exam_date: inDays(6),
    exam_time: '14:00',
    venue: 'Block 36, Hall 1',
    priority: 'urgent',
    notes: 'Solve recurrence relations via Master Theorem and DP table tracing.',
    is_completed: false
  },
  {
    id: 'exam-3',
    subject_id: 'sub-3',
    title: 'Computer Networks',
    exam_type: 'ETT',
    exam_date: inDays(22),
    exam_time: '09:30',
    venue: 'Main Examination Hall A',
    priority: 'medium',
    notes: 'Subnetting formulas and TCP header structure.',
    is_completed: false
  }
];

// Seed initial study tasks
const DEFAULT_STUDY_TASKS = [
  {
    id: 'task-1',
    subject_id: 'sub-1',
    topic_id: 'top-1',
    title: 'Revise Process Synchronization & Semaphores',
    target_date: inDays(0),
    estimated_minutes: 45,
    actual_minutes: 45,
    priority: 'high',
    is_completed: true,
    completed_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'task-2',
    subject_id: 'sub-1',
    topic_id: 'top-2',
    title: 'Banker Algorithm Numerical Problem Sets',
    target_date: inDays(0),
    estimated_minutes: 45,
    actual_minutes: 45,
    priority: 'high',
    is_completed: true,
    completed_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  },
  {
    id: 'task-3',
    subject_id: 'sub-2',
    topic_id: 'top-5',
    title: 'Trace Dijkstra Algorithm with Adjacency Matrix',
    target_date: inDays(0),
    estimated_minutes: 35,
    actual_minutes: 0,
    priority: 'medium',
    is_completed: false
  },
  {
    id: 'task-4',
    subject_id: 'sub-1',
    topic_id: 'top-3',
    title: 'Virtual Memory Paging & TLB Hit/Miss Ratio',
    target_date: inDays(1),
    estimated_minutes: 50,
    actual_minutes: 0,
    priority: 'high',
    is_completed: false
  }
];

// Seed initial meals for today
const todayDateStr = inDays(0);
const DEFAULT_MEALS = [
  { id: 'meal-1', meal_type: 'breakfast', log_date: todayDateStr, meal_time: '08:45', is_completed: true, description: 'Oatmeal with almonds & banana + green tea' },
  { id: 'meal-2', meal_type: 'lunch', log_date: todayDateStr, meal_time: '13:15', is_completed: true, description: 'Brown rice, lentils (dal), mixed veggie curry' },
  { id: 'meal-3', meal_type: 'snacks', log_date: todayDateStr, meal_time: '17:00', is_completed: true, description: 'Roasted makhana and an apple' },
  { id: 'meal-4', meal_type: 'dinner', log_date: todayDateStr, meal_time: '20:30', is_completed: false, description: '' }
];

// Seed initial water logs for today
const DEFAULT_WATER_LOGS = [
  { id: 'w-1', amount_ml: 250, log_date: todayDateStr, logged_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
  { id: 'w-2', amount_ml: 500, log_date: todayDateStr, logged_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
  { id: 'w-3', amount_ml: 500, log_date: todayDateStr, logged_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { id: 'w-4', amount_ml: 500, log_date: todayDateStr, logged_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
];

// Seed initial sleep logs
const yesterdayDateStr = inDays(-1);
const DEFAULT_SLEEP_LOGS = [
  {
    id: 's-1',
    sleep_date: todayDateStr,
    bedtime: '23:30',
    wake_time: '07:00',
    duration_hours: 7.5,
    quality: 'good',
    notes: 'Felt well rested, avoided screen 30m prior.'
  },
  {
    id: 's-2',
    sleep_date: yesterdayDateStr,
    bedtime: '00:00',
    wake_time: '07:15',
    duration_hours: 7.25,
    quality: 'fair',
    notes: 'Studied slightly late, but maintained sleep goal.'
  }
];

// Seed reminders
const DEFAULT_REMINDERS = [
  { id: 'rem-1', reminder_type: 'water', title: 'Hydration prompt: drink 250ml water', reminder_time: '10:00', is_active: true, frequency: 'hourly' },
  { id: 'rem-2', reminder_type: 'meal', title: 'Lunch break — nourish your brain', reminder_time: '13:00', is_active: true, frequency: 'daily' },
  { id: 'rem-3', reminder_type: 'break', title: 'Pomodoro stretch & 20-20-20 eye rest', reminder_time: '16:00', is_active: true, frequency: 'daily' },
  { id: 'rem-4', reminder_type: 'meal', title: 'Dinner time — avoid studying while eating', reminder_time: '20:30', is_active: true, frequency: 'daily' },
  { id: 'rem-5', reminder_type: 'sleep', title: 'Bedtime wind-down & screens off', reminder_time: '23:00', is_active: true, frequency: 'daily' },
  { id: 'rem-6', reminder_type: 'exam', title: 'MTT Exam countdown reminder', reminder_time: '08:00', is_active: true, frequency: 'daily' }
];

class StorageService {
  get(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn(`[StorageService] Failed to read ${key}:`, e);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[StorageService] Failed to set ${key}:`, e);
    }
  }

  // Profile
  getProfile() {
    return this.get(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }
  saveProfile(profile) {
    this.set(STORAGE_KEYS.PROFILE, profile);
    return profile;
  }

  // Subjects
  getSubjects() {
    return this.get(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
  }
  saveSubjects(subjects) {
    this.set(STORAGE_KEYS.SUBJECTS, subjects);
    return subjects;
  }

  // Syllabus Topics
  getSyllabus() {
    return this.get(STORAGE_KEYS.SYLLABUS, DEFAULT_SYLLABUS);
  }
  saveSyllabus(topics) {
    this.set(STORAGE_KEYS.SYLLABUS, topics);
    return topics;
  }

  // Exams
  getExams() {
    return this.get(STORAGE_KEYS.EXAMS, DEFAULT_EXAMS);
  }
  saveExams(exams) {
    this.set(STORAGE_KEYS.EXAMS, exams);
    return exams;
  }

  // Study Tasks
  getStudyTasks() {
    return this.get(STORAGE_KEYS.STUDY_TASKS, DEFAULT_STUDY_TASKS);
  }
  saveStudyTasks(tasks) {
    this.set(STORAGE_KEYS.STUDY_TASKS, tasks);
    return tasks;
  }

  // Meals
  getMeals() {
    return this.get(STORAGE_KEYS.MEALS, DEFAULT_MEALS);
  }
  saveMeals(meals) {
    this.set(STORAGE_KEYS.MEALS, meals);
    return meals;
  }

  // Water Logs
  getWaterLogs() {
    return this.get(STORAGE_KEYS.WATER_LOGS, DEFAULT_WATER_LOGS);
  }
  saveWaterLogs(logs) {
    this.set(STORAGE_KEYS.WATER_LOGS, logs);
    return logs;
  }

  // Sleep Logs
  getSleepLogs() {
    return this.get(STORAGE_KEYS.SLEEP_LOGS, DEFAULT_SLEEP_LOGS);
  }
  saveSleepLogs(logs) {
    this.set(STORAGE_KEYS.SLEEP_LOGS, logs);
    return logs;
  }

  // Reminders
  getReminders() {
    return this.get(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS);
  }
  saveReminders(reminders) {
    this.set(STORAGE_KEYS.REMINDERS, reminders);
    return reminders;
  }

  // Reset to default seed
  resetAllToSeed() {
    this.set(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    this.set(STORAGE_KEYS.SUBJECTS, DEFAULT_SUBJECTS);
    this.set(STORAGE_KEYS.SYLLABUS, DEFAULT_SYLLABUS);
    this.set(STORAGE_KEYS.EXAMS, DEFAULT_EXAMS);
    this.set(STORAGE_KEYS.STUDY_TASKS, DEFAULT_STUDY_TASKS);
    this.set(STORAGE_KEYS.MEALS, DEFAULT_MEALS);
    this.set(STORAGE_KEYS.WATER_LOGS, DEFAULT_WATER_LOGS);
    this.set(STORAGE_KEYS.SLEEP_LOGS, DEFAULT_SLEEP_LOGS);
    this.set(STORAGE_KEYS.REMINDERS, DEFAULT_REMINDERS);
  }

  // Export all data as JSON
  exportData() {
    return {
      profile: this.getProfile(),
      subjects: this.getSubjects(),
      syllabus: this.getSyllabus(),
      exams: this.getExams(),
      studyTasks: this.getStudyTasks(),
      meals: this.getMeals(),
      waterLogs: this.getWaterLogs(),
      sleepLogs: this.getSleepLogs(),
      reminders: this.getReminders(),
      exportedAt: new Date().toISOString()
    };
  }

  // Import JSON data
  importData(data) {
    if (data.profile) this.saveProfile(data.profile);
    if (data.subjects) this.saveSubjects(data.subjects);
    if (data.syllabus) this.saveSyllabus(data.syllabus);
    if (data.exams) this.saveExams(data.exams);
    if (data.studyTasks) this.saveStudyTasks(data.studyTasks);
    if (data.meals) this.saveMeals(data.meals);
    if (data.waterLogs) this.saveWaterLogs(data.waterLogs);
    if (data.sleepLogs) this.saveSleepLogs(data.sleepLogs);
    if (data.reminders) this.saveReminders(data.reminders);
  }
}

export const storageService = new StorageService();
