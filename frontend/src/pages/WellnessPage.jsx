import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import {
  HeartPulse,
  Droplets,
  Utensils,
  Moon,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { Modal } from '../components/common/Modal.jsx';

export const WellnessPage = () => {
  const {
    meals,
    todayMeals,
    toggleMeal,
    waterLogs,
    todayWaterLogs,
    currentWaterMl,
    waterGoalMl,
    addWater,
    removeWaterLog,
    sleepLogs,
    latestSleep,
    sleepHours,
    sleepGoalHours,
    logSleep,
    wellnessScore
  } = useWellness();

  // Active view tab: 'overview' | 'meals' | 'water' | 'sleep'
  const [activeTab, setActiveTab] = useState('overview');

  // Custom water input state
  const [customWater, setCustomWater] = useState('');

  // Sleep modal state
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [sleepForm, setSleepForm] = useState({
    bedtime: '23:30',
    wakeTime: '07:00',
    quality: 'good',
    notes: ''
  });

  // Calculate duration between bedtime and wake time
  const calculateSleepDuration = (bed, wake) => {
    if (!bed || !wake) return 7.5;
    const [bH, bM] = bed.split(':').map(Number);
    const [wH, wM] = wake.split(':').map(Number);

    let startMinutes = bH * 60 + bM;
    let endMinutes = wH * 60 + wM;

    // Overnight crossover (e.g. 23:30 to 07:00)
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    const diff = (endMinutes - startMinutes) / 60;
    return Number(diff.toFixed(2));
  };

  const handleSleepSubmit = (e) => {
    e.preventDefault();
    const duration = calculateSleepDuration(sleepForm.bedtime, sleepForm.wakeTime);
    logSleep({
      bedtime: sleepForm.bedtime,
      wakeTime: sleepForm.wakeTime,
      durationHours: duration,
      quality: sleepForm.quality,
      notes: sleepForm.notes
    });
    setIsSleepModalOpen(false);
  };

  const handleCustomWaterSubmit = (e) => {
    e.preventDefault();
    const val = Number(customWater);
    if (val > 0 && val <= 3000) {
      addWater(val);
      setCustomWater('');
    }
  };

  const mealSlots = [
    { type: 'breakfast', label: 'Breakfast', defaultTime: '08:30', desc: 'Brain glucose ignition' },
    { type: 'lunch', label: 'Lunch', defaultTime: '13:00', desc: 'Sustained cognitive stamina' },
    { type: 'snacks', label: 'Snacks', defaultTime: '17:00', desc: 'Midday focus replenishment' },
    { type: 'dinner', label: 'Dinner', defaultTime: '20:30', desc: 'Recovery & rest nutrition' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Wellness Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain nutrition, hydration, and restorative sleep to defend cognitive performance during exam weeks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSleepModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
          >
            + Log Sleep
          </button>
        </div>
      </div>

      {/* Wellness Disclaimer Banner */}
      <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong>Habit-Consistency Disclaimer:</strong> This platform is designed solely to help students balance routine habits during exam deadlines. It does not provide medical advice, dietary diagnosis, or clinical prescriptions.
        </p>
      </div>

      {/* 3 Core Trackers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= 1. MEAL TRACKER ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Meal Routine</h3>
                  <p className="text-[11px] text-slate-500">4 target nutrition slots</p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800">
                {todayMeals.filter((m) => m.is_completed).length} / 4
              </span>
            </div>

            <div className="space-y-2.5">
              {mealSlots.map((slot) => {
                const logged = todayMeals.find((m) => m.meal_type === slot.type && m.is_completed);
                return (
                  <div
                    key={slot.type}
                    onClick={() => toggleMeal(slot.type)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      logged
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50/60 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className={`p-1 rounded-lg transition ${
                          logged ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-500'
                        }`}
                      >
                        {logged ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <h4 className={`text-xs font-bold ${logged ? 'text-emerald-950 font-bold' : 'text-slate-800'}`}>
                          {slot.label}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {logged?.description || slot.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {logged?.meal_time || slot.defaultTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            💡 Skipping meals during revision causes sudden blood glucose drops, triggering brain fog and headaches.
          </div>
        </div>

        {/* ================= 2. HYDRATION TRACKER ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hydration Log</h3>
                  <p className="text-[11px] text-slate-500">Goal: {waterGoalMl} ml</p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800">
                {currentWaterMl} ml
              </span>
            </div>

            {/* Visual Hydration Meter */}
            <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 text-center">
              <span className="text-3xl font-black text-sky-700 font-mono">
                {Math.min(100, Math.round((currentWaterMl / waterGoalMl) * 100))}%
              </span>
              <p className="text-[11px] text-sky-600 font-semibold mt-0.5">
                {Math.max(0, waterGoalMl - currentWaterMl)} ml remaining today
              </p>
              <div className="w-full bg-sky-200/50 rounded-full h-3 mt-3 overflow-hidden">
                <div
                  className="bg-sky-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (currentWaterMl / waterGoalMl) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Log Water
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addWater(150)}
                  className="py-2 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl border border-sky-200 transition text-center"
                >
                  +150 ml (Cup)
                </button>
                <button
                  onClick={() => addWater(250)}
                  className="py-2 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl border border-sky-200 transition text-center"
                >
                  +250 ml (Glass)
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="py-2 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl border border-sky-200 transition text-center"
                >
                  +500 ml (Bottle)
                </button>
              </div>
            </div>

            {/* Custom Amount */}
            <form onSubmit={handleCustomWaterSubmit} className="flex gap-2">
              <input
                type="number"
                min="50"
                max="2000"
                step="50"
                value={customWater}
                onChange={(e) => setCustomWater(e.target.value)}
                placeholder="Custom ml (e.g. 350)"
                className="flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Log
              </button>
            </form>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            💧 Even a 1% body water drop triggers cortisol release and heightened exam anxiety.
          </div>
        </div>

        {/* ================= 3. SLEEP TRACKER ================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sleep & Rest</h3>
                  <p className="text-[11px] text-slate-500">Goal: {sleepGoalHours} hrs / night</p>
                </div>
              </div>
              <button
                onClick={() => setIsSleepModalOpen(true)}
                className="text-xs font-bold px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 transition"
              >
                + Update
              </button>
            </div>

            {/* Recent Sleep Status */}
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">Last Night Duration</span>
                <span className="text-xs font-bold capitalize px-2 py-0.5 rounded-md bg-purple-200 text-purple-900">
                  {latestSleep?.quality || 'Good'}
                </span>
              </div>
              <p className="text-3xl font-black text-purple-900 font-mono">
                {latestSleep?.duration_hours ? `${latestSleep.duration_hours} hrs` : 'Awaiting log'}
              </p>
              <div className="text-[11px] text-purple-700 flex items-center justify-between">
                <span>Bed: {latestSleep?.bedtime || '23:30'}</span>
                <span>Wake: {latestSleep?.wake_time || '07:00'}</span>
              </div>
            </div>

            {/* Sleep Advice */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">Exam-Week Memory Protocol</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                Long-term memory synthesis requires slow-wave and REM sleep cycles. 7+ hours is an academic investment, not lost study time.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            🌙 Pulling an all-nighter decreases mathematical working memory by up to 40% on test day.
          </div>
        </div>
      </div>

      {/* Water Log History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
        <h3 className="text-base font-bold text-slate-900">Today's Hydration Entries</h3>
        {todayWaterLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-3">No water logged yet today.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {todayWaterLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-900 font-semibold"
              >
                <span>+{log.amount_ml} ml</span>
                <span className="text-[10px] text-sky-600 font-normal">
                  ({new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                </span>
                <button
                  onClick={() => removeWaterLog(log.id)}
                  className="text-sky-400 hover:text-rose-500 transition ml-1"
                  title="Remove log"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sleep Log Modal */}
      <Modal isOpen={isSleepModalOpen} onClose={() => setIsSleepModalOpen(false)} title="Log Sleep Duration">
        <form onSubmit={handleSleepSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bedtime</label>
              <input
                type="time"
                value={sleepForm.bedtime}
                onChange={(e) => setSleepForm({ ...sleepForm, bedtime: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wake-up Time</label>
              <input
                type="time"
                value={sleepForm.wakeTime}
                onChange={(e) => setSleepForm({ ...sleepForm, wakeTime: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-900">
            Calculated Duration: <strong>{calculateSleepDuration(sleepForm.bedtime, sleepForm.wakeTime)} hours</strong> (supports overnight crossing)
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sleep Restfulness Quality</label>
            <select
              value={sleepForm.quality}
              onChange={(e) => setSleepForm({ ...sleepForm, quality: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
            >
              <option value="excellent">Excellent (Woke up energized)</option>
              <option value="good">Good (Normal rest)</option>
              <option value="fair">Fair (Interrupted or slightly tired)</option>
              <option value="poor">Poor (Restless or insufficient)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={sleepForm.notes}
              onChange={(e) => setSleepForm({ ...sleepForm, notes: e.target.value })}
              placeholder="e.g. Avoided mobile screen 30m before bed."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSleepModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition"
            >
              Save Sleep Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

