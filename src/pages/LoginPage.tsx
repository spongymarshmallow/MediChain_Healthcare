import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  User,
  Stethoscope,
  Building2,
  Store,
  Landmark,
  Shield,
  Fingerprint,
  Clock,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../store';
import { PatientAuth } from './PatientAuth';
import { DoctorAuth } from './DoctorAuth';
import type { UserRole } from '../types';

type View = 'roles' | 'patient-auth' | 'doctor-auth';

const roles: { id: UserRole; label: string; description: string; icon: React.ElementType; color: string }[] = [
  {
    id: 'hospital',
    label: 'Hospital Admin',
    description: 'Manage admissions, upload records, and explore the blockchain',
    icon: Building2,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    description: 'Verify prescriptions, dispense medicines, and check authenticity',
    icon: Store,
    color: 'bg-warning-100 text-warning-600',
  },
  {
    id: 'government',
    label: 'Government',
    description: 'Monitor national health trends and disease outbreaks',
    icon: Landmark,
    color: 'bg-red-100 text-red-600',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    description: 'Process claims, verify treatments, and detect fraud',
    icon: Shield,
    color: 'bg-cyan-100 text-cyan-600',
  },
];

export function LoginPage() {
  const [view, setView] = useState<View>('roles');
  const navigate = useNavigate();
  const { setRole } = useAuthStore();

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'patient') {
      setView('patient-auth');
    } else if (role === 'doctor') {
      setView('doctor-auth');
    } else {
      setRole(role);
      navigate(`/${role}`);
    }
  };

  if (view === 'patient-auth') {
    return <PatientAuth onBack={() => setView('roles')} />;
  }

  if (view === 'doctor-auth') {
    return <DoctorAuth onBack={() => setView('roles')} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12">

          <h1 className="text-5xl sm:text-6xl font-serif text-gray-900 mb-1 leading-tight">
            One patient.
          </h1>
          <h1 className="text-5xl sm:text-6xl font-serif text-primary-600 mb-1 leading-tight italic">
            One health identity.
          </h1>
          <h1 className="text-5xl sm:text-6xl font-serif text-gray-900 leading-tight">
            One trusted history.
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mt-6 leading-relaxed">
            MediChain is a blockchain-backed universal healthcare record ecosystem. Your encrypted history lives in one secure node — and you alone decide who reads it.
          </p>

          {/* Login links - pill style buttons */}
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => setView('patient-auth')}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Patient login
              <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setView('doctor-auth')}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Doctor login
              <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Role Selection for other roles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Other Portals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="group p-4 rounded-xl border-2 border-gray-100 hover:border-primary-300 hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{role.label}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Fingerprint className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Verified Identity</p>
                <p className="text-sm text-gray-500">Verified digital health record</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100">
                <Lock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Blockchain Secured</p>
                <p className="text-sm text-gray-500">Immutable health records</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-100">
                <Clock className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Real-time Access</p>
                <p className="text-sm text-gray-500">Instant verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to the Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
