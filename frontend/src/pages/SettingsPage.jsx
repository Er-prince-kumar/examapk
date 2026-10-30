import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWellness } from '../context/WellnessContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { storageService } from '../services/storageService.js';
import {
  User,
  Settings,
  Shield,
  Download,
  RotateCcw,
  Trash2,
  Lock,
  Clock,
  Droplets,
  Moon,
  Timer,
  CheckCircle2
} from 'lucide-react';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog.jsx';

export const SettingsPage = () => {
  const { profile, updateProfile, isGuest, logout } = useAuth();
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    university: profile?.university || 'Lovely Professional University (LPU)',
    branch: profile?.branch || 'Computer Science & Engineering',
    current_semester: profile?.current_semester || 5,
    timezone: profile?.timezone || 'Asia/Kolkata',
    daily_water_goal_ml: profile?.daily_water_goal_ml || 2500,
    daily_sleep_goal_hours: profile?.daily_sleep_goal_hours || 7.5,
    pomodoro_work_minutes: profile?.pomodoro_work_minutes || 25,
    pomodoro_break_minutes: profile?.pomodoro_break_minutes || 5
  });

  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      addToast({ title: 'Validation Error', message: 'New passwords do not match.', type: 'error' });
      return;
    }
    if (passwordForm.newPass.length < 6) {
      addToast({ title: 'Validation Error', message: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    addToast({ title: 'Password Updated', message: 'Your password has been changed successfully.', type: 'success' });
  };

  const handleExportData = () => {
    const data = storageService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExamNoCrash_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Data Exported', message: 'Student records downloaded as JSON.', type: 'success' });
  };

  const handleResetData = () => {
    storageService.resetAllToSeed();
    addToast({ title: 'Data Reset', message: 'Reset to default student records.', type: 'info' });
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    storageService.resetAllToSeed();
    await logout();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your academic details, daily hydration/sleep goals, and manage your account.
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Student Identity</h2>
            <p className="text-xs text-slate-500">Your university program and semester cohort</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University / College</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Degree</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
              <select
                value={formData.current_semester}
                onChange={(e) => setFormData({ ...formData, current_semester: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Goals Section */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Daily Wellness Targets</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>Daily Water Goal (ml)</span>
                </label>
                <input
                  type="number"
                  min="1000"
                  max="5000"
                  step="100"
                  value={formData.daily_water_goal_ml}
                  onChange={(e) => setFormData({ ...formData, daily_water_goal_ml: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-purple-500" />
                  <span>Daily Sleep Target (Hours)</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="12"
                  step="0.5"
                  value={formData.daily_sleep_goal_hours}
                  onChange={(e) => setFormData({ ...formData, daily_sleep_goal_hours: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Password Security Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Security & Password</h2>
            <p className="text-xs text-slate-500">Update your account credentials</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={passwordForm.newPass}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="Re-enter password"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Danger Zone */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
        <h3 className="text-base font-bold text-slate-900">Data Portability & Danger Zone</h3>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Data (JSON)</span>
          </button>
          <button
            onClick={() => setResetModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Reset to Default Seed</span>
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs transition"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete Account & Purge Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation */}
      <ConfirmationDialog
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetData}
        title="Reset All Records?"
        message="This will reset your exams, syllabus, tasks, and wellness logs back to the initial sample state."
        confirmText="Reset Records"
        isDanger={false}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Student Account?"
        message="This will permanently delete your profile, examination plans, and wellness tracking data."
        confirmText="Permanently Delete"
        isDanger={true}
      />
    </div>
  );
};

