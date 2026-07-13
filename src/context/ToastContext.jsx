import { createContext, useCallback, useContext, useState } from 'react';
import NotificationToast from '@/components/NotificationToast/NotificationToast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast) => {
      const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current, { id, type: 'info', ...toast }]);
      setTimeout(() => dismiss(id), toast.duration || 4200);
    },
    [dismiss],
  );

  const api = {
    push,
    success: (message, opts) => push({ type: 'success', message, ...opts }),
    error: (message, opts) => push({ type: 'error', message, ...opts }),
    info: (message, opts) => push({ type: 'info', message, ...opts }),
    warning: (message, opts) => push({ type: 'warning', message, ...opts }),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <NotificationToast toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
