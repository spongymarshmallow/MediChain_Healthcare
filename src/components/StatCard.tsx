import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  iconColor?: string;
}

export function StatCard({ icon, label, value, change, trend, iconColor = 'text-primary-600' }: StatCardProps) {
  const trendIcon =
    trend === 'up' ? (
      <ArrowUp className="w-4 h-4 text-emerald-500" />
    ) : trend === 'down' ? (
      <ArrowDown className="w-4 h-4 text-danger-500" />
    ) : (
      <Minus className="w-4 h-4 text-gray-400" />
    );

  const trendColor =
    trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-danger-500' : 'text-gray-400';

  return (
    <div className="glass-card-solid p-5 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className={`${iconColor} p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>{icon}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            {trendIcon}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
