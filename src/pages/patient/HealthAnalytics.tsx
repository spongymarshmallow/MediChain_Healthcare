import React from 'react';
import { BarChart, LineChart, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Line, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useCurrentUser, usePatientRecords } from '../../hooks/usePatientData';
import { SkeletonCard } from '../../components';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#06B6D4'];

export function HealthAnalytics() {
  const { profile, loading: authLoading } = useCurrentUser();
  const healthId = profile?.health_id || null;
  const { data, loading: dataLoading } = usePatientRecords(healthId);

  const loading = authLoading || dataLoading;
  const currentYear = new Date().getFullYear().toString();

  // Monthly illness data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyIllnessData = months.map((month, i) => {
    const count = data.healthLogs.filter((l: any) => {
      const d = new Date(l.date);
      return d.getMonth() === i && l.date.startsWith(currentYear);
    }).length;
    return { month, count, year: parseInt(currentYear) };
  });

  // Vaccination coverage
  const vaccinationStatus = {
    completed: data.vaccinations.filter((v: any) => !v.next_due?.includes('Due')).length,
    due: data.vaccinations.filter((v: any) => v.next_due?.includes('Due')).length,
    overdue: 0,
  };
  const vaccPieData = [
    { name: 'Completed', value: vaccinationStatus.completed, color: '#10B981' },
    { name: 'Due', value: vaccinationStatus.due, color: '#F59E0B' },
    { name: 'Overdue', value: vaccinationStatus.overdue, color: '#EF4444' },
  ];

  // Health score trend (calculated from lab reports over time)
  const labReportsByMonth = months.slice(0, 6).map((month, i) => {
    const labs = data.labReports.filter((l: any) => {
      const d = new Date(l.date);
      return d.getMonth() === i;
    });
    const normalLabs = labs.filter((l: any) => l.status === 'Normal').length;
    const score = labs.length > 0 ? Math.round((normalLabs / labs.length) * 100) : 75;
    return { month, score };
  });

  // Seasonal patterns
  const seasonalData = months.map((month, i) => ({
    month,
    cold: data.healthLogs.filter((l: any) => l.symptom === 'Cold' && new Date(l.date).getMonth() === i).length,
    allergy: data.healthLogs.filter((l: any) => l.symptom === 'Allergy' && new Date(l.date).getMonth() === i).length,
    fever: data.healthLogs.filter((l: any) => l.symptom === 'Fever' && new Date(l.date).getMonth() === i).length,
  }));

  // Health score from lab reports
  const abnormalLabs = data.labReports.filter((l: any) => l.status === 'Abnormal').length;
  const healthScore = Math.max(0, Math.min(100, 100 - (abnormalLabs * 10)));

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard lines={2} />
        <div className="grid grid-cols-2 gap-6">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
      </div>
    );
  }

  if (data.labReports.length === 0 && data.healthLogs.length === 0 && data.vaccinations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Comprehensive health insights and trends
          </p>
        </div>
        <div className="glass-card-solid p-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No health data available yet. Your analytics will appear once you have medical records or logged health episodes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Comprehensive health insights and trends
        </p>
      </div>

      {/* Health Score Trend */}
      {data.labReports.length > 0 && (
        <div className="glass-card-solid p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Health Score Trend ({currentYear})
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={labReportsByMonth}>
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis min={60} max={100} stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Illness Trend */}
        {data.healthLogs.length > 0 && (
          <div className="glass-card-solid p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Illness Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyIllnessData}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Vaccination Coverage */}
        {data.vaccinations.length > 0 && (
          <div className="glass-card-solid p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Vaccination Coverage</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vaccPieData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {vaccPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Seasonal Health Patterns */}
        {data.healthLogs.length > 0 && (
          <div className="glass-card-solid p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Seasonal Health Patterns</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={seasonalData}>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Bar dataKey="cold" stackId="a" fill="#3B82F6" name="Cold" />
                <Bar dataKey="allergy" stackId="a" fill="#8B5CF6" name="Allergy" />
                <Bar dataKey="fever" stackId="a" fill="#EF4444" name="Fever" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Lab Reports Status */}
        {data.labReports.length > 0 && (
          <div className="glass-card-solid p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Lab Reports Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'Normal', count: data.labReports.filter((l: any) => l.status === 'Normal').length, color: '#10B981' },
                { name: 'Abnormal', count: data.labReports.filter((l: any) => l.status === 'Abnormal').length, color: '#EF4444' },
              ]}>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="glass-card-solid p-6">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Health Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Health Episodes ({currentYear})</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.healthLogs.filter((l: any) => l.date.startsWith(currentYear)).length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Health Score</p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{healthScore}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Vaccinations</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {data.vaccinations.length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Lab Reports</p>
            <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
              {data.labReports.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
