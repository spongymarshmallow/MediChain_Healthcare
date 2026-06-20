import React, { useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useCurrentUser, usePatientRecords, addHealthLog } from '../../hooks/usePatientData';
import { SkeletonCard } from '../../components';
import { calculateImmunityScore } from '../../utils/riskScorer';
import type { SymptomType } from '../../types';

const symptoms: SymptomType[] = ['Cold', 'Cough', 'Fever', 'Allergy', 'Headache', 'Stomach Infection', 'Seasonal Illness', 'Fatigue', 'Weakness', 'Other'];
const severityOptions = ['Mild', 'Moderate', 'Severe'] as const;

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#6366F1'];

export function HealthTracker() {
  const { profile, loading: authLoading } = useCurrentUser();
  const healthId = profile?.health_id || null;
  const { data, loading: dataLoading, refetch } = usePatientRecords(healthId);
  const [symptom, setSymptom] = useState<SymptomType>('Cold');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [duration, setDuration] = useState(3);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const loading = authLoading || dataLoading;
  const allLogs = data.healthLogs;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthId) return;
    setSubmitting(true);
    await addHealthLog(healthId, { symptom, severity, duration, date });
    setSymptom('Cold');
    setSeverity('Mild');
    setDuration(3);
    refetch();
    setSubmitting(false);
  };

  // Calculate stats
  const currentYear = new Date().getFullYear().toString();
  const currentYearLogs = allLogs.filter((l: any) => l.date.startsWith(currentYear));
  const lastYearLogs = allLogs.filter((l: any) => l.date.startsWith((parseInt(currentYear) - 1).toString()));

  const symptomCounts: Record<SymptomType, number> = {
    Cold: 0, Cough: 0, Fever: 0, Allergy: 0, Headache: 0,
    'Stomach Infection': 0, 'Seasonal Illness': 0, Fatigue: 0, Weakness: 0, Other: 0,
  };
  currentYearLogs.forEach((l: any) => symptomCounts[l.symptom as SymptomType]++);

  const mostFrequentSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];
  const avgSeverity = currentYearLogs.length > 0
    ? (currentYearLogs.reduce((acc: number, l: any) => acc + (l.severity === 'Mild' ? 1 : l.severity === 'Moderate' ? 2 : 3), 0) / currentYearLogs.length).toFixed(1)
    : '0';
  const immunityScore = calculateImmunityScore(allLogs);

  // Monthly data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = months.map((month, i) => {
    const monthLogs = allLogs.filter((l: any) => {
      const d = new Date(l.date);
      return d.getMonth() === i;
    });
    return { month, count: monthLogs.length };
  });

  // Symptom distribution for pie chart
  const symptomData = Object.entries(symptomCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));

  // 2-year trend
  const yearlyTrend = [
    { year: (parseInt(currentYear) - 1).toString(), episodes: lastYearLogs.length },
    { year: currentYear, episodes: currentYearLogs.length },
  ];

  // AI Insights
  const insights: string[] = [];
  if (currentYearLogs.length > 0) {
    if (symptomCounts['Cold'] + symptomCounts['Cough'] > 5) {
      insights.push(`Cold or Cough episodes reported ${symptomCounts['Cold'] + symptomCounts['Cough']} times this year -- more than average.`);
    }
    if (symptomCounts['Allergy'] > 3) {
      const allergyMonths = allLogs.filter((l: any) => l.symptom === 'Allergy').map((l: any) => new Date(l.date).getMonth());
      if (allergyMonths.includes(2) || allergyMonths.includes(3) || allergyMonths.includes(4)) {
        insights.push('Allergy episodes are most frequent in March to May, suggesting seasonal triggers.');
      }
    }
    if (symptomCounts['Fever'] > 4) {
      insights.push('Frequent fever episodes detected. Consider consulting a physician.');
    }
    if (immunityScore < 70) {
      insights.push('Consider a flu vaccine before winter to boost immunity.');
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Tracker</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track symptoms and monitor your immunity
        </p>
      </div>

      {/* Quick Entry Form */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          Log Health Episode
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptom</label>
            <select
              value={symptom}
              onChange={(e) => setSymptom(e.target.value as SymptomType)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {symptoms.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity</label>
            <div className="flex gap-2">
              {severityOptions.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    severity === s
                      ? s === 'Mild' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : s === 'Moderate' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                      : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (days)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card-solid p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Episodes ({currentYear})</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentYearLogs.length}</p>
        </div>
        <div className="glass-card-solid p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Most Frequent</p>
          <p className="text-xl font-bold text-primary-600 dark:text-primary-400">{mostFrequentSymptom?.[0] || 'N/A'}</p>
        </div>
        <div className="glass-card-solid p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Severity</p>
          <p className={`text-xl font-bold ${parseFloat(avgSeverity) > 1.5 ? 'text-warning-500' : 'text-emerald-500'}`}>
            {avgSeverity} / 3
          </p>
        </div>
        <div className="glass-card-solid p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Immunity Score</p>
          <div className="flex items-center gap-2">
            <p className={`text-3xl font-bold ${immunityScore >= 70 ? 'text-emerald-500' : immunityScore >= 40 ? 'text-warning-500' : 'text-danger-500'}`}>
              {Math.round(immunityScore)}
            </p>
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full border-4 relative" style={{
                borderColor: immunityScore >= 70 ? '#10B981' : immunityScore >= 40 ? '#F59E0B' : '#EF4444',
                borderTopColor: 'transparent',
                transform: 'rotate(-45deg)'
              }}>
                <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotate(45deg)' }}>
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {allLogs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card-solid p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Symptom Frequency</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card-solid p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Symptom Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={symptomData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {symptomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* AI Health Insights */}
      {allLogs.length > 0 && (
        <div className="glass-card-solid p-6 border-l-4 border-warning-500">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-warning-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">AI Health Insights</h3>
              {insights.length > 0 ? (
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {insights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No significant patterns detected yet. Continue tracking for personalized insights.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Yearly Trend */}
      {allLogs.length > 0 && (
        <div className="glass-card-solid p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Yearly Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={yearlyTrend}>
              <XAxis dataKey="year" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="episodes" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Empty state */}
      {allLogs.length === 0 && (
        <div className="glass-card-solid p-8 text-center">
          <Activity className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Start tracking your health by logging symptoms above.</p>
        </div>
      )}
    </div>
  );
}
