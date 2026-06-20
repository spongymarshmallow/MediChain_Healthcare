import React from 'react';

interface SkeletonCardProps {
  lines?: number;
  hasIcon?: boolean;
}

export function SkeletonCard({ lines = 3, hasIcon = true }: SkeletonCardProps) {
  return (
    <div className="glass-card-solid p-5 animate-pulse">
      {hasIcon && (
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex gap-4 mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"
              style={{ width: `${100 - colIndex * 10}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonText({ className = '' }: { className?: string }) {
  return <div className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />;
}
