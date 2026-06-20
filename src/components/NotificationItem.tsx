import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  FileText,
  Pill,
  AlertTriangle,
  Shield,
  Syringe,
  Clock,
  AlertCircle,
  Activity,
} from 'lucide-react';
import type { NotificationType } from '../types';
import { formatRelativeTime } from '../utils';

interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
  onMarkAsRead: (id: string) => void;
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  'Consent Request': Shield,
  'Report Uploaded': FileText,
  'Prescription Created': Pill,
  'Emergency Access': AlertTriangle,
  'Insurance Claim': FileText,
  'Vaccination Reminder': Syringe,
  'Medication Reminder': Clock,
  'Counterfeit Alert': AlertCircle,
  'Health Pattern Insight': Activity,
};

const notificationColors: Record<NotificationType, string> = {
  'Consent Request': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Report Uploaded': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Prescription Created': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'Emergency Access': 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400',
  'Insurance Claim': 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  'Vaccination Reminder': 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Medication Reminder': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Counterfeit Alert': 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400',
  'Health Pattern Insight': 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
};

export function NotificationItem({
  id,
  type,
  title,
  message,
  read,
  timestamp,
  link,
  onMarkAsRead,
}: NotificationItemProps) {
  const Icon = notificationIcons[type] || Bell;

  const content = (
    <div
      className={`flex gap-4 p-4 rounded-lg transition-all duration-200 ${
        read
          ? 'bg-gray-50 dark:bg-gray-800/50'
          : 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
      } hover:bg-gray-100 dark:hover:bg-gray-800/70`}
      onClick={() => !read && onMarkAsRead(id)}
    >
      <div className={`p-2 rounded-lg ${notificationColors[type]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`font-medium ${read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
            {title}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatRelativeTime(timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{message}</p>
      </div>
      {!read && (
        <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
      )}
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
