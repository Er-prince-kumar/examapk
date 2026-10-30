import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-md mt-2 mb-8">
        The study path you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/app"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-glow-cyan hover:bg-cyan-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

