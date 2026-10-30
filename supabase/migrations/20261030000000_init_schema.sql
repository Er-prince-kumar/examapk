-- ExamWeekWithoutTheCrash - Core Database Schema
-- Supabase PostgreSQL Migration

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    university TEXT DEFAULT 'LPU',
    branch TEXT DEFAULT 'CSE',
    current_semester INTEGER DEFAULT 5,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    daily_water_goal_ml INTEGER DEFAULT 2500,
    daily_sleep_goal_hours NUMERIC(3,1) DEFAULT 7.5,
    pomodoro_work_minutes INTEGER DEFAULT 25,
    pomodoro_break_minutes INTEGER DEFAULT 5,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#06b6d4',
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SYLLABUS TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.syllabus_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter_name TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    revision_count INTEGER DEFAULT 0,
    estimated_minutes INTEGER DEFAULT 45,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXAMS TABLE (MTT and ETT)
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    exam_type TEXT NOT NULL CHECK (exam_type IN ('MTT', 'ETT', 'Quiz', 'Lab', 'Assignment')),
    exam_date DATE NOT NULL,
    exam_time TIME NOT NULL,
    venue TEXT,
    priority TEXT NOT NULL DEFAULT 'high' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDY TASKS TABLE
CREATE TABLE IF NOT EXISTS public.study_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.syllabus_topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    target_date DATE NOT NULL DEFAULT CURRENT_DATE,
    estimated_minutes INTEGER NOT NULL DEFAULT 45,
    actual_minutes INTEGER DEFAULT 0,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STUDY SESSIONS TABLE (Pomodoro / Focus time tracking)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.study_tasks(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    duration_minutes INTEGER NOT NULL,
    session_type TEXT NOT NULL DEFAULT 'pomodoro' CHECK (session_type IN ('pomodoro', 'short_break', 'long_break', 'free_study')),
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MEALS TABLE
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_time TIME NOT NULL,
    is_completed BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_meal_per_day UNIQUE (user_id, log_date, meal_type)
);

-- 9. WATER LOGS TABLE
CREATE TABLE IF NOT EXISTS public.water_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SLEEP LOGS TABLE
CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bedtime TIMESTAMPTZ NOT NULL,
    wake_time TIMESTAMPTZ NOT NULL,
    duration_hours NUMERIC(4,2) NOT NULL,
    quality TEXT DEFAULT 'good' CHECK (quality IN ('poor', 'fair', 'good', 'excellent')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_sleep_per_date UNIQUE (user_id, sleep_date)
);

-- 11. REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('water', 'meal', 'study', 'sleep', 'exam', 'break')),
    title TEXT NOT NULL,
    reminder_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekdays', 'hourly', 'once')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DAILY SCORES TABLE (Explainable Wellness Score)
CREATE TABLE IF NOT EXISTS public.daily_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score_date DATE NOT NULL DEFAULT CURRENT_DATE,
    overall_score NUMERIC(5,2) NOT NULL,
    study_score NUMERIC(5,2) NOT NULL,
    meal_score NUMERIC(5,2) NOT NULL,
    water_score NUMERIC(5,2) NOT NULL,
    sleep_score NUMERIC(5,2) NOT NULL,
    weights_json JSONB DEFAULT '{"study": 0.30, "meals": 0.25, "hydration": 0.20, "sleep": 0.25}'::jsonb,
    breakdown_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_daily_score UNIQUE (user_id, score_date)
);

-- 13. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    browser_notifications_enabled BOOLEAN DEFAULT FALSE,
    water_reminder_enabled BOOLEAN DEFAULT TRUE,
    water_interval_minutes INTEGER DEFAULT 60,
    meal_reminders_enabled BOOLEAN DEFAULT TRUE,
    study_break_reminders_enabled BOOLEAN DEFAULT TRUE,
    bedtime_reminder_enabled BOOLEAN DEFAULT TRUE,
    bedtime_reminder_time TIME DEFAULT '22:30:00',
    exam_countdown_alert_days INTEGER DEFAULT 3,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_subjects_user ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_user_subject ON public.syllabus_topics(user_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_user_date ON public.exams(user_id, exam_date);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user_date ON public.study_tasks(user_id, target_date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_water_user_date ON public.water_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_sleep_user_date ON public.sleep_logs(user_id, sleep_date);
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_date ON public.daily_scores(user_id, score_date);

-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- CREATE RLS POLICIES (Users can only access their own records)

-- Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subjects
CREATE POLICY "Users can CRUD their own subjects" ON public.subjects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Syllabus Topics
CREATE POLICY "Users can CRUD their own syllabus topics" ON public.syllabus_topics FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Exams
CREATE POLICY "Users can CRUD their own exams" ON public.exams FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Study Tasks
CREATE POLICY "Users can CRUD their own study tasks" ON public.study_tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Study Sessions
CREATE POLICY "Users can CRUD their own study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Meals
CREATE POLICY "Users can CRUD their own meals" ON public.meals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Water Logs
CREATE POLICY "Users can CRUD their own water logs" ON public.water_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sleep Logs
CREATE POLICY "Users can CRUD their own sleep logs" ON public.sleep_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reminders
CREATE POLICY "Users can CRUD their own reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Daily Scores
CREATE POLICY "Users can CRUD their own daily scores" ON public.daily_scores FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notification Preferences
CREATE POLICY "Users can CRUD their own notification prefs" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- TRIGGER FOR NEW USER CREATION (Auto-create profile and notification preferences)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'));
    
    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
