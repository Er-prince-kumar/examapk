import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsGuest, isSupabaseConfigured } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSupabaseLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast({ title: 'Validation Error', message: 'Please enter both email and password.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      addToast({
        title: 'Authentication Failed',
        message: err.message || 'Invalid credentials or connection issue.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/app');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">Student Login</h2>
        <p className="text-xs text-slate-400 mt-1">
          Welcome back to ExamWeekWithoutTheCrash
        </p>
      </div>

      {/* 1-Click Instant Guest Mode Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300 mb-1">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Frictionless Evaluation Mode</span>
        </div>
        <p className="text-[11px] text-cyan-200/80 leading-relaxed mb-3">
          Explore all features immediately with pre-seeded MTT exams, subjects, and wellness metrics stored locally.
        </p>
        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs tracking-wide transition shadow-glow-cyan flex items-center justify-center gap-2"
        >
          <span>Continue with 1-Click Guest Demo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-700"></div>
        <span className="flex-shrink mx-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Or with Supabase Auth
        </span>
        <div className="flex-grow border-t border-slate-700"></div>
      </div>

      <form onSubmit={handleSupabaseLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Student Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyan-400 transition"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyan-400 transition"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 border border-slate-600"
        >
          {loading ? 'Authenticating...' : 'Sign In via Supabase'}
        </button>
      </form>

      {!isSupabaseConfigured && (
        <p className="text-[11px] text-slate-400 text-center bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
          ℹ️ Supabase environment variables not configured yet in .env; use 1-Click Guest Demo above for instant testing!
        </p>
      )}

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 font-bold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

