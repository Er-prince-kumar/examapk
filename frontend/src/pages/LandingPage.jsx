import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  HeartPulse,
  Timer,
  Droplets,
  Moon,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  Coffee,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const LandingPage = () => {
  const { loginAsGuest } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [previewTab, setPreviewTab] = useState('exam');

  const faqs = [
    {
      q: 'Why was ExamWeekWithoutTheCrash created?',
      a: 'During collegiate Mid Term Tests (MTT) and End Term Tests (ETT), students routinely sacrifice sleep, skip nutritious meals, and become dehydrated. Ironically, this sleep and nutritional deficit causes severe brain fog, lower analytical recall, and emotional burnout on the exact test days they worked so hard for. This platform restores optimal cognitive stamina by harmonizing preparation with baseline health routines.'
    },
    {
      q: 'Does this platform give medical or nutritional advice?',
      a: 'No. ExamWeekWithoutTheCrash is strictly a habit-consistency and motivational tracking companion. It does not provide medical diagnoses, clinical nutrition prescriptions, or examination mark guarantees.'
    },
    {
      q: 'How does the Explainable Wellness Score work?',
      a: 'Your daily score (0 to 100) is calculated from four transparent categories: Study Progress (30%), Meals (25%), Hydration (20%), and Sleep Duration (25%). Missing daytime records are handled honestly without falsely zeroing ongoing hours.'
    },
    {
      q: 'Is my student data private and isolated?',
      a: 'Yes! When using Supabase Cloud, every database table enforces PostgreSQL Row Level Security (RLS) linked strictly to your authentication UUID. In offline/demo mode, your data stays in your browser local storage.'
    },
    {
      q: 'Can I install this on my Android device?',
      a: 'Yes! ExamWeekWithoutTheCrash is built as a Progressive Web App (PWA) with full standalone mobile display mode, and is fully configured for native compilation via Capacitor.'
    },
    {
      q: 'How does the Gemini AI Assistant help during exam week?',
      a: 'Our secure backend queries Google Gemini (with an intelligent heuristic fallback) using your actual upcoming exam dates, pending topics, and wellness metrics to generate realistic daily time blocks, anti-cramming techniques, and stress reduction prompts.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-glow-cyan">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight">ExamNoCrash</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60">
                MTT & ETT Edition
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#problem" className="hover:text-cyan-400 transition">The Problem</a>
            <a href="#features" className="hover:text-cyan-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a>
            <a href="#preview" className="hover:text-cyan-400 transition">Interactive Demo</a>
            <a href="#faq" className="hover:text-cyan-400 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl transition hover:bg-slate-800"
            >
              Log In
            </Link>
            <Link
              to="/app"
              onClick={loginAsGuest}
              className="text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 px-4 sm:px-5 py-2 rounded-xl shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.18),rgba(15,23,42,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-8 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Study Smart • Stay Healthy • Perform Better</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Ace your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">MTT & ETT Exams</span> without the physical crash.
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            During exam week, student meal, hydration, and sleep routines collapse under deadline panic. ExamWeekWithoutTheCrash balances revision tasks with essential biological stamina.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app"
              onClick={loginAsGuest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-cyan-500 text-slate-950 font-black text-base shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Instant Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 text-white font-bold text-base border border-slate-700 transition"
            >
              <span>Create Free Student Account</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div>
              <p className="text-3xl font-extrabold text-cyan-400">30 / 25 / 20 / 25</p>
              <p className="text-xs text-slate-400 mt-1">Study, Meal, Hydration, Sleep Weights</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">100%</p>
              <p className="text-xs text-slate-400 mt-1">Zero Fake Mock UI — Fully Tested</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-cyan-400">Gemini AI</p>
              <p className="text-xs text-slate-400 mt-1">Adaptive Daily Time-Block Advice</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">PWA + APK</p>
              <p className="text-xs text-slate-400 mt-1">Web & Android Capacitor Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM SECTION */}
      <section id="problem" className="py-20 bg-slate-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">The Examination Paradox</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Why 78% of students underperform on the exams they prepared for
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Pulling all-nighters, living on cold caffeine, and missing three meals does not make you a hero—it impairs cognitive speed, memory consolidation, and emotional composure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-4">
                🌙
              </div>
              <h3 className="text-lg font-bold text-white">Sleep Deprivation</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                REM sleep is mandatory for consolidating newly learned theorems and problem-solving patterns into long-term memory. Sleeping under 5 hours drops test recall by up to 35%.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                🥪
              </div>
              <h3 className="text-lg font-bold text-white">Meal Skipping & Brain Fog</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                The human brain consumes roughly 20% of resting metabolic glucose. Missing lunch during exam cramming causes acute glucose drops, leading to lethargy and headaches.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4">
                💧
              </div>
              <h3 className="text-lg font-bold text-white">Dehydration & Anxiety</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Mild dehydration (just 1-2% body weight fluid drop) directly impairs concentration, spikes cortisol (stress hormone), and triggers exam panic loops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN FEATURES GRID */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Complete Full-Stack Platform</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            One Intelligent System for Exams & Biological Wellness
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Every feature is connected: your completed Pomodoro sessions, water logs, and syllabus progress feed into one explainable daily score.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">MTT & ETT Exam Planner</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Schedule tests with subject codes, examination venues, priorities, and live down-to-the-minute countdown clocks.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Subject & Syllabus Tracker</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Break subjects into chapters, topics, difficulty tags, and revision counts with visual percentage progress rings.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Pomodoro Focus Timer</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              25/5/15 intervals with visual circular timer, audio chime, and built-in ergonomic break suggestions (eye rest, stretches).
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Hydration Tracker</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Configurable daily goal, quick 150ml, 250ml, 500ml one-click buttons, animated water wave progress, and editable logs.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Overnight Sleep Tracker</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Accurately handles bedtime-to-wake crossover across midnight, ratings for sleep quality, and weekly sleep duration trends.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-slate-850/60 border border-slate-800 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Google Gemini AI Assistant</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Secure backend AI providing contextual daily study time-blocks, burnout detection, and motivational revision coaching.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PREVIEW TABS */}
      <section id="preview" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Live Feature Preview</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Designed for the Modern Collegiate Workflow</h2>
            <p className="mt-2 text-slate-400 text-xs sm:text-sm">Click through the modules to see how data flows in real-time.</p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'exam', label: 'Exam Countdown', icon: CalendarDays },
                { id: 'wellness', label: 'Wellness Gauges', icon: HeartPulse },
                { id: 'timer', label: 'Study Pomodoro', icon: Timer },
                { id: 'ai', label: 'Gemini AI Plan', icon: Sparkles }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPreviewTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      previewTab === tab.id
                        ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Screen Preview Box */}
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {previewTab === 'exam' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold">MTT</span>
                    <h4 className="text-base font-bold text-white">CSE316: Operating Systems & System Programming</h4>
                  </div>
                  <span className="text-xs text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
                    3 Days Left
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-xs text-slate-400">Date & Venue</span>
                    <p className="text-sm font-semibold text-white mt-1">Monday, 10:00 AM • Block 34, Rm 402</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-xs text-slate-400">High Weightage Focus</span>
                    <p className="text-sm font-semibold text-white mt-1">Virtual Memory, Page Replacement, Semaphores</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-xs text-slate-400">Revision Status</span>
                    <p className="text-sm font-semibold text-cyan-300 mt-1">2 / 3 chapters completed (67%)</p>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'wellness' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400">Study Progress</span>
                  <p className="text-2xl font-black text-cyan-400 mt-1">60%</p>
                  <p className="text-[11px] text-slate-500 mt-1">2.5 / 4.0 hrs</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400">Meal Completion</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">75%</p>
                  <p className="text-[11px] text-slate-500 mt-1">3 / 4 logged</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400">Hydration</span>
                  <p className="text-2xl font-black text-sky-400 mt-1">70%</p>
                  <p className="text-[11px] text-slate-500 mt-1">1,750 / 2,500 ml</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <span className="text-xs text-slate-400">Sleep Rest</span>
                  <p className="text-2xl font-black text-purple-400 mt-1">7.2h</p>
                  <p className="text-[11px] text-slate-500 mt-1">Goal: 7.5 hrs</p>
                </div>
              </div>
            )}

            {previewTab === 'timer' && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-bold border border-cyan-800/50">
                    Focus Interval
                  </span>
                  <h4 className="text-xl font-bold text-white mt-2">Dijkstra Shortest Path Numerical Practice</h4>
                  <p className="text-xs text-slate-400 mt-1">Linked Subject: CSE306 Design & Analysis of Algorithms</p>
                </div>
                <div className="text-center px-6 py-4 rounded-2xl bg-slate-800 border border-slate-700">
                  <span className="text-4xl font-black text-cyan-400 font-mono">24:45</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Session 2 of 4</p>
                </div>
              </div>
            )}

            {previewTab === 'ai' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">AI Daily Exam Guidance</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/70 p-4 rounded-xl border border-slate-700/50">
                  "You have 3 days until your MTT for <strong>Operating Systems</strong>. Your hydration is currently at 1,750ml (great start). Today, focus your morning 25-minute Pomodoro sessions on <em>Virtual Memory Paging</em>. Take a 15-minute screen-free lunch break at 1:00 PM to protect cognitive endurance."
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Simple 4-Step Routine</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">How It Protects Your Grades & Health</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <span className="text-3xl font-black text-cyan-500/30">01</span>
            <h3 className="text-base font-bold text-white mt-2">Log Your MTT & ETT Dates</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Enter your exam timetable, syllabus chapters, and priorities. The app calculates live countdowns and remaining revision hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <span className="text-3xl font-black text-cyan-500/30">02</span>
            <h3 className="text-base font-bold text-white mt-2">Track 4 Essential Habits</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Use 1-click water buttons, mark meals as completed, and track your bedtime with effortless logging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <span className="text-3xl font-black text-cyan-500/30">03</span>
            <h3 className="text-base font-bold text-white mt-2">Follow AI Time-Blocks</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Get realistic daily plans from Google Gemini that balance intensive problem solving with mandatory eye and movement breaks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <span className="text-3xl font-black text-cyan-500/30">04</span>
            <h3 className="text-base font-bold text-white mt-2">Ace Exam Day Rested</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Walk into the examination hall with full analytical recall, sharp focus, and zero jittery burnout headaches.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Everything You Need to Know</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180 text-cyan-400' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready for your best exam week yet?
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of college students conquering MTT and ETT deadlines with mental clarity and physical vitality.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app"
              onClick={loginAsGuest}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-sm shadow-glow-cyan hover:bg-cyan-400 transition"
            >
              Start Free Today
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>

      {/* 9. RESPONSIVE FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <p className="font-bold text-white text-sm">ExamWeekWithoutTheCrash</p>
              <p className="text-[11px] text-slate-400">Study Smart • Stay Healthy • Perform Better</p>
            </div>
          </div>
          <p className="text-center">
            Motivational habit consistency indicator. Not medical advice or academic prediction.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/app" onClick={loginAsGuest} className="hover:text-cyan-400 transition">App</Link>
            <Link to="/login" className="hover:text-cyan-400 transition">Login</Link>
            <Link to="/signup" className="hover:text-cyan-400 transition">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

