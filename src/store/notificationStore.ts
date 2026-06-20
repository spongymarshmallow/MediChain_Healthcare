import { create } from 'zustand';
import type { Notification } from '../types';
import { notifications as initialNotifications } from '../data';
import { generateId } from '../utils';

interface NotificationState {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  clearNotification: (id: string) => void;
  getUnreadCount: (userId: string) => number;
  getNotificationsByUser: (userId: string) => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllAsRead: (userId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.userId === userId ? { ...n, read: true } : n
      ),
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: generateId('notif') },
        ...state.notifications,
      ],
    })),
  clearNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  getUnreadCount: (userId) =>
    get().notifications.filter((n) => n.userId === userId && !n.read).length,
  getNotificationsByUser: (userId) =>
    get()
      .notifications.filter((n) => n.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
}));
