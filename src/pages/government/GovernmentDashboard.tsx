import React from 'react';
import { Landmark, Users, Syringe, AlertTriangle, Building, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { patients, vaccinations, diseaseAlerts } from '../../data';
import { StatCard } from '../../components';

export function GovernmentDashboard() {
  const activeAlerts = diseaseAlerts.filter(d => d.trend === 'Rising' || d.cases > 500);

  const diseaseDistribution = [
    { name: 'Dengue', cases: 1256 },
    { name: 'Malaria', cases: 2145 },
    { name: 'Chikungunya', cases: 834 },
    { name: 'Typhoid', cases: 1892 },
    { name: 'Swine Flu', cases: 428 },
    { name: 'TB', cases: 3421 },
  ];

  const vaccinationCoverage = [
    { month: 'Jan', coverage: 78 },
    { month: 'Feb', coverage: 81 },
    { month: 'Mar', coverage: 79 },
    { month: 'Apr', coverage: 83 },
    { month: 'May', coverage: 85 },
    { month: 'Jun', coverage: 87 },
  ];

  const regionalData = [
    { region: 'North', patients: 4521, hospitals: 124 },
    { region: 'South', patients: 5234, hospitals: 156 },
    { region: 'East', patients: 3120, hospitals: 89 },
    { region: 'West', patients: 4789, hospitals: 132 },
    { region: 'Central', patients: 2890, hospitals: 78 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Government Health Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">National Health Mission - Real-time Monitoring</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Registered Patients"
          value="4,55,230"
          trend="up"
          change={12}
          iconColor="text-primary-500 bg-primary-100"
        />
        <StatCard
          icon={<Syringe className="w-5 h-5" />}
          label="Vaccinations"
          value="12.5M"
          trend="up"
          change={8}
          iconColor="text-emerald-500 bg-emerald-100"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Active Alerts"
          value={activeAlerts.length}
          iconColor="text-danger-500 bg-danger-100"
        />
        <StatCard
          icon={<Building className="w-5 h-5" />}
          label="Hospitals Connected"
          value={regionalData.reduce((a, b) => a + b.hospitals, 0)}
          trend="up"
          change={5}
          iconColor="text-warning-500 bg-warning-100"
        />
      </div>

      {/* Disease Distribution */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          Disease Distribution (Nationwide)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={diseaseDistribution} layout="vertical">
            <XAxis type="number" stroke="#9ca3af" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={80} />
            <Tooltip />
            <Bar dataKey="cases" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Vaccination Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card-solid p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Vaccination Coverage Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={vaccinationCoverage}>
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis domain={[70, 100]} stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="coverage" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card-solid p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Regional Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionalData}>
              <XAxis dataKey="region" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="patients" fill="#8B5CF6" name="Patients" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Outbreak Monitoring */}
      <div className="glass-card-solid p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger-500" />
          Outbreak Monitoring
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Disease</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Region</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Cases</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Trend</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {diseaseAlerts.map(alert => (
                <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{alert.disease}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{alert.region}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${alert.cases > 1000 ? 'text-danger-600' : 'text-warning-600'}`}>
                      {alert.cases.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 ${
                      alert.trend === 'Rising' ? 'text-danger-500' :
                      alert.trend === 'Declining' ? 'text-emerald-500' : 'text-warning-500'
                    }`}>
                      {alert.trend === 'Rising' && <TrendingUp className="w-4 h-4" />}
                      {alert.trend === 'Declining' && <TrendingDown className="w-4 h-4" />}
                      {alert.trend === 'Stable' && <Activity className="w-4 h-4" />}
                      {alert.trend}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{alert.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
