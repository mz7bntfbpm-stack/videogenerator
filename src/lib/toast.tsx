import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'info' | 'warning' | 'error';
type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextValue = {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 2500) => {
    const id = Math.random().toString(36).slice(2);
    const toast: ToastItem = { id, message, type, duration };
    setToasts((t) => [...t, toast]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            marginTop: 8,
            padding: '10px 14px',
            borderRadius: 8,
            minWidth: 240,
            background: t.type === 'success' ? '#d1fae5' : t.type === 'error' ? '#fee2e2' : t.type === 'warning' ? '#fef3c7' : '#e0f2fe',
            color: '#111827',
            boxShadow: '0 6px 16px rgba(0,0,0,.08)'
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default ToastProvider;
