import React from 'react';
import { useNotification } from '../../context/NotificationContext.jsx';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-500 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-emerald-500';
      case 'warning':
        return 'border-l-4 border-l-amber-500';
      case 'error':
        return 'border-l-4 border-l-rose-500';
      default:
        return 'border-l-4 border-l-cyan-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-white rounded-xl shadow-lg border border-slate-100 p-4 transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 ${getBorderColor(toast.type)}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
