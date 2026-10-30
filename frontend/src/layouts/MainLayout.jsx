import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar.jsx';
import { BottomNav } from '../components/common/BottomNav.jsx';
import { Navbar } from '../components/common/Navbar.jsx';
import { ToastContainer } from '../components/common/ToastContainer.jsx';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-900">
      <ToastContainer />
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
