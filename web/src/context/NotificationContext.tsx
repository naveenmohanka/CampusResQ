import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'critical';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 5000 }: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <NotificationContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Render Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => {
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-xl transition-all transform animate-in slide-in-from-bottom-5 ${
                toast.type === 'critical'
                  ? 'bg-red-950/90 border-red-500/60 text-red-100 shadow-glow-red'
                  : toast.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/50 text-rose-100'
                  : toast.type === 'warning'
                  ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                  : toast.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                  : 'bg-slate-900/90 border-slate-700 text-slate-100'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {toast.type === 'critical' && <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />}
                {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs mt-1 text-slate-300 leading-relaxed break-words">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
