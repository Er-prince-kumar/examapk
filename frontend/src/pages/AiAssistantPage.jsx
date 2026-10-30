import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiService } from '../services/apiService.js';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  HeartPulse
} from 'lucide-react';

export const AiAssistantPage = () => {
  const { profile } = useAuth();
  const {
    exams,
    subjects,
    syllabus,
    studyTasks,
    todayMeals,
    currentWaterMl,
    waterGoalMl,
    sleepHours,
    sleepGoalHours
  } = useWellness();

  // Daily plan state
  const [dailyPlan, setDailyPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello ${profile?.full_name?.split(' ')[0] || 'there'}! I am your ExamWeek AI Assistant. I have live access to your upcoming MTT/ETT dates, syllabus topics, and wellness logs. How can I assist your revision or routine balance today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Generate Daily Exam & Wellness Plan
  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    try {
      const payload = {
        studentProfile: profile,
        exams,
        subjects,
        studyTasks,
        meals: todayMeals,
        water: { currentMl: currentWaterMl, goalMl: waterGoalMl },
        sleep: { durationHours: sleepHours, goalHours: sleepGoalHours }
      };

      const res = await apiService.getAiDailyPlan(payload);
      setDailyPlan(res.data);
    } catch (err) {
      console.warn('AI Plan request fallback:', err.message);
      setDailyPlan({
        provider: 'smart-heuristic-advisor',
        content: `### Daily Exam & Wellness Plan for ${profile?.full_name || 'Student'}

#### 1. Daily Assessment
You have **${exams.length} upcoming examinations** and active revision targets. Protecting mental stamina through hydration and regular meals will give you an unfair advantage over fatigued peers.

#### 2. Priority Focus
* Prioritize high-weightage topics for your nearest exam (**${exams[0]?.title || 'Core Subject'}**).
* Tackle mathematical and complex conceptual proofs in your morning 25-minute Pomodoro blocks.

#### 3. Wellness Guardrails
* **Hydration:** Current intake is ${currentWaterMl} / ${waterGoalMl} ml. Drink a glass of water before each focus block.
* **Meals:** Do not skip lunch or dinner during study sessions—glucose is the brain's primary fuel.
* **Sleep:** Maintain at least 7.5 hours of sleep tonight to consolidate memory.

#### 4. Suggested Daily Schedule
* **Morning (9:00 - 12:00):** 3 Pomodoro focus sessions on core problem sets.
* **Lunch & Recharge (12:30 - 1:30):** Nutritious meal + 15 min walk.
* **Afternoon (2:00 - 5:00):** Theory revision & PYQ solution practice.
* **Evening (6:30 - 9:00):** Formula sheet review + flashcards.
* **Wind-Down (10:30 PM):** Digital curfew for restorative sleep.`
      });
    } finally {
      setLoadingPlan(false);
    }
  };

  // Chat message send
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');
    setLoadingChat(true);

    try {
      const studentContext = {
        upcomingExamsCount: exams.length,
        nearestExamTitle: exams[0]?.title || 'None',
        pendingTasksCount: studyTasks.filter((t) => !t.is_completed).length,
        waterMl: currentWaterMl,
        mealsLoggedCount: todayMeals.filter((m) => m.is_completed).length,
        sleepHours
      };

      const res = await apiService.sendAiChatMessage(currentInput, messages, studentContext);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.data?.reply || res.data?.content || 'Keep pushing consistently with structured Pomodoro breaks!',
          provider: res.data?.provider,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      // Local heuristic fallback response
      let fallbackReply = `Great question! When revising for ${exams[0]?.title || 'exams'}, practice active recall rather than passive re-reading. Also make sure to keep your water bottle filled!`;
      if (currentInput.toLowerCase().includes('sleep') || currentInput.toLowerCase().includes('night')) {
        fallbackReply = `Please avoid all-nighters! Sleep is the biological phase where hippocampal memory gets consolidated into neocortex circuits. Aim for at least 7 hours tonight.`;
      }
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: fallbackReply,
          provider: 'smart-heuristic-advisor',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Wellness & Academic Assistant
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs">
              Powered by Google Gemini
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized exam-week scheduling, active recall strategies, and anti-burnout pacing.
          </p>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={loadingPlan}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loadingPlan ? 'Analyzing Records...' : 'Generate Daily Exam Plan'}</span>
        </button>
      </div>

      {/* Safety & Medical Non-Claim Guardrail Alert */}
      <div className="p-3.5 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 text-xs flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white">AI Safety & Ethical Guardrails:</strong> Our assistant strictly refuses to recommend all-nighters or skipping meals. All guidance is supportive academic habits coaching and never medical diagnosis or exam score guarantees.
        </div>
      </div>

      {/* AI Daily Plan Display (If generated) */}
      {dailyPlan && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cyan-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Personalized Daily Survival Plan</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
              Provider: {dailyPlan.provider || 'Gemini'}
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-slate-700 space-y-3 leading-relaxed whitespace-pre-line font-sans text-xs sm:text-sm">
            {dailyPlan.content}
          </div>
        </div>
      )}

      {/* Interactive Chat Window */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col h-[520px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Exam Strategy & Wellness Coach</h3>
              <p className="text-[10px] text-slate-400">Context aware • Upcoming exams: {exams.length}</p>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="text-xs text-slate-400 hover:text-slate-600 transition"
            title="Clear chat"
          >
            Clear
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-sm'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-sm'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loadingChat && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-10">
              <Bot className="w-4 h-4 animate-bounce text-cyan-500" />
              <span>Analyzing student schedule & composing advice...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-6 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">Quick ask:</span>
          {[
            'How should I prioritize my remaining chapters?',
            'Tips to handle pre-exam anxiety before MTT?',
            'Should I study late or sleep early before test?'
          ].map((prompt, pi) => (
            <button
              key={pi}
              onClick={() => setInputMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-700 transition shrink-0 whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about revision scheduling, focus techniques, or wellness balance..."
            className="flex-1 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loadingChat || !inputMessage.trim()}
            className="p-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-glow-cyan disabled:opacity-50"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

