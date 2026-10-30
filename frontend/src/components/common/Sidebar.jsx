import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Timer,
  HeartPulse,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
  { name: 'Exam Planner', path: '/app/exams', icon: CalendarDays },
  { name: 'Syllabus', path: '/app/syllabus', icon: BookOpen },
  { name: 'Study & Pomodoro', path: '/app/study', icon: Timer },
  { name: 'Wellness Center', path: '/app/wellness', icon: HeartPulse },
  { name: 'AI Assistant', path: '/app/ai', icon: Sparkles, badge: 'Gemini' },
  { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  { name: 'Reminders', path: '/app/reminders', icon: Bell },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export const Sidebar = () => {
  const { profile, logout, isGuest } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <NavLink to="/app" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-glow-cyan">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight leading-tight group-hover:text-cyan-400 transition">
              ExamNoCrash
            </h1>
            <p className="text-[11px] text-cyan-400/80 font-medium tracking-wide">
              Study Smart • Stay Healthy
            </p>
          </div>
        </NavLink>
      </div>

      {/* Mode Badge */}
      <div className="px-6 py-3">
        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
          isGuest ? 'bg-cyan-950/60 border border-cyan-800/50 text-cyan-300' : 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-300'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isGuest ? 'Demo / Local Storage' : 'Supabase Cloud Sync'}</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-cyan-400/20 text-cyan-300 tracking-wider">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Student Profile Card & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
            alt="Student Avatar"
            className="w-9 h-9 rounded-full object-cover border border-cyan-400/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{profile?.full_name || 'Alex Rivera'}</p>
            <p className="text-[11px] text-slate-400 truncate">{profile?.branch || 'CSE'}, Sem {profile?.current_semester || 5}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
