import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Bell,
  Settings,
  Sun,
  Moon,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { useNotificationContext } from '../context/NotificationContext';

const roleLabels: Record<string, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  hospital: 'Hospital Admin',
  pharmacy: 'Pharmacy',
  government: 'Government',
  insurance: 'Insurance',
};

const roleColors: Record<string, string> = {
  patient: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  doctor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  hospital: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  pharmacy: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
  government: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  insurance: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
};

export function Navbar() {
  const { role, isDarkMode, toggleDarkMode, logout } = useAuthStore();
  const { unreadCount } = useNotificationContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card-solid border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`/${role || ''}`} className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <Heart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">MediChain</span>
              <span className="hidden sm:inline-block text-xs text-gray-500 dark:text-gray-400 ml-2">
                One Patient. One Identity.
              </span>
            </div>
          </Link>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Demo mode badge */}
            <span className="hidden sm:block text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              <Shield className="w-3 h-3 inline mr-1" />
              Demo Mode
            </span>

            {/* Role badge */}
            {role && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${roleColors[role]}`}>
                {roleLabels[role]}
              </span>
            )}

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                document.documentElement.classList.toggle('dark');
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>

            {/* Logout */}
            {role && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-danger-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
