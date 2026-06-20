import React from 'react';
import { AlertTriangle, Pill, BarChart, FileWarning, TrendingUp } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { medicines } from '../../data';
import { StatCard, StatusBadge } from '../../components';
import { formatDate } from '../../utils';

export function MedicineSafety() {
  const verifiedCount = medicines.filter(m => m.verificationStatus === 'Verified').length;
  const suspiciousCount = medicines.filter(m => m.verificationStatus === 'Suspicious').length;
  const unknownCount = medicines.filter(m => m.verificationStatus === 'Unknown').length;

  const verificationTrend = [
    { month: 'Jan', verified: 850, suspicious: 22 },
    { month: 'Feb', verified: 920, suspicious: 18 },
    { month: 'Mar', verified: 880, suspicious: 25 },
    { month: 'Apr', verified: 945, suspicious: 15 },
    { month: 'May', verified: 910, suspicious: 20 },
    { month: 'Jun', verified: 980, suspicious: 12 },
  ];

  const topFlagged = [
    { medicine: 'FakeGlycomet', issue: 'Invalid batch format', count: 45, risk: 'High' },
    { medicine: 'QuickRelief Pain', issue: 'Unknown manufacturer', count: 38, risk: 'High' },
    { medicine: 'CardioGuard', issue: 'Unverified source', count: 22, risk: 'Medium' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medicine Safety Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitor medicine authenticity across the hospital
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Pill className="w-5 h-5" />} label="Total Verified" value={verifiedCount} iconColor="text-emerald-500 bg-emerald-100" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Suspicious Flagged" value={suspiciousCount} iconColor="text-warning-500 bg-warning-100" />
        <StatCard icon={<FileWarning className="w-5 h-5" />} label="Patient Reports" value="156" iconColor="text-danger-500 bg-danger-100" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Counterfeit Rate" value="2.3%" iconColor="text-primary-500 bg-primary-100" />
      </div>

      {/* Verification Trend */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-primary-500" />
          Verification Outcomes (Last 6 Months)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <RechartsBarChart data={verificationTrend}>
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip />
            <Bar dataKey="verified" fill="#10B981" name="Verified" radius={[4, 4, 0, 0]} />
            <Bar dataKey="suspicious" fill="#EF4444" name="Suspicious" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Verifications */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Verifications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Medicine</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Manufacturer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Result</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {medicines.slice(0, 10).map(med => (
                <tr key={med.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white">{med.brandName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{med.genericName}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{med.manufacturer}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(med.expiryDate)}</td>
                  <td className="px-4 py-3"><StatusBadge status={med.verificationStatus} size="sm" /></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      med.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      med.riskLevel === 'Medium' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
                      'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
                    }`}>
                      {med.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Flagged Medicines */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger-500" />
          Top Flagged Medicines
        </h2>
        <div className="space-y-3">
          {topFlagged.map((item, i) => (
            <div key={i} className="p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 dark:text-white">{item.medicine}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.risk === 'High' ? 'bg-danger-100 text-danger-700' : 'bg-warning-100 text-warning-700'
                }`}>
                  {item.risk} Risk
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.issue}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.count} incidents reported</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
