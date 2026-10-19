import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Landmark, Shield, Store } from 'lucide-react';
import { useAuthStore } from '../store';
import { PatientAuth } from './PatientAuth';
import { DoctorAuth } from './DoctorAuth';
import type { UserRole } from '../types';

type View = 'roles' | 'patient-auth' | 'doctor-auth';

const roles: { id: UserRole; label: string; description: string; icon: React.ElementType; color: string }[] = [
  {
    id: 'hospital',
    label: 'Hospital Admin',
    description: 'Manage admissions, upload records, and explore the blockchain.',
    icon: Building2,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    description: 'Verify prescriptions, dispense medicines, and check authenticity.',
    icon: Store,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    id: 'government',
    label: 'Government',
    description: 'Monitor national health trends and disease outbreaks.',
    icon: Landmark,
    color: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    description: 'Process claims, verify treatments, and detect fraud.',
    icon: Shield,
    color: 'bg-teal-50 text-teal-600',
  },
];

function BrandMark() {
  return (
    <span className="relative block h-6 w-6" aria-hidden="true">
      <span className="absolute left-2 top-0 h-6 w-2.5 rounded-full bg-pink-500" />
      <span className="absolute bottom-0 left-2 h-6 w-2.5 rounded-full bg-cyan-500" />
      <span className="absolute left-0 top-2 h-2.5 w-6 rounded-full bg-blue-600" />
      <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-400" />
    </span>
  );
}

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
    <div className="min-h-screen bg-[#f7f9fc] text-[#101827]">
      <header className="h-[70px] border-b border-[#e3e8ef] bg-[#f7f9fc]">
        <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-6 lg:px-0">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="text-[16px] font-bold tracking-[-0.03em]">MediChain</span>
          </div>
          <span className="text-[14px] font-medium text-[#233149]">Portals</span>
        </div>
      </header>

      <main>
        <section className="border-b border-[#e3e8ef]">
          <div className="mx-auto flex min-h-[623px] max-w-[1080px] items-start px-6 pb-20 pt-[84px] lg:px-0 lg:pt-[83px]">
            <div className="max-w-[720px]">
              <h1 className="font-serif text-[52px] font-bold leading-[1.02] tracking-[-0.045em] sm:text-[68px] lg:text-[72px]">
                <span className="block">One patient.</span>
                <span className="block italic text-[#2d5ee8]">One health identity.</span>
                <span className="block">One trusted history.</span>
              </h1>
              <p className="mt-8 max-w-[650px] text-[18px] leading-[1.72] text-[#4a607b] sm:text-[19px]">
                MediChain stores your encrypted medical history in one secure record. You decide which doctors, hospitals, pharmacies and insurers can read it, and every access is logged on the blockchain.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setView('patient-auth')}
                  className="group flex h-14 min-w-[192px] items-center justify-between rounded-full bg-[#2d5ee8] px-6 text-[16px] font-semibold text-white shadow-[0_5px_12px_rgba(45,94,232,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#2452d2]"
                >
                  Patient login
                  <ArrowRight className="h-5 w-5 text-blue-100 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => setView('doctor-auth')}
                  className="group flex h-14 min-w-[192px] items-center justify-between rounded-full border border-[#d7dee8] bg-white px-6 text-[16px] font-semibold text-[#142033] shadow-[0_3px_8px_rgba(16,24,40,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#b9c4d3] hover:bg-[#fbfcfe]"
                >
                  Doctor login
                  <ArrowRight className="h-5 w-5 text-[#687487] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1080px] px-6 py-14 lg:px-0 lg:py-[56px]">
          <div className="rounded-2xl border border-[#e4e9f0] bg-white px-7 py-9 shadow-[0_3px_10px_rgba(16,24,40,0.04)] sm:px-8 sm:py-10">
            <h2 className="text-center font-serif text-[30px] leading-tight tracking-[-0.03em] text-[#101827]">Other portals</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="group min-h-[210px] rounded-xl border border-[#e1e7ef] bg-white p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#b9c9e8] hover:shadow-[0_8px_20px_rgba(31,64,114,0.08)]"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${role.color} transition-transform duration-200 group-hover:scale-105`}>
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em] text-[#122035]">{role.label}</h3>
                    <p className="mt-2 text-[15px] leading-[1.5] text-[#5a6d86]">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
