import React, { useState } from 'react';
import { Activity, TrendingUp, Zap, BarChart2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useCurrentUser, useHealthLogs, addHealthLog } from '../../hooks/usePatientData';
import { SkeletonCard } from '../../components';
import { calculateImmunityScore } from '../../utils/riskScorer';
import type { SymptomType } from '../../types';

const symptoms: SymptomType[] = [
  'Cold', 'Cough', 'Fever', 'Allergy', 'Headache',
  'Stomach Infection', 'Seasonal Illness', 'Fatigue', 'Weakness', 'Other',
];
const severityOptions = ['Mild', 'Moderate', 'Severe'] as const;

const COLORS = [
  '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#84CC16', '#6366F1',
];

const SYMPTOM_BASE: Record<SymptomType, number> = {
  Cold: 0, Cough: 0, Fever: 0, Allergy: 0, Headache: 0,
  'Stomach Infection': 0, 'Seasonal Illness': 0, Fatigue: 0, Weakness: 0, Other: 0,
};

const severityLabel = (v: number) =>
  v < 1.5 ? 'Low' : v < 2.5 ? 'Moderate' : 'High';

export function HealthTracker() {
  const { profile, loading: authLoading } = useCurrentUser();
  const healthId = profile?.health_id ?? null;
  const { logs: allLogs, loading: logsLoading } = useHealthLogs(healthId);

  const [symptom, setSymptom] = useState<SymptomType>('Cold');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [duration, setDuration] = useState(3);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loading = authLoading || logsLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthId) return;
    setSubmitting(true);
    await addHealthLog(healthId, { symptom, severity, duration, date });
    setSymptom('Cold');
    setSeverity('Mild');
    setDuration(3);
    setDate(new Date().toISOString().split('T')[0]);
    setSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const currentYear = new Date().getFullYear().toString();
  const currentYearLogs = allLogs.filter((l: any) => l.date?.startsWith(currentYear));

  const symptomCounts: Record<SymptomType, number> = { ...SYMPTOM_BASE };
  currentYearLogs.forEach((l: any) => {
    if (l.symptom in symptomCounts) symptomCounts[l.symptom as SymptomType]++;
  });

  const mostFrequent = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];

  const avgSeverityVal =
    currentYearLogs.length > 0
      ? currentYearLogs.reduce(
          (acc: number, l: any) =>
            acc + (l.severity === 'Mild' ? 1 : l.severity === 'Moderate' ? 2 : 3),
          0
        ) / currentYearLogs.length
      : 0;

  const immunityScore = calculateImmunityScore(allLogs);

  // Monthly distribution (all-time, current year month buckets)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = months.map((month, i) => ({
    month,
    count: currentYearLogs.filter((l: any) => new Date(l.date).getMonth() === i).length,
  }));

  const symptomPieData = Object.entries(symptomCounts)
    .filter(([, count]) => count > 0)
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));

  // Recent entries (last 5)
  const recentLogs = allLogs.slice(0, 5);

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
          Log symptoms and monitor your health in real time
        </p>
      </div>

      {/* Log form */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          Log Health Episode
        </h2>

        {submitSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg text-emerald-700 dark:text-emerald-400 text-sm">
            Episode logged successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Symptom</label>
            <select
              value={symptom}
              onChange={(e) => setSymptom(e.target.value as SymptomType)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            >
              {symptoms.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity</label>
            <div className="flex gap-1">
              {severityOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                    severity === s
                      ? s === 'Mild'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : s === 'Moderate'
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
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
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {submitting ? 'Saving...' : 'Log Episode'}
            </button>
          </div>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <BarChart2 className="w-4 h-4" />
            <span className="text-xs">Episodes ({currentYear})</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentYearLogs.length}</p>
        </div>

        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Most Frequent</span>
          </div>
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400 leading-tight">
            {mostFrequent?.[1] > 0 ? mostFrequent[0] : 'None'}
          </p>
        </div>

        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs">Avg Severity</span>
          </div>
          <p className={`text-xl font-bold ${
            avgSeverityVal < 1.5 ? 'text-emerald-500' : avgSeverityVal < 2.5 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {currentYearLogs.length > 0 ? severityLabel(avgSeverityVal) : 'N/A'}
          </p>
        </div>

        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs">Immunity Score</span>
          </div>
          <p className={`text-3xl font-bold ${
            immunityScore >= 70 ? 'text-emerald-500' : immunityScore >= 40 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {Math.round(immunityScore)}
            <span className="text-base font-normal text-gray-400 ml-0.5">%</span>
          </p>
        </div>
      </div>

      {/* Charts */}
      {allLogs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card-solid p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Episodes ({currentYear})</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card-solid p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Symptom Breakdown</h3>
            {symptomPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={symptomPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={false}
                  >
                    {symptomPieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 text-center">No episodes this year yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Recent logs */}
      {recentLogs.length > 0 && (
        <div className="glass-card-solid p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Recent Entries</h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{log.symptom}</span>
                  <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">{log.duration} day{log.duration !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    log.severity === 'Mild' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : log.severity === 'Moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {log.severity}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {allLogs.length === 0 && (
        <div className="glass-card-solid p-10 text-center">
          <Activity className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No episodes logged yet. Use the form above to start tracking.</p>
        </div>
      )}
    </div>
  );
}
