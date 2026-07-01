import React, { createContext, useContext } from 'react';
import { useNotifications, type NotificationRow } from '../hooks/useNotifications';

interface NotificationContextValue {
  notifications: NotificationRow[];
  loading: boolean;
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  userId: string | null;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  loading: true,
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  userId: null,
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const value = useNotifications();
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
