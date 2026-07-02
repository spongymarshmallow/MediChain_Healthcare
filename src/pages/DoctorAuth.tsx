import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, LogIn, Loader2, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

interface DoctorAuthProps {
  onBack: () => void;
}

interface RegisteredDoctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
}

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
    async function fetchDoctors() {
      const { data, error: fetchError } = await supabase
        .from('registered_doctors')
        .select('id, name, specialty, hospital')
        .order('name');

      if (!fetchError && data) {
        setDoctors(data);
      }
      setFetchingDoctors(false);
    }
    fetchDoctors();
  }, []);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) ?? null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedDoctor) {
      setError('Please select a doctor from the list.');
      setLoading(false);
      return;
    }

    try {
      const email = `doctor-${selectedDoctor.id.replace('doc-', '')}@medichain.app`;
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid password. Please try again.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        setRole('doctor');
        setUserId(selectedDoctor.id);
        navigate('/doctor');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access patient records</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor
              </label>
              <div className="relative">
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required
                  disabled={fetchingDoctors}
                  className="w-full appearance-none px-4 py-3 pr-10 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:opacity-60"
                >
                  <option value="">
                    {fetchingDoctors ? 'Loading doctors...' : 'Select your name'}
                  </option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {selectedDoctor && (
                <p className="text-xs text-blue-600 mt-1">
                  {selectedDoctor.specialty} &middot; {selectedDoctor.hospital}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || fetchingDoctors}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
