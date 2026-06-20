import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Ruler,
  Weight,
  Droplet,
  AlertTriangle,
  Phone,
  User,
  Activity,
  Calendar,
  QrCode,
  Pill,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { useCurrentUser, usePatientRecords, usePatientDetails } from '../../hooks/usePatientData';
import { SkeletonCard } from '../../components';
import { formatDate } from '../../utils';

export function PatientDashboard() {
  const { profile, loading: authLoading } = useCurrentUser();
  const healthId = profile?.health_id || null;
  const { data: patientDetails, loading: detailsLoading } = usePatientDetails(healthId);
  const { data, loading: dataLoading } = usePatientRecords(healthId);

  const healthScore = React.useMemo(() => {
    if (!data) return 0;
    const abnormalLabs = data.labReports.filter((l: any) => l.status === 'Abnormal').length;
    const recentEpisodes = data.healthLogs.filter((l: any) => {
      const d = new Date(l.date);
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return d >= yearAgo;
    }).length;
    return Math.max(0, Math.min(100, 100 - (abnormalLabs * 10) - (recentEpisodes * 2)));
  }, [data]);

  const healthScoreColor =
    healthScore >= 70 ? 'text-emerald-500' :
    healthScore >= 40 ? 'text-warning-500' : 'text-danger-500';

  const loading = authLoading || detailsLoading || dataLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard lines={2} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} lines={1} />)}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-card-solid p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const recentActivity = [
    ...data.labReports.slice(0, 2).map((l: any) => ({
      title: 'Lab Report Added',
      desc: l.test_name,
      date: l.date,
    })),
    ...data.prescriptions.slice(0, 1).map((p: any) => ({
      title: 'Prescription Created',
      desc: `${(p.medicines as any[]).length} medication(s) prescribed`,
      date: p.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Health ID: {profile.health_id}
          </p>
        </div>
        <Link
          to="/patient/qr-card"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <QrCode className="w-4 h-4" />
          View QR Card
        </Link>
      </div>

      {/* Quick info cards - Order: Age, Height, Weight, Blood Group, Personal, Emergency, Health Score */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs">Age</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {patientDetails?.age || '--'} yrs
          </p>
        </div>
        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Ruler className="w-4 h-4" />
            <span className="text-xs">Height</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {patientDetails?.height || '--'} cm
          </p>
        </div>
        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Weight className="w-4 h-4" />
            <span className="text-xs">Weight</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {patientDetails?.weight || '--'} kg
          </p>
        </div>
        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Droplet className="w-4 h-4" />
            <span className="text-xs">Blood Group</span>
          </div>
          <p className="text-xl font-bold text-danger-600 dark:text-danger-400">
            {patientDetails?.blood_group || '--'}
          </p>
        </div>
        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <User className="w-4 h-4" />
            <span className="text-xs">Personal</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {patientDetails?.personal_contact || '--'}
          </p>
        </div>
        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Phone className="w-4 h-4" />
            <span className="text-xs">Emergency</span>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {patientDetails?.emergency_contact_name || '--'}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {patientDetails?.emergency_contact || '--'}
          </p>
        </div>
        <div className="glass-card-solid p-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs">Health Score</span>
          </div>
          <p className={`text-xl font-bold ${healthScoreColor}`}>{healthScore}</p>
        </div>
      </div>

      {/* No records message for new patients */}
      {data.labReports.length === 0 && data.prescriptions.length === 0 && (
        <div className="glass-card-solid p-6 border-l-4 border-emerald-500">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to MediChain!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your health identity has been created. Your medical records will appear here once your doctor adds them during consultations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Health Snapshot */}
      {data.labReports.length > 0 && (
        <div className="glass-card-solid p-6 border-l-4 border-primary-500">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                AI Health Snapshot
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Based on your recent health records and tests, here is a summary of your current health status.
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {data.labReports.slice(0, 3).map((lab: any) => (
                  <p key={lab.id}>
                    <strong className="text-gray-900 dark:text-white">{lab.test_name}:</strong>{' '}
                    {lab.status === 'Normal' ? 'Results are within normal range.' : 'Follow-up with your doctor recommended.'}
                  </p>
                ))}
                {data.vaccinations.length > 0 && (
                  <p>
                    <strong className="text-gray-900 dark:text-white">Vaccinations:</strong>{' '}
                    {data.vaccinations.length} vaccine(s) recorded. {data.vaccinations.some((v: any) => v.next_due) ? 'Some vaccinations are due for renewal.' : 'All vaccinations are up to date.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { to: '/patient/timeline', icon: Calendar, label: 'Medical Timeline', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
            { to: '/patient/consent', icon: Shield, label: 'Consent Centre', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
            { to: '/patient/qr-card', icon: QrCode, label: 'QR Health Card', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
            { to: '/patient/verify-medicine', icon: Pill, label: 'Medicine Verifier', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400' },
            { to: '/patient/health-tracker', icon: TrendingUp, label: 'Health Tracker', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group glass-card-solid p-4 hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-2 transition-transform group-hover:scale-110`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="glass-card-solid divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activity.desc}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
