import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useWellness } from '../../context/WellnessContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Bell, Sparkles, AlertCircle, Info, Calendar } from 'lucide-react';
import { Modal } from './Modal.jsx';

export const Navbar = () => {
  const { wellnessScore, exams } = useWellness();
  const { profile } = useAuth();
  const [showScoreModal, setShowScoreModal] = useState(false);

  // Find nearest upcoming exam
  const nearestExam = exams && exams.length > 0 ? exams[0] : null;
  const daysUntilExam = nearestExam
    ? Math.ceil((new Date(nearestExam.exam_date) - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Title or Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-sm">
            ⚡
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-base">ExamNoCrash</span>
        </div>

        {/* Nearest Exam Countdown Pill */}
        {nearestExam && (
          <NavLink
            to="/app/exams"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-medium hover:bg-cyan-100 transition shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span>
              <strong>{nearestExam.exam_type}:</strong> {nearestExam.title.slice(0, 24)}...
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-600 text-white font-bold text-[10px]">
              {daysUntilExam === 0 ? 'Today!' : daysUntilExam === 1 ? 'Tomorrow' : `${daysUntilExam}d left`}
            </span>
          </NavLink>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Explainable Wellness Score Pill */}
        <button
          onClick={() => setShowScoreModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition bg-white shadow-subtle group"
          title="Click to view explainable score breakdown"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-600 group-hover:text-cyan-700">Wellness Score:</span>
          <span className="text-xs font-black text-slate-900 px-1.5 py-0.5 rounded-md bg-slate-100 group-hover:bg-cyan-100 group-hover:text-cyan-800">
            {wellnessScore.overallScore}/100
          </span>
        </button>

        {/* Quick Link to AI Assistant */}
        <NavLink
          to="/app/ai"
          className="p-2 rounded-xl text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 transition border border-transparent hover:border-cyan-100"
          title="AI Exam Assistant"
        >
          <Sparkles className="w-4 h-4 text-cyan-600" />
        </NavLink>

        {/* Reminders Bell */}
        <NavLink
          to="/app/reminders"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
          title="Reminder Center"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500" />
        </NavLink>

        {/* Student Avatar */}
        <NavLink to="/app/settings" className="flex items-center gap-2 pl-2">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 hover:ring-cyan-400 transition"
          />
        </NavLink>
      </div>

      {/* Wellness Score Explainability Modal */}
      <Modal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        title="Explainable Daily Wellness Score"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
            <div>
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Overall Consistency</p>
              <h2 className="text-3xl font-black mt-0.5">{wellnessScore.overallScore} <span className="text-lg text-slate-400 font-normal">/ 100</span></h2>
            </div>
            <div className="text-right">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${wellnessScore.status.badge}`}>
                {wellnessScore.status.label}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
            ℹ️ {wellnessScore.disclaimer}
          </p>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Category Breakdown & Formula</h4>
            {Object.entries(wellnessScore.categories).map(([key, cat]) => (
              <div key={key} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-subtle flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{cat.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      Weight: {cat.weight}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{cat.details}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900">{cat.score}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-cyan-50/70 border border-cyan-100 rounded-xl text-xs text-cyan-900 leading-relaxed">
            <strong>Honest Metric Transparency:</strong> Unlike rigid trackers, ongoing sleep hours are not treated as 0% failure during midday. The algorithm dynamically reflects real completed habits without unfair penalty.
          </div>
        </div>
      </Modal>
    </header>
  );
};
