import React, { useState } from 'react';
import {
  Building,
  Stethoscope,
  Pill,
  FlaskConical,
  Syringe,
  Scissors,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatDate } from '../utils';

interface TimelineEventProps {
  type: 'Hospital Visit' | 'Diagnosis' | 'Prescription' | 'Lab Report' | 'Vaccination' | 'Surgery';
  date: string;
  title: string;
  description: string;
  hospital?: string;
  doctor?: string;
  details?: Record<string, unknown>;
}

const typeIcons = {
  'Hospital Visit': Building,
  Diagnosis: Stethoscope,
  Prescription: Pill,
  'Lab Report': FlaskConical,
  Vaccination: Syringe,
  Surgery: Scissors,
};

const typeColors = {
  'Hospital Visit': 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  Diagnosis: 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  Prescription: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Lab Report': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Vaccination: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Surgery: 'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400',
};

export function TimelineEvent({
  type,
  date,
  title,
  description,
  hospital,
  doctor,
  details,
}: TimelineEventProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = typeIcons[type];

  return (
    <div className="relative flex gap-4 group">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColors[type]} transition-transform duration-200 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="glass-card-solid p-4 transition-all duration-200 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{formatDate(date)}</p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {type}
            </span>
          </div>

          {(hospital || doctor) && (
            <div className="flex gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              {hospital && <span>Hospital: {hospital}</span>}
              {doctor && <span>Doctor: {doctor}</span>}
            </div>
          )}

          {details && Object.keys(details).length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 mt-3 hover:underline"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Show details
                </>
              )}
            </button>
          )}

          {isExpanded && details && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{key}:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
