import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Timer, HeartPulse, Sparkles } from 'lucide-react';

const mobileTabs = [
  { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
  { name: 'Exams', path: '/app/exams', icon: CalendarDays },
  { name: 'Study', path: '/app/study', icon: Timer },
  { name: 'Wellness', path: '/app/wellness', icon: HeartPulse },
  { name: 'AI Tutor', path: '/app/ai', icon: Sparkles },
];

export const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/app'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition text-[11px] font-medium ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{tab.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
