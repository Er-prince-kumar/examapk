import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import {
  Bell,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Droplets,
  Utensils,
  Timer,
  Moon,
  CalendarDays,
  Coffee
} from 'lucide-react';
import { Modal } from '../components/common/Modal.jsx';

export const RemindersPage = () => {
  const { reminders, toggleReminder, addReminder, deleteReminder } = useWellness();
  const {
    hasBrowserSupport,
    permission,
    requestBrowserPermission,
    triggerNotification
  } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    reminder_type: 'water',
    title: '',
    reminder_time: '11:00',
    frequency: 'daily'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    addReminder(formData);
    setFormData({
      reminder_type: 'water',
      title: '',
      reminder_time: '11:00',
      frequency: 'daily'
    });
    setIsModalOpen(false);
  };

  const handleTestNotification = () => {
    triggerNotification('ExamNoCrash Reminder Test', {
      body: 'Time to drink 250ml water and relax your neck muscles!',
      type: 'success'
    });
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'water':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'meal':
        return <Utensils className="w-4 h-4 text-emerald-500" />;
      case 'study':
        return <Timer className="w-4 h-4 text-cyan-500" />;
      case 'break':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-purple-500" />;
      default:
        return <CalendarDays className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reminder Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure alarms for water intake, meals, Pomodoro stretch intervals, and bedtime curfews.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestNotification}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Test Alert
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition"
          >
            + Create Reminder
          </button>
        </div>
      </div>

      {/* Browser Notification Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-600 shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">System Push Notifications</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                permission === 'granted'
                  ? 'bg-emerald-100 text-emerald-800'
                  : permission === 'denied'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Blocked' : 'Action Required'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Enable browser alerts to receive prompts even while working in other tabs. In-app banner toasts always display.
            </p>
          </div>
        </div>

        {permission !== 'granted' && (
          <button
            onClick={requestBrowserPermission}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition shrink-0"
          >
            Allow Notifications
          </button>
        )}
      </div>

      {/* Background Notification Limitation Transparency Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Honest Device Limitation Notice:</strong>
          Modern mobile browsers (Chrome on Android, iOS Safari) strictly suspend background tab execution when the screen is locked to save battery. While the app is open or installed as a PWA, reminders fire reliably. For 100% background ringing when phone is completely closed, install the Capacitor Android package.
        </div>
      </div>

      {/* Active Reminders List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Configured Reminders</h3>

        <div className="space-y-3">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                rem.is_active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {getReminderIcon(rem.reminder_type)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">{rem.title}</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono">{rem.reminder_time}</span>
                    <span>•</span>
                    <span className="capitalize">{rem.frequency}</span>
                    <span>•</span>
                    <span className="capitalize text-slate-400">{rem.reminder_type}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleReminder(rem.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    rem.is_active ? 'bg-cyan-500' : 'bg-slate-300'
                  }`}
                  title={rem.is_active ? 'Deactivate reminder' : 'Activate reminder'}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      rem.is_active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Reminder Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Reminder">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Category</label>
            <select
              value={formData.reminder_type}
              onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="water">Hydration (Drink water)</option>
              <option value="meal">Meal Routine (Breakfast/Lunch/Dinner)</option>
              <option value="break">Study Break (Stretch/Eye Rest)</option>
              <option value="study">Study Focus Session</option>
              <option value="sleep">Bedtime Wind-Down</option>
              <option value="exam">Exam Countdown Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Message</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Drink 250ml water & stretch neck"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trigger Time</label>
              <input
                type="time"
                value={formData.reminder_time}
                onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="daily">Everyday</option>
                <option value="hourly">Hourly during study</option>
                <option value="weekdays">Weekdays only</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition"
            >
              Schedule Reminder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

