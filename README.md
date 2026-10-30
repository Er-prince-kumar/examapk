# ExamWeekWithoutTheCrash ⚡
> **Tagline:** Study Smart. Stay Healthy. Perform Better.  
> **Problem Statement:** During MTT (Mid Term Test) and ETT (End Term Test) examination weeks, students' meal, hydration, and sleep routines collapse under deadline pressure, degrading the very cognitive performance they are sacrificing for. Students need one intelligent platform to balance examination preparation with essential biological wellness habits.

---

## 🚀 Key Features

1. **MTT & ETT Examination Planner:**
   - Schedule Mid Term and End Term examinations with subject codes, venues, and exam dates/times.
   - Down-to-the-minute countdown clocks and priority sorting (Urgent, High, Medium, Low).
   - Upcoming vs. Completed tracking with date validation.

2. **Subject & Syllabus Manager:**
   - Add university subjects with color tags and credits.
   - Break courses into units, chapters, and topics with difficulty labels (`easy`, `medium`, `hard`).
   - Track revision counts and real-time syllabus completion percentage bars.

3. **Smart Study Planner & Pomodoro Timer:**
   - Daily study schedule and study tasks linked to specific syllabus topics.
   - Interactive 25/5/15 Pomodoro study timer with Web Audio API chime synthesis.
   - Ergonomic and optical rest prompts (20-20-20 rule, stretches, hydration).
   - Milestone confetti celebrations upon task completion.

4. **Biological Wellness Trackers:**
   - **Meal Tracker:** Breakfast, Lunch, Snacks, and Dinner logging with completion meters and habit consistency charts.
   - **Hydration Tracker:** Configurable daily target (default 2,500 ml), 1-click quick-add buttons (+150ml, +250ml, +500ml), custom ml entry, animated water wave progress, and editable logs.
   - **Sleep Tracker:** Overnight sleep duration calculation handling midnight crossover, sleep quality ratings (`good`, `fair`, `poor`), and weekly sleep duration visualizations.

5. **Explainable Daily Wellness Score (0 to 100):**
   - Transparent, explainable weighted formula:
     - **Study Progress:** 30%
     - **Meals:** 25%
     - **Hydration:** 20%
     - **Sleep:** 25%
   - Honest missing data handling (ongoing midday sleep is not penalized as 0% failure).
   - Full explainability breakdown modal for student transparency.

6. **Google Gemini AI Assistant:**
   - Secure Node.js backend integration with zero exposure of API keys to the browser.
   - Context-aware daily exam survival plans and time-block recommendations.
   - Interactive chat assistant for study strategies, active recall, and stress mitigation.
   - Safe heuristic fallback engine ensures 100% functionality even when offline or before API key setup.

7. **Reminder Center:**
   - Configurable alarms for water, meals, breaks, study sessions, and bedtime curfews.
   - Web Notification API integration with in-app banner fallback.
   - Transparent explanation of mobile browser background limitations.

8. **Analytics Dashboard:**
   - Interactive Recharts visualizations for study hours, meal consistency, hydration vs. target, sleep duration, and overall wellness index over 7, 14, and 30-day windows.

9. **Progressive Web App (PWA) & Capacitor Android:**
   - Standalone display mode, manifest, and service worker shell caching.
   - Capacitor Android configuration (`capacitor.config.json`) ready for native compilation.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, JavaScript, Tailwind CSS |
| **Icons & Charts** | Lucide React, Recharts |
| **Routing** | React Router v6 |
| **Animation** | Canvas Confetti, Tailwind Animations |
| **Backend** | Node.js, Express, Helmet, Morgan, Express-Rate-Limit |
| **Validation** | Zod |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth with Row Level Security (RLS) |
| **AI Integration** | Google Gemini API (`@google/generative-ai` with safe heuristic fallback) |
| **Testing** | Vitest, React Testing Library, Supertest |
| **Mobile & PWA** | Progressive Web App (Service Worker + Manifest), Capacitor |
| **Deployment** | Vercel (Frontend), Render (Backend API) |

---

## 📂 Project Architecture

```
ExamWeekWithoutTheCrash/
├── frontend/                     # React 18 + Vite frontend
│   ├── public/                   # PWA manifest, service worker (sw.js), icons, logo.svg
│   ├── src/
│   │   ├── components/           # Reusable UI library (modals, skeletons, toast, confirmation)
│   │   ├── context/              # AuthContext, WellnessContext, NotificationContext
│   │   ├── layouts/              # MainLayout (Sidebar + BottomNav), AuthLayout, ProtectedRoute
│   │   ├── pages/                # LandingPage, Dashboard, Exams, Syllabus, Study, Wellness, AI, Analytics, Settings
│   │   ├── services/             # supabaseClient, apiService, storageService (offline-first sync)
│   │   ├── utils/                # scoreEngine, validators
│   │   ├── App.jsx               # Client router
│   │   └── main.jsx              # React DOM entry + PWA registration
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── controllers/          # dashboard, ai, exams, wellness, reminders
│   │   ├── middleware/           # auth verification, rate limiting, zod validation, error handler
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # geminiService, wellnessScoreService, studyPlannerService
│   │   ├── utils/                # responseFormatter
│   │   ├── server.js             # Express application entry
│   │   └── server.test.js        # Vitest backend API tests
│   └── package.json
├── supabase/
│   └── migrations/               # PostgreSQL schema with 12 tables, indexes, RLS & triggers
│       └── 20261030000000_init_schema.sql
├── capacitor.config.json         # Capacitor Android project config
└── README.md
```

---

## 🗄️ Database Architecture & Migrations

The database migration located at `supabase/migrations/20261030000000_init_schema.sql` establishes:
1. `profiles`: Student details, university, semester, daily water/sleep goals.
2. `subjects`: Semester courses, color codes, credits.
3. `syllabus_topics`: Chapters, topics, difficulty (`easy`, `medium`, `hard`), revision counts.
4. `exams`: MTT and ETT examinations, exam date/time, priorities, venues.
5. `study_tasks`: Revision tasks linked with subjects and topics.
6. `study_sessions`: Pomodoro intervals and focus session logs.
7. `meals`: Daily meal slots (breakfast, lunch, snacks, dinner).
8. `water_logs`: Individual water intake entries with timestamps.
9. `sleep_logs`: Bedtime and wake-up times, overnight duration, sleep quality ratings.
10. `reminders`: Configurable notifications and alarm schedules.
11. `daily_scores`: Persisted explainable daily wellness scores.
12. `notification_preferences`: Student notification toggles.

### Row Level Security (RLS):
Every table enforces PostgreSQL Row Level Security. Users can strictly only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` records matching their authenticated `auth.uid() = user_id`.

---

## ⚙️ Environment Variables

### 1. Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Credentials (optional for guest evaluation, required for live cloud sync)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API (optional: smart heuristic fallback active if omitted)
GEMINI_API_KEY=your-gemini-api-key

# Allows evaluation without mandatory cloud configuration
ALLOW_GUEST_MODE=true
```

### 2. Frontend (`frontend/.env`)
```ini
VITE_API_URL=/api
# Optional live Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🏃 Running the Application Locally

### Prerequisites:
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Install Dependencies
```bash
# In the project root:
cd frontend && npm install
cd ../backend && npm install
```

### Step 2: Start Backend Server
```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

### Step 3: Start Frontend Dev Server
```bash
cd frontend
npm run dev
# Frontend running at http://localhost:5173
```

*(Note: The Vite development server automatically proxies `/api` requests to `http://localhost:5000`)*.

---

## 🧪 Running Automated Tests

### 1. Run Backend API Tests
```bash
cd backend
npm test
```
*Tests cover: Health endpoint, Explainable Wellness Score calculation (30/25/20/25 weights), ongoing day handling, and dashboard summary.*

### 2. Run Frontend Tests
```bash
cd frontend
npm test
```
*Tests cover: Landing page render, client-side score engine, and honest awaiting status handling.*

---

## 📱 Android & Progressive Web App (PWA)

### Progressive Web App (PWA)
1. Open the application in Google Chrome or mobile browser.
2. Click **Install App** in the browser URL bar or from the menu.
3. The app opens in standalone window mode with app shell caching provided by `sw.js`.

### Capacitor Android Build Steps:
1. Build the production web bundle:
   ```bash
   cd frontend && npm run build
   ```
2. Initialize Capacitor Android (if not already added):
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   ```
3. Sync web assets:
   ```bash
   npx cap sync
   ```
4. Open the native project in Android Studio:
   ```bash
   npx cap open android
   ```
5. In Android Studio:
   - Click **Build** -> **Generate Signed Bundle / APK**.
   - Select **APK**, create/provide your keystore, and build release APK.

*(Honesty Notice: No APK file is generated in the repository by default; the project is fully structured and pre-configured for Android compilation via Android Studio).*

---

## 🌐 Production Deployment

### Frontend (Vercel):
1. Connect your GitHub repository to Vercel.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. The included `vercel.json` ensures client-side routing fallback and API proxying.

### Backend (Render):
1. Create a **New Web Service** on Render pointing to `backend`.
2. Environment: `Node`.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Set environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, etc.).

---

## ⚖️ Safety & Ethical Disclaimers

1. **Habit Consistency Only:** ExamWeekWithoutTheCrash is a motivational habit-tracking and productivity companion. It does not provide medical diagnoses, clinical nutrition prescriptions, or academic grade guarantees.
2. **Anti-Cramming Guardrails:** The platform and AI assistant strictly discourage all-nighters and starvation routines, reinforcing proven cognitive science that 7+ hours of sleep and consistent hydration are essential for peak memory retrieval during examination week.

