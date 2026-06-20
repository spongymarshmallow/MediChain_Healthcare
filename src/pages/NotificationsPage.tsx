import React, { useState } from 'react';
import { Bell, CheckCheck, Filter, Trash2 } from 'lucide-react';
import { NotificationItem } from '../components';
import { useNotificationStore, useAuthStore } from '../store';
import { notifications } from '../data';

export function NotificationsPage() {
  const { role } = useAuthStore();
  const { markAsRead, markAllAsRead } = useNotificationStore();
  const [filterType, setFilterType] = useState<string>('all');

  // Get user ID based on role for demo
  const userId = role === 'patient' ? 'pat-001' : role === 'doctor' ? 'doc-001' : 'hosp-001';

  // Merge initial notifications with store
  const allNotifications = notifications.filter(n => n.userId === userId);
  const unreadCount = allNotifications.filter(n => !n.read).length;

  const filteredNotifications = filterType === 'all'
    ? allNotifications
    : allNotifications.filter(n => n.type === filterType);

  const notificationTypes = [
    'All',
    'Consent Request',
    'Report Uploaded',
    'Prescription Created',
    'Emergency Access',
    'Insurance Claim',
    'Vaccination Reminder',
    'Medication Reminder',
    'Counterfeit Alert',
    'Health Pattern Insight',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => markAllAsRead(userId)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card-solid p-4 flex items-center gap-2 overflow-x-auto">
        <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
        {notificationTypes.slice(0, 7).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type === 'All' ? 'all' : type)}
            className={`px-3 py-1 text-sm rounded-lg whitespace-nowrap transition-colors ${
              (filterType === 'all' && type === 'All') || filterType === type
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              {...notification}
              onMarkAsRead={markAsRead}
            />
          ))
        ) : (
          <div className="glass-card-solid p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
