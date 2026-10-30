import React, { useState, useEffect, useRef } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  Coffee,
  Eye,
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react';
import { Modal } from '../components/common/Modal.jsx';
import { apiService } from '../services/apiService.js';

export const StudyPlannerPage = () => {
  const {
    studyTasks,
    subjects,
    syllabus,
    toggleTaskCompletion,
    addStudyTask,
    deleteTask,
    exams
  } = useWellness();

  // Pomodoro State
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' | 'short_break' | 'long_break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(1);
  const [activeTaskId, setActiveTaskId] = useState(studyTasks[0]?.id || null);

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // New task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    subject_id: subjects[0]?.id || '',
    topic_id: '',
    estimated_minutes: 45,
    priority: 'high',
    target_date: new Date().toISOString().split('T')[0]
  });

  // Sound generator using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio not permitted or supported
    }
  };

  // Timer interval effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();

      if (mode === 'pomodoro') {
        setSessionsCompleted((prev) => prev + 1);
        if (sessionsCompleted % 4 === 0) {
          switchMode('long_break');
        } else {
          switchMode('short_break');
        }
      } else {
        switchMode('pomodoro');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, sessionsCompleted]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'pomodoro') setTimeLeft(25 * 60);
    else if (newMode === 'short_break') setTimeLeft(5 * 60);
    else if (newMode === 'long_break') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.title) return;
    addStudyTask(taskForm);
    setTaskForm({
      title: '',
      subject_id: subjects[0]?.id || '',
      topic_id: '',
      estimated_minutes: 45,
      priority: 'high',
      target_date: new Date().toISOString().split('T')[0]
    });
    setIsTaskModalOpen(false);
  };

  const handleGenerateAdaptiveSchedule = async () => {
    setScheduleLoading(true);
    try {
      const res = await apiService.generateStudySchedule({
        availableHoursPerDay: 4,
        targetExams: exams
      });
      setGeneratedSchedule(res.data);
      setIsScheduleModalOpen(true);
    } catch {
      // Fallback
      setGeneratedSchedule([
        {
          day: 'Day 1 (Today)',
          blocks: [
            { time: '09:00 - 09:50', title: 'High-Weightage OS: Virtual Memory & Page Replacement', subject: 'CSE316', type: 'Focus' },
            { time: '09:50 - 10:00', title: 'Water refill & Eye rest break', type: 'Break' },
            { time: '10:00 - 10:50', title: 'OS Deadlock: Banker Algorithm numericals', subject: 'CSE316', type: 'Focus' },
            { time: '14:00 - 14:50', title: 'DAA: Dynamic Programming Knapsack', subject: 'CSE306', type: 'Focus' }
          ]
        }
      ]);
      setIsScheduleModalOpen(true);
    } finally {
      setScheduleLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const activeTask = studyTasks.find((t) => t.id === activeTaskId);

  // Break suggestions pool
  const breakSuggestions = [
    { icon: Eye, title: '20-20-20 Eye Rest', desc: 'Look at an object 20 feet away for 20 seconds to prevent optical strain.' },
    { icon: Coffee, title: 'Rehydrate & Snack', desc: 'Drink 250ml water and eat light brain food (nuts, fruit).' },
    { icon: Activity, title: 'Physical Posture Reset', desc: 'Stand up, roll shoulders backward 10 times, stretch neck muscles.' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Planner & Pomodoro Timer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Focus in high-intensity intervals without burnout. Balance deep problem solving with biological recharges.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAdaptiveSchedule}
            disabled={scheduleLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{scheduleLoading ? 'Generating...' : 'Auto-Generate Schedule'}</span>
          </button>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Study Task</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Pomodoro Left, Task Manager Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pomodoro Timer & Break Guidance (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => switchMode('pomodoro')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === 'pomodoro'
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => switchMode('short_break')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === 'short_break'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => switchMode('long_break')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === 'long_break'
                    ? 'bg-purple-500 text-slate-950'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Circular Timer Visual */}
            <div className="my-6">
              <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white block">
                {formatTime(timeLeft)}
              </span>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mt-2">
                {mode === 'pomodoro' ? `Session #${sessionsCompleted} in Progress` : 'Rest & Recharge Interval'}
              </p>
            </div>

            {/* Active Task Link */}
            {activeTask && (
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-xs text-slate-300 mb-6 text-left">
                <span className="text-[10px] font-bold uppercase text-cyan-400">Targeting Task:</span>
                <p className="font-semibold text-white mt-0.5 truncate">{activeTask.title}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-slate-950 transition transform active:scale-95 ${
                  isRunning ? 'bg-amber-400 hover:bg-amber-300' : 'bg-cyan-500 hover:bg-cyan-400 shadow-glow-cyan'
                }`}
                title={isRunning ? 'Pause' : 'Start'}
              >
                {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => switchMode(mode)}
                className="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                title="Reset Interval"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Break Suggestions Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Coffee className="w-4 h-4 text-cyan-600" />
              <span>Scientific Break Protocols</span>
            </h3>
            <div className="space-y-2.5">
              {breakSuggestions.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white text-cyan-600 shadow-sm shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Study Tasks List & Scheduler (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Study Task Queue</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click a task to link it with the active Pomodoro interval.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                {studyTasks.filter((t) => t.is_completed).length} / {studyTasks.length} Completed
              </span>
            </div>

            {studyTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No tasks in queue. Add one to begin!</p>
            ) : (
              <div className="space-y-3">
                {studyTasks.map((task) => {
                  const isSelected = task.id === activeTaskId;
                  const matchingSub = subjects.find((s) => s.id === task.subject_id);

                  return (
                    <div
                      key={task.id}
                      onClick={() => setActiveTaskId(task.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50/40 shadow-sm'
                          : task.is_completed
                          ? 'border-slate-100 bg-slate-50 opacity-75'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskCompletion(task.id);
                          }}
                          className={`p-1 rounded-lg transition ${
                            task.is_completed ? 'text-emerald-500' : 'text-slate-400 hover:text-cyan-500'
                          }`}
                        >
                          {task.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {matchingSub && (
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white"
                                style={{ backgroundColor: matchingSub.color || '#06b6d4' }}
                              >
                                {matchingSub.code}
                              </span>
                            )}
                            <span className="text-[11px] font-semibold text-slate-500">
                              {task.estimated_minutes} mins
                            </span>
                            <span className="capitalize text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {task.priority}
                            </span>
                          </div>
                          <h4 className={`text-sm font-semibold mt-1 truncate ${task.is_completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && !task.is_completed && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-lg">
                            Active
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Create Study Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title / Problem Set</label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder="e.g. Solve 5 Banker's Algorithm Numerical Problems"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={taskForm.subject_id}
                onChange={(e) => setTaskForm({ ...taskForm, subject_id: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.code}: {sub.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Minutes</label>
              <input
                type="number"
                min="15"
                max="180"
                step="5"
                value={taskForm.estimated_minutes}
                onChange={(e) => setTaskForm({ ...taskForm, estimated_minutes: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="urgent">Urgent (Exam in ≤ 3 days)</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Date</label>
              <input
                type="date"
                value={taskForm.target_date}
                onChange={(e) => setTaskForm({ ...taskForm, target_date: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>

      {/* Generated Schedule Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Adaptive Exam-Week Schedule"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed bg-cyan-50 p-3 rounded-xl border border-cyan-100">
            Based on your nearest upcoming examinations and pending syllabus units, here is an optimized time-block routine that ensures consistent Pomodoro breaks.
          </p>

          {generatedSchedule && generatedSchedule.map((dayPlan, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <h4 className="text-sm font-bold text-slate-800">{dayPlan.day}</h4>
              <div className="space-y-2">
                {dayPlan.blocks.map((block, bi) => (
                  <div key={bi} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-slate-500 text-[11px] w-24 shrink-0">
                        {block.time}
                      </span>
                      <span className="font-medium text-slate-800">{block.title}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      block.type === 'Break' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      {block.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

