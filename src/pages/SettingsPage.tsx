import React from 'react';
import { useAuthStore } from '../store';
import { Settings, Shield, Lock, Download, Trash2, Monitor } from 'lucide-react';

export function SettingsPage() {
  const { role } = useAuthStore();
  const isPatient = role === 'patient';

  const handleDownloadData = () => {
    const data = {
      healthRecords: 'Mock health records data',
      prescriptions: 'Mock prescriptions data',
      labReports: 'Mock lab reports data',
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medichain-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isPatient
            ? 'Manage your account and security preferences'
            : 'Manage your privacy and security preferences'}
        </p>
      </div>

      {/* Security */}
      <div className="glass-card-solid p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Multi-Factor Authentication</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add extra security to your account</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">Coming soon</span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="font-medium text-gray-900 dark:text-white mb-2">Active Sessions</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Session</span>
                </div>
                <span className="text-xs text-emerald-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="glass-card-solid p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h2>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleDownloadData}
            className="w-full flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <Download className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <div className="text-left">
              <p className="font-medium text-primary-800 dark:text-primary-300">Download My Records</p>
              <p className="text-sm text-primary-600 dark:text-primary-400">Get a copy of all your health data</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 p-3 bg-danger-50 dark:bg-danger-900/20 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors">
            <Trash2 className="w-5 h-5 text-danger-600 dark:text-danger-400" />
            <div className="text-left">
              <p className="font-medium text-danger-800 dark:text-danger-300">Delete Account</p>
              <p className="text-sm text-danger-600 dark:text-danger-400">Permanently delete your account and data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
