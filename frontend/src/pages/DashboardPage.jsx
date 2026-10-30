import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWellness } from '../context/WellnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  CalendarDays,
  Timer,
  Droplets,
  HeartPulse,
  Moon,
  Utensils,
  Plus,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Bell,
  Award,
  ChevronRight,
  Clock,
  BookOpen
} from 'lucide-react';
import { Modal } from '../components/common/Modal.jsx';

export const DashboardPage = () => {
  const { profile } = useAuth();
  const {
    exams,
    todayTasks,
    studyMinutesToday,
    studyTasksCompleted,
    meals,
    todayMeals,
    mealsLoggedCount,
    currentWaterMl,
    waterGoalMl,
    addWater,
    toggleMeal,
    latestSleep,
    sleepHours,
    sleepGoalHours,
    wellnessScore,
    toggleTaskCompletion,
    reminders
  } = useWellness();

  const [showScoreModal, setShowScoreModal] = useState(false);

  // Time-of-day greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Nearest upcoming exam calculation
  const nearestExam = exams && exams.length > 0 ? exams[0] : null;
  const daysUntilExam = nearestExam
    ? Math.max(0, Math.ceil((new Date(nearestExam.exam_date) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)))
    : null;

  // Study progress percentage
  const targetStudyHours = 4.0;
  const studyHoursCurrent = (studyMinutesToday / 60).toFixed(1);
  const studyPercent = Math.min(100, Math.round((studyMinutesToday / (targetStudyHours * 60)) * 100));

  // Hydration percentage
  const waterPercent = Math.min(100, Math.round((currentWaterMl / waterGoalMl) * 100));

  // Meal slots
  const mealSlots = ['breakfast', 'lunch', 'snacks', 'dinner'];

  return (
    <div className="space-y-6 pb-6">
      {/* 1. GREETING & DATE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {profile?.university || 'University Student'}
          </p>
        </div>

        {/* Daily Wellness Pill / Gauge */}
        <div
          onClick={() => setShowScoreModal(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl cursor-pointer hover:bg-slate-800 transition shadow-md group shrink-0"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-cyan-400 flex items-center justify-center font-black text-cyan-300 text-sm">
              {wellnessScore.overallScore}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-cyan-400">Daily Wellness</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${wellnessScore.status.badge}`}>
                {wellnessScore.status.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 group-hover:text-cyan-200 transition">
              Click for explainable breakdown →
            </p>
          </div>
        </div>
      </div>

      {/* 2. UPCOMING EXAM COUNTDOWN HERO CARD */}
      {nearestExam ? (
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient pointer-events-none opacity-20" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>Immediate Priority: {nearestExam.exam_type} Examination</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {nearestExam.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-cyan-400" />
                  {new Date(nearestExam.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ({nearestExam.exam_time})
                </span>
                {nearestExam.venue && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-cyan-400 font-bold">📍</span>
                    {nearestExam.venue}
                  </span>
                )}
                <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-semibold">
                  Priority: {nearestExam.priority}
                </span>
              </div>
            </div>

            {/* Live Countdown Clock */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-2xl text-center min-w-[70px]">
                <span className="text-2xl font-black text-cyan-400 font-mono">{daysUntilExam}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Days</span>
              </div>
              <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-2xl text-center min-w-[70px]">
                <span className="text-2xl font-black text-white font-mono">
                  {Math.max(0, 24 - new Date().getHours())}
                </span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Hours</span>
              </div>
              <Link
                to="/app/exams"
                className="p-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl font-bold transition shadow-glow-cyan"
                title="View in Exam Planner"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">No Upcoming Exams Scheduled</h3>
            <p className="text-xs text-slate-500 mt-0.5">Add your MTT or ETT timetable to unlock automatic countdowns.</p>
          </div>
          <Link
            to="/app/exams"
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
          >
            + Add Exam
          </Link>
        </div>
      )}

      {/* 3. FOUR CORE HABIT STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Study Progress */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle hover:border-cyan-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Study Duration</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{studyHoursCurrent}</span>
              <span className="text-xs text-slate-400 font-semibold">/ {targetStudyHours} hrs</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${studyPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>{studyTasksCompleted}/{todayTasks.length} tasks completed</span>
              <Link to="/app/study" className="text-cyan-600 font-bold hover:underline">Pomodoro →</Link>
            </div>
          </div>
        </div>

        {/* Card 2: Meal Completion */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meals Logged</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{mealsLoggedCount}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 4 meals</span>
            </div>
            {/* Meal indicator pills */}
            <div className="flex gap-1.5 mt-2">
              {mealSlots.map((type) => {
                const logged = todayMeals.some((m) => m.meal_type === type && m.is_completed);
                return (
                  <button
                    key={type}
                    onClick={() => toggleMeal(type)}
                    className={`flex-1 py-1 rounded-md text-[10px] font-bold uppercase transition ${
                      logged
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                    title={`Click to mark ${type}`}
                  >
                    {type[0]}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>{mealsLoggedCount === 4 ? 'All meals on track' : 'Brain fuel check'}</span>
              <Link to="/app/wellness" className="text-emerald-600 font-bold hover:underline">Meals →</Link>
            </div>
          </div>
        </div>

        {/* Card 3: Hydration */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle hover:border-sky-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Water Intake</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{currentWaterMl}</span>
              <span className="text-xs text-slate-400 font-semibold">/ {waterGoalMl} ml</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-1 mt-2">
              <button
                onClick={() => addWater(250)}
                className="flex-1 py-1 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[10px] font-bold transition text-center"
              >
                +250 ml
              </button>
              <button
                onClick={() => addWater(500)}
                className="flex-1 py-1 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[10px] font-bold transition text-center"
              >
                +500 ml
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Sleep Duration */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle hover:border-purple-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sleep Duration</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{sleepHours || '—'}</span>
              <span className="text-xs text-slate-400 font-semibold">/ {sleepGoalHours} hrs</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((sleepHours / sleepGoalHours) * 100))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span className="capitalize">{latestSleep?.quality || 'Good'} rest</span>
              <Link to="/app/wellness" className="text-purple-600 font-bold hover:underline">Sleep →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI SUGGESTION BANNER & QUICK ACTIONS */}
      <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wider">
              Gemini AI Daily Recommendation
            </h4>
            <p className="text-xs sm:text-sm text-cyan-950 mt-1 leading-relaxed">
              {studyTasksCompleted < todayTasks.length
                ? `You have pending tasks for today. Start a 25-minute Pomodoro session now to tackle high-priority topics before mental fatigue sets in.`
                : `Superb! You finished all planned tasks for today. Wind down with light formula flashcards and get to bed on time for optimal neural consolidation.`}
            </p>
          </div>
        </div>
        <Link
          to="/app/ai"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shrink-0"
        >
          <span>Open AI Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 5. SPLIT: TODAY'S TASKS & REMINDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Tasks */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">Today's Priority Study Tasks</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {studyTasksCompleted}/{todayTasks.length}
              </span>
            </div>
            <Link
              to="/app/study"
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              <span>Manage all tasks</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No tasks scheduled for today. Add one in the Study Planner.</p>
          ) : (
            <div className="space-y-2.5">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                    task.is_completed
                      ? 'bg-slate-50 border-slate-100 text-slate-400'
                      : 'bg-white border-slate-200 hover:border-cyan-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`p-1 rounded-lg transition ${
                        task.is_completed ? 'text-emerald-500' : 'text-slate-400 hover:text-cyan-500'
                      }`}
                      aria-label="Toggle complete"
                    >
                      {task.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold truncate ${task.is_completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {task.estimated_minutes} mins • Priority: <span className="capitalize">{task.priority}</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/app/study"
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 text-xs font-semibold shrink-0"
                  >
                    Study
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Upcoming Reminders */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Active Reminders</h3>
            <Link to="/app/reminders" className="text-xs font-bold text-cyan-600 hover:text-cyan-700">
              Configure
            </Link>
          </div>

          <div className="space-y-3">
            {reminders.slice(0, 4).map((rem) => (
              <div
                key={rem.id}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="p-2 rounded-xl bg-cyan-100/60 text-cyan-700 shrink-0 mt-0.5">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{rem.title}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{rem.reminder_time} • {rem.frequency}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-100/70 rounded-2xl text-[11px] text-slate-600 leading-relaxed border border-slate-200/50">
            🔔 In-app prompts will remind you to drink water, stretch, and eat regular meals.
          </div>
        </div>
      </div>

      {/* Wellness Score Explainability Modal */}
      <Modal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        title="Explainable Daily Wellness Score"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
            <div>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Overall Consistency</p>
              <h2 className="text-3xl font-black mt-0.5">{wellnessScore.overallScore} <span className="text-lg text-slate-400 font-normal">/ 100</span></h2>
            </div>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${wellnessScore.status.badge}`}>
              {wellnessScore.status.label}
            </span>
          </div>

          <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
            ℹ️ {wellnessScore.disclaimer}
          </p>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Category Breakdown & Formula</h4>
            {Object.entries(wellnessScore.categories).map(([key, cat]) => (
              <div key={key} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-subtle flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{cat.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      Weight: {cat.weight}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{cat.details}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900">{cat.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

