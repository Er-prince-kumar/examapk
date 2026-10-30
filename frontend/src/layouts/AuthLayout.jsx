import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from '../components/common/ToastContainer.jsx';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <ToastContainer />
      {/* Top Bar */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-glow-cyan">
            ⚡
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight">ExamNoCrash</span>
          </div>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-800"
        >
          ← Back to Overview
        </Link>
      </header>

      {/* Main Form Center Card */}
      <main className="my-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-4">
        ExamWeekWithoutTheCrash • Designed for collegiate MTT & ETT peak performance.
      </footer>
    </div>
  );
};
