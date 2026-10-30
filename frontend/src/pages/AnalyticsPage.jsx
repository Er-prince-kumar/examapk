import React, { useState, useMemo } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Droplets,
  Moon,
  Timer,
  Utensils,
  Award
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { studyTasks, meals, waterLogs, sleepLogs, waterGoalMl, sleepGoalHours } = useWellness();
  const [timeRange, setTimeRange] = useState(7); // 7, 14, 30 days

  // Generate date series for charts
  const analyticsData = useMemo(() => {
    const days = [];
    for (let i = timeRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const shortDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

      // Daily study minutes
      const dayTasks = studyTasks.filter((t) => t.target_date === dateStr);
      const completedTasks = dayTasks.filter((t) => t.is_completed).length;
      const studyMins = dayTasks
        .filter((t) => t.is_completed)
        .reduce((sum, t) => sum + (Number(t.actual_minutes || t.estimated_minutes) || 0), 0);
      const studyHours = Number((studyMins / 60).toFixed(1));

      // Daily meals count
      const dayMeals = meals.filter((m) => m.log_date === dateStr && m.is_completed).length;

      // Daily water intake
      const dayWater = waterLogs
        .filter((w) => w.log_date === dateStr)
        .reduce((sum, w) => sum + (Number(w.amount_ml) || 0), 0);

      // Sleep duration
      const daySleep = sleepLogs.find((s) => s.sleep_date === dateStr);
      const sleepDuration = daySleep ? Number(daySleep.duration_hours) : (i === 0 ? 7.2 : 7.0);

      // Approximate wellness score for day
      const studyScore = Math.min(100, Math.round((studyHours / 4) * 100));
      const mealScore = Math.min(100, Math.round((dayMeals / 4) * 100));
      const waterScore = Math.min(100, Math.round((dayWater / waterGoalMl) * 100));
      const sleepScore = Math.min(100, Math.round((sleepDuration / sleepGoalHours) * 100));
      const score = Math.round(studyScore * 0.3 + mealScore * 0.25 + waterScore * 0.2 + sleepScore * 0.25);

      days.push({
        date: dateStr,
        name: shortDate,
        studyHours,
        completedTasks,
        meals: dayMeals,
        waterMl: dayWater,
        sleepHours: sleepDuration,
        wellnessScore: score
      });
    }
    return days;
  }, [timeRange, studyTasks, meals, waterLogs, sleepLogs, waterGoalMl, sleepGoalHours]);

  // Aggregate Key Statistics
  const avgStudyHours = useMemo(() => {
    const total = analyticsData.reduce((acc, d) => acc + d.studyHours, 0);
    return (total / analyticsData.length).toFixed(1);
  }, [analyticsData]);

  const waterHitDays = useMemo(() => {
    return analyticsData.filter((d) => d.waterMl >= waterGoalMl).length;
  }, [analyticsData, waterGoalMl]);

  const avgSleep = useMemo(() => {
    const total = analyticsData.reduce((acc, d) => acc + d.sleepHours, 0);
    return (total / analyticsData.length).toFixed(1);
  }, [analyticsData]);

  const avgScore = useMemo(() => {
    const total = analyticsData.reduce((acc, d) => acc + d.wellnessScore, 0);
    return Math.round(total / analyticsData.length);
  }, [analyticsData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic & Habit Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual trends across revision stamina, meal consistency, hydration targets, and sleep rest.
          </p>
        </div>

        {/* Date Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-subtle shrink-0">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                timeRange === days
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Last {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Study</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{avgStudyHours} hrs</p>
          <span className="text-[11px] text-slate-400">per day active revision</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Hydration Goal</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{waterHitDays} / {timeRange} days</p>
          <span className="text-[11px] text-slate-400">{Math.round((waterHitDays / timeRange) * 100)}% target achievement</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Sleep</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{avgSleep} hrs</p>
          <span className="text-[11px] text-slate-400">Goal: {sleepGoalHours} hrs/night</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Wellness Index</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{avgScore} / 100</p>
          <span className="text-[11px] text-slate-400">Average habit consistency</span>
        </div>
      </div>

      {/* Chart 1: Study Duration & Task Completion */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Study Hours & Task Productivity</h3>
            <p className="text-xs text-slate-500 mt-0.5">Focus hours studied vs target 4.0 hours</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} unit="h" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
              />
              <Bar dataKey="studyHours" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Hours Studied" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Hydration vs Goal & Sleep Rest */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Daily Hydration (ml)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="waterMl" stroke="#0284c7" fill="#e0f2fe" strokeWidth={2} name="Water (ml)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sleep Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Sleep Duration (Hours)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="h" domain={[0, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="sleepHours" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Sleep (Hours)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Wellness Score Trend Line */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Daily Wellness Score Trend (0 - 100)</h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="wellnessScore"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
                name="Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

