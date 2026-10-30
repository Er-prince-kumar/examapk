import React from 'react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-slate-200 rounded-2xl my-4">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h4 className="text-base font-semibold text-slate-800">{title}</h4>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-5">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
