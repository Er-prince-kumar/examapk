import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [hasBrowserSupport, setHasBrowserSupport] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasBrowserSupport(true);
      setPermission(Notification.permission);
    }
  }, []);

  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const requestBrowserPermission = async () => {
    if (!hasBrowserSupport) {
      addToast({
        title: 'Notifications Unavailable',
        message: 'Your browser or device environment does not support web push notifications.',
        type: 'warning'
      });
      return false;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        addToast({
          title: 'Notifications Enabled',
          message: 'You will receive study breaks, water prompts, and exam reminders.',
          type: 'success'
        });
        return true;
      } else {
        addToast({
          title: 'Permission Denied',
          message: 'Browser notifications were denied. In-app toasts will still remind you.',
          type: 'info'
        });
        return false;
      }
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return false;
    }
  };

  const triggerNotification = (title, options = {}) => {
    // 1. In-app toast always displays
    addToast({
      title,
      message: options.body || '',
      type: options.type || 'info'
    });

    // 2. Browser system notification if granted
    if (hasBrowserSupport && permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/logo.svg',
          badge: '/logo.svg',
          ...options
        });
      } catch (err) {
        console.warn('Browser notification trigger failed:', err);
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        hasBrowserSupport,
        permission,
        requestBrowserPermission,
        triggerNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
