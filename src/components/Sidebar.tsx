import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  ShieldCheck,
  QrCode,
  Pill,
  Activity,
  BarChart3,
  Search,
  Stethoscope,
  FileText,
  Building2,
  Blocks,
  AlertTriangle,
  Store,
  FlaskConical,
  Landmark,
  Insurance,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const patientNavItems: NavItem[] = [
  { path: '/patient', label: 'Dashboard', icon: Home },
  { path: '/patient/timeline', label: 'Medical Timeline', icon: Calendar },
  { path: '/patient/consent', label: 'Consent Centre', icon: ShieldCheck },
  { path: '/patient/qr-card', label: 'QR Health Card', icon: QrCode },
  { path: '/patient/verify-medicine', label: 'Medicine Verifier', icon: Pill },
  { path: '/patient/health-tracker', label: 'Health Tracker', icon: Activity },
  { path: '/patient/analytics', label: 'Analytics', icon: BarChart3 },
];

const doctorNavItems: NavItem[] = [
  { path: '/doctor', label: 'Dashboard', icon: Home },
  { path: '/doctor/prescribe', label: 'Prescribe', icon: FileText },
];

const hospitalNavItems: NavItem[] = [
  { path: '/hospital', label: 'Dashboard', icon: Home },
  { path: '/hospital/admissions', label: 'Admissions', icon: Building2 },
  { path: '/hospital/blockchain', label: 'Blockchain', icon: Blocks },
  { path: '/hospital/medicine-safety', label: 'Medicine Safety', icon: AlertTriangle },
];

const pharmacyNavItems: NavItem[] = [
  { path: '/pharmacy', label: 'Dashboard', icon: Home },
  { path: '/pharmacy/verify', label: 'Verify Rx', icon: FlaskConical },
];

const governmentNavItems: NavItem[] = [
  { path: '/government', label: 'Dashboard', icon: Home },
];

const insuranceNavItems: NavItem[] = [
  { path: '/insurance', label: 'Dashboard', icon: Home },
];

const roleNavItems: Record<UserRole, NavItem[]> = {
  patient: patientNavItems,
  doctor: doctorNavItems,
  hospital: hospitalNavItems,
  pharmacy: pharmacyNavItems,
  government: governmentNavItems,
  insurance: insuranceNavItems,
};

const generalNavItems: NavItem[] = [
  { path: '/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const role = 'patient' as UserRole; // Default for demo

  // Get role from current path
  const pathname = window.location.pathname;
  let currentRole: UserRole = 'patient';
  if (pathname.startsWith('/doctor')) currentRole = 'doctor';
  else if (pathname.startsWith('/hospital')) currentRole = 'hospital';
  else if (pathname.startsWith('/pharmacy')) currentRole = 'pharmacy';
  else if (pathname.startsWith('/government')) currentRole = 'government';
  else if (pathname.startsWith('/insurance')) currentRole = 'insurance';

  const navItems = roleNavItems[currentRole];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-4 w-6 h-6 bg-primary-500 dark:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-600 transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <nav className="h-full overflow-y-auto py-4">
        {/* Main nav */}
        <div className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 mx-3 border-t border-gray-200 dark:border-gray-700" />

        {/* General nav */}
        <div className="space-y-1 px-2">
          {generalNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
