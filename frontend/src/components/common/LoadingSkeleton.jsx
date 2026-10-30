import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-3"
        >
          <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
          <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
        </div>
      ))}
    </div>
  );
};
