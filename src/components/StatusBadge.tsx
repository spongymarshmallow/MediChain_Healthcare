import React from 'react';

type StatusType = 'Verified' | 'Suspicious' | 'Unknown' | 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Inactive';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
}

const statusStyles: Record<StatusType, string> = {
  Verified: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Suspicious: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400 border-warning-200 dark:border-warning-800',
  Unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400 border-gray-200 dark:border-gray-600',
  Pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Rejected: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400 border-danger-200 dark:border-danger-800',
  Active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400 border-gray-200 dark:border-gray-600',
};

const statusIcons: Record<StatusType, string> = {
  Verified: '✓',
  Suspicious: '⚠',
  Unknown: '?',
  Pending: '⏳',
  Approved: '✓',
  Rejected: '✕',
  Active: '●',
  Inactive: '○',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${statusStyles[status]} ${sizeClasses[size]}`}
    >
      <span className="text-xs">{statusIcons[status]}</span>
      {status}
    </span>
  );
}
