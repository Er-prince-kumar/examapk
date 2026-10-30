import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { User, Mail, Lock, School, BookOpen, ArrowRight, Zap } from 'lucide-react';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    university: 'Lovely Professional University (LPU)',
    branch: 'Computer Science & Engineering',
    semester: 5
  });
  const [loading, setLoading] = useState(false);
  const { signup, loginAsGuest, isSupabaseConfigured } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      addToast({ title: 'Validation Error', message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.fullName);
      navigate('/login');
    } catch (err) {
      addToast({
        title: 'Registration Error',
        message: err.message || 'Failed to create student account.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    navigate('/app');
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Student Account</h2>
        <p className="text-xs text-slate-400 mt-1">
          Start balancing exam study with healthy habits
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-center">
        <button
          type="button"
          onClick={handleGuest}
          className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs tracking-wide transition shadow-glow-cyan flex items-center justify-center gap-2"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Skip & Use 1-Click Guest Demo</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Rivera"
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Student Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@university.edu"
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-cyan-400"
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-400"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs tracking-wide transition border border-slate-600"
        >
          {loading ? 'Creating Account...' : 'Register with Supabase'}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

