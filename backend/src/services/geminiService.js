import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
let model = null;

if (apiKey && apiKey !== 'your-google-gemini-api-key') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for fast, responsive student wellness advice
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (err) {
    console.warn('[Gemini Init Warning] Could not initialize Gemini client:', err.message);
  }
}

const SYSTEM_INSTRUCTION = `
You are the AI Wellness & Academic Balance Assistant for ExamWeekWithoutTheCrash, designed specifically for college students preparing for MTT (Mid Term Tests) and ETT (End Term Tests).
Your core mission is to help students study effectively while strictly protecting their sleep, hydration, and regular meals.

CRITICAL SAFETY & ETHICAL RULES:
1. NEVER suggest or endorse all-nighters, skipping meals, or sleeping under 6 hours.
2. Provide motivational, habit-reinforcing study schedules and practical revision techniques (Pomodoro, active recall, spaced repetition).
3. Do NOT provide medical diagnosis, dietary prescriptions, or pharmaceutical advice.
4. Do NOT promise guaranteed exam marks or outcomes.
5. Always be encouraging, empathetic, structured, and realistic. Keep advice actionable in bullet points.
`;

/**
 * Generate personalized daily plan and wellness recommendations based on real student records
 */
export const generateDailyPlan = async ({ studentProfile, exams, subjects, studyTasks, meals, water, sleep }) => {
  const contextSummary = `
Student Profile: ${studentProfile?.full_name || 'Student'} (${studentProfile?.branch || 'Engineering'}, Sem ${studentProfile?.current_semester || 5})
Upcoming Exams: ${exams?.length > 0 ? JSON.stringify(exams.slice(0, 4).map(e => ({ title: e.title, type: e.exam_type, date: e.exam_date, priority: e.priority }))) : 'No exams logged yet'}
Pending Study Tasks: ${studyTasks?.length > 0 ? JSON.stringify(studyTasks.filter(t => !t.is_completed).slice(0, 5).map(t => ({ title: t.title, est_min: t.estimated_minutes, priority: t.priority }))) : 'None pending'}
Today's Meals: ${meals?.length > 0 ? meals.map(m => m.meal_type).join(', ') : 'None logged yet'}
Today's Hydration: ${water?.currentMl || 0} / ${water?.goalMl || 2500} ml
Last Night's Sleep: ${sleep?.durationHours || 0} hours (Goal: ${sleep?.goalHours || 7.5} hrs)
`;

  if (model) {
    try {
      const prompt = `
${SYSTEM_INSTRUCTION}

Here is the student's current live preparation & wellness status:
${contextSummary}

Please provide:
1. Daily Assessment (1-2 sentences on their current balance)
2. Priority Focus (Top 2-3 study topics to tackle today based on upcoming MTT/ETT deadlines)
3. Wellness Check (Specific hydration, meal, and sleep prompt for today)
4. Suggested Time Block Plan (Morning, Afternoon, Evening blocks with built-in Pomodoro breaks)
5. Encouraging Takeaway

Format with clear headers and bullet points.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return {
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        content: text,
        generatedAt: new Date().toISOString()
      };
    } catch (err) {
      console.warn('[Gemini API call failed, falling back to smart heuristics]:', err.message);
    }
  }

  // Smart Heuristic Fallback Engine
  return generateHeuristicDailyPlan({ studentProfile, exams, subjects, studyTasks, meals, water, sleep });
};

/**
 * Answer interactive student questions regarding study plans, exam stress, and routine
 */
export const chatWithAssistant = async ({ message, history = [], studentContext }) => {
  if (model) {
    try {
      const chat = model.startChat({
        history: history.map(h => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        }
      });

      const contextualMessage = `[System context: Student has ${studentContext?.upcomingExamsCount || 0} upcoming exams, ${studentContext?.pendingTasksCount || 0} pending tasks. Hydration: ${studentContext?.waterMl || 0}ml. Today's meals: ${studentContext?.mealsLoggedCount || 0}/4]\n\nStudent question: ${message}`;
      const result = await chat.sendMessage(contextualMessage);
      return {
        provider: 'gemini',
        reply: result.response.text(),
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.warn('[Gemini Chat failed, using heuristic advisor]:', err.message);
    }
  }

  // Heuristic Chat Fallback
  return generateHeuristicChatReply(message, studentContext);
};

// Heuristic Daily Plan Generator
function generateHeuristicDailyPlan({ studentProfile, exams, subjects, studyTasks, meals, water, sleep }) {
  const name = studentProfile?.full_name || 'Student';
  const nearestExam = exams && exams.length > 0 ? exams[0] : null;
  const pendingTasks = (studyTasks || []).filter(t => !t.is_completed);

  let focusAdvice = nearestExam
    ? `Allocate 60% of your prime focus time today to **${nearestExam.title}** (${nearestExam.exam_type} on ${nearestExam.exam_date}). Tackle high-weightage topics first.`
    : `Prioritize clearing core conceptual bottlenecks and pending revision tasks across your current subjects.`;

  let wellnessAdvice = [];
  if ((water?.currentMl || 0) < 1500) {
    wellnessAdvice.push(`Hydration is below optimal (${water?.currentMl || 0} ml). Keep a water bottle at your desk and aim for 250ml per study session.`);
  }
  if (!meals || meals.length < 2) {
    wellnessAdvice.push(`Ensure you do not skip meals during revision—brain glycogen depletion causes brain fog and mental fatigue.`);
  }
  if ((sleep?.durationHours || 7.5) < 6) {
    wellnessAdvice.push(`Target at least 7 hours of restorative sleep tonight. Memory consolidation for your revision happens during REM and slow-wave sleep.`);
  }

  const content = `### Daily Exam & Wellness Plan for ${name}

#### 1. Daily Assessment
You have **${exams?.length || 0} upcoming examinations** and **${pendingTasks.length} pending study tasks**. Staying disciplined with breaks will preserve mental stamina for the exams ahead.

#### 2. Priority Focus
* ${focusAdvice}
* ${pendingTasks.length > 0 ? `Tackle **"${pendingTasks[0].title}"** in your first 50-minute Pomodoro block while your concentration is fresh.` : `Review formula sheets and key definitions for your upcoming exams.`}
* Practice active recall rather than passive re-reading.

#### 3. Wellness & Anti-Crash Guardrails
* ${wellnessAdvice.length > 0 ? wellnessAdvice.join('\n* ') : 'Great job maintaining your hydration and meal habits! Keep this momentum up.'}
* Take a mandatory 5-minute movement or eye-rest break after every 25 minutes of deep focus.

#### 4. Suggested Time Block Plan
* **Morning Block (9:00 AM - 12:30 PM):** High-difficulty problem solving and core theory (3 x 25-min Pomodoro sessions).
* **Lunch & Recharge (12:30 PM - 1:30 PM):** Wholesome meal, 15-minute screen-free walk, 300ml water.
* **Afternoon Block (2:00 PM - 5:00 PM):** Practice questions, past year papers, or syllabus topic notes.
* **Evening Wrap-up (6:30 PM - 9:00 PM):** Flashcards, formula sheets, light review, planning tomorrow's tasks.
* **Wind-down (10:30 PM):** Digital curfew 30 mins before bed for restorative sleep.

#### 5. Takeaway
*Consistency beats cramming.* Protect your baseline sleep and nutrition, and your exam performance will follow naturally.`;

  return {
    provider: 'smart-heuristic-advisor',
    model: 'heuristic-v1',
    content,
    generatedAt: new Date().toISOString()
  };
}

// Heuristic Chat Reply
function generateHeuristicChatReply(message, context) {
  const lower = message.toLowerCase();
  let reply = '';

  if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('panic') || lower.includes('scared')) {
    reply = `It is completely normal to feel exam pressure, especially during MTT and ETT weeks. Here is a quick 3-step reset:
1. **Box Breathing:** Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. Repeat 4 times.
2. **Break it Down:** Pick just ONE 25-minute Pomodoro task from your list and ignore the rest for right now.
3. **Drink Water:** Grab 250ml of cool water. Physical dehydration amplifies cognitive anxiety. You've got this!`;
  } else if (lower.includes('sleep') || lower.includes('night') || lower.includes('all-nighter')) {
    reply = `We strongly advise against pulling an all-nighter. Scientific studies demonstrate that staying up all night degrades working memory and analytical speed by up to 40% on exam day! 
Aim for at least 6 to 7.5 hours of uninterrupted sleep. Your brain consolidates facts and problem-solving patterns into long-term memory while you sleep.`;
  } else if (lower.includes('plan') || lower.includes('schedule') || lower.includes('how to study')) {
    reply = `Here is the optimal study framework for exam preparation:
1. **Interleaving:** Don't study one subject all day; rotate between 2 complementary subjects (e.g., Math/Algorithm in morning, Theory/Concept in afternoon).
2. **Pomodoro:** 25 mins focus, 5 mins break. After 4 cycles, take a longer 20-min recharge break.
3. **Feynman Technique:** Explain the hardest topic in simple words as if teaching a freshman student. If you stumble, re-read that specific section.`;
  } else {
    reply = `Great question! When preparing during examination weeks, balance is your secret weapon. Make sure to:
1. Keep your hydration target updated (aim for 2,000 - 2,500 ml/day).
2. Mark completed study tasks in your Study Planner to maintain visual momentum.
3. Prioritize your highest-weightage topics before moving to secondary details.
How else can I assist your exam preparation today?`;
  }

  return {
    provider: 'smart-heuristic-advisor',
    reply,
    timestamp: new Date().toISOString()
  };
}
