import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { CircleCheck as CheckCircle, X, Info, CircleAlert as AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const toastConfig: Record<ToastType, { icon: typeof CheckCircle; color: string; bg: string; border: string }> = {
  success: { icon: CheckCircle, color: 'text-lime-400', bg: 'bg-lime-400/[0.06]', border: 'border-lime-400/15' },
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/[0.06]', border: 'border-red-400/15' },
  info: { icon: Info, color: 'text-sky-400', bg: 'bg-sky-400/[0.06]', border: 'border-sky-400/15' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), 2800);
    const removeTimer = setTimeout(onDismiss, 3100);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onDismiss]);

  const cfg = toastConfig[toast.type];
  const Icon = cfg.icon;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl glass-strong border ${cfg.border} shadow-2xl transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      role="alert"
    >
      <span className={cfg.color}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="text-sm text-navy-100 font-medium">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 w-6 h-6 rounded-lg flex items-center justify-center text-navy-400 hover:text-navy-100 hover:bg-white/[0.05] transition-all flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
