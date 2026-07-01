import React, { useState } from 'react';
import { Bell, CheckCheck, Filter, Loader2 } from 'lucide-react';
import { NotificationItem } from '../components';
import { useNotificationContext } from '../context/NotificationContext';

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

export function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotificationContext();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered =
    filterType === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filterType);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All Read
        </button>
      </div>

      {/* Filter chips */}
      <div className="glass-card-solid p-4 flex items-center gap-2 overflow-x-auto">
        <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
        {notificationTypes.map((type) => (
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

      {/* Notifications list */}
      <div className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              id={n.id}
              type={n.type}
              title={n.title}
              message={n.message}
              read={n.read}
              created_at={n.created_at}
              link={n.link}
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
