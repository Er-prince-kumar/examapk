import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { WellnessProvider } from './context/WellnessContext.jsx';

import { MainLayout } from './layouts/MainLayout.jsx';
import { AuthLayout } from './layouts/AuthLayout.jsx';
import { ProtectedRoute } from './layouts/ProtectedRoute.jsx';

import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ExamsPage } from './pages/ExamsPage.jsx';
import { SyllabusPage } from './pages/SyllabusPage.jsx';
import { StudyPlannerPage } from './pages/StudyPlannerPage.jsx';
import { WellnessPage } from './pages/WellnessPage.jsx';
import { AiAssistantPage } from './pages/AiAssistantPage.jsx';
import { AnalyticsPage } from './pages/AnalyticsPage.jsx';
import { RemindersPage } from './pages/RemindersPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <WellnessProvider>
            <Routes>
              {/* Public Landing */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Protected Student Platform */}
              <Route path="/app" element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="exams" element={<ExamsPage />} />
                  <Route path="syllabus" element={<SyllabusPage />} />
                  <Route path="study" element={<StudyPlannerPage />} />
                  <Route path="wellness" element={<WellnessPage />} />
                  <Route path="ai" element={<AiAssistantPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="reminders" element={<RemindersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </WellnessProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

