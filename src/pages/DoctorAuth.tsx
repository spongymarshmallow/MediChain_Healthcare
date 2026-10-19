import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store';

interface DoctorAuthProps {
  onBack: () => void;
}

interface RegisteredDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
}

const inputClassName =
  'w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-3 text-[15px] text-[#142033] outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100 placeholder:text-[#8b9ab0]';

export function DoctorAuth({ onBack }: DoctorAuthProps) {
  const [doctors, setDoctors] = useState<RegisteredDoctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setRole, setUserId } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function fetchDoctors() {
      const { data, error: fetchError } = await supabase
        .from('registered_doctors')
        .select('id, name, specialty, hospital')
        .order('name');

      if (!active) return;

      if (fetchError) {
        setError('Unable to load the doctor list. Please refresh and try again.');
      } else {
        setDoctors(data ?? []);
      }
      setFetchingDoctors(false);
    }

    fetchDoctors();

    return () => {
      active = false;
    };
  }, []);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? null;

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedDoctor) {
      setError('Please select your name from the doctor list.');
      setLoading(false);
      return;
    }

    try {
      const { data: doctorData, error: fetchError } = await supabase
        .from('registered_doctors')
        .select('id, password')
        .eq('id', selectedDoctor.id)
        .maybeSingle();

      if (fetchError || !doctorData) {
        setError('We could not verify this doctor account. Please try again.');
        return;
      }

      if (doctorData.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }

      setRole('doctor');
      setUserId(selectedDoctor.id);
      navigate('/doctor');
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-[#142033]">
      <header className="border-b border-[#dfe6ef] bg-[#f7f9fc]">
        <div className="mx-auto flex h-[70px] max-w-[1080px] items-center justify-between px-6 lg:px-0">
          <div className="flex items-center gap-3">
            <img src="/assets/images/image%20copy.png" alt="MediChain logo" className="h-7 w-7 object-contain" />
            <span className="text-[16px] font-bold tracking-[-0.03em]">MediChain</span>
          </div>
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-[#40536d] transition hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-70px)] max-w-[1080px] items-center gap-14 px-6 py-12 lg:grid-cols-[1fr_432px] lg:gap-20 lg:px-0 lg:py-16">
        <section className="max-w-[480px]">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary-600">Doctor portal</p>
          <h1 className="mt-4 font-serif text-[48px] font-bold leading-[1.04] tracking-[-0.045em] text-[#101827] sm:text-[60px]">
            Access your secure health records.
          </h1>
          <p className="mt-5 max-w-[440px] text-[17px] leading-[1.65] text-[#536780]">
            Sign in to view the information and tools available to your role.
          </p>
          <div className="mt-9 flex items-start gap-3">
            <LockKeyhole className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
            <div>
              <p className="font-semibold text-[#142033]">Encrypted access</p>
              <p className="mt-1 text-sm leading-6 text-[#536780]">Your credentials and record access are protected.</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#dfe6ef] bg-white p-8 shadow-[0_16px_40px_rgba(38,60,91,0.08)] sm:p-9">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#536780]">Doctor portal</p>
              <h2 className="mt-1 font-serif text-[27px] leading-tight text-[#101827]">Sign in to MediChain</h2>
            </div>
          </div>

          <div className="my-7 border-t border-[#e5eaf0]" />

          {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="doctor-select" className="mb-2 block text-sm font-semibold text-[#142033]">Select Doctor</label>
              <div className="relative">
                <select
                  id="doctor-select"
                  value={selectedDoctorId}
                  onChange={(event) => setSelectedDoctorId(event.target.value)}
                  required
                  disabled={fetchingDoctors || doctors.length === 0}
                  className={`${inputClassName} appearance-none pr-10 disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:opacity-70`}
                >
                  <option value="">{fetchingDoctors ? 'Loading doctors...' : doctors.length ? 'Select your name' : 'No doctors available'}</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#73849b]" />
              </div>
              {selectedDoctor && <p className="mt-2 text-xs text-[#536780]">{selectedDoctor.specialty} · {selectedDoctor.hospital}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="doctor-password" className="block text-sm font-semibold text-[#142033]">Password</label>
              </div>
              <div className="relative">
                <input
                  id="doctor-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className={`${inputClassName} pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73849b] hover:text-primary-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || fetchingDoctors || doctors.length === 0} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in securely'}
            </button>
            <p className="pt-1 text-center text-sm text-[#536780]">Need access help? Contact your MediChain administrator.</p>
          </form>
        </section>
      </main>
    </div>
  );
}
