import { createContext, useContext, useState, useCallback, useEffect } from 'react';
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    
    if ('Notification' in window && Notification.permission === 'granted' && (type === 'success' || type === 'error')) {
      const n = new Notification(type === 'success' ? '✅ Success' : '❌ Error', {
        body: msg.replace(/^[^\w]+/, '').trim(),
        silent: true
      });
      setTimeout(() => n.close(), 1500);
    }

    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 1500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={
            t.type === 'error' ? { borderColor: 'rgba(239,68,68,.4)', color: '#f87171' } :
            t.type === 'success' ? { borderColor: 'rgba(16,185,129,.3)', color: '#34d399' } : {}
          }>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
