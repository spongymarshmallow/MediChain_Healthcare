import React, { useState } from 'react';
import { Stethoscope, ArrowLeft, Eye, EyeOff, LogIn, Loader2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctors';

interface DoctorAuthProps {
  onBack: () => void;
}

const DEMO_DOCTOR_NAME = 'Rajesh Gupta';
const DEMO_DOCTOR_PASSWORD = 'doctor123';

export function DoctorAuth({ onBack }: DoctorAuthProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setRole, setUserId } = useAuthStore();
  const navigate = useNavigate();

  const matchingDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(name.toLowerCase())
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const doctor = doctors.find(d =>
      d.name.toLowerCase() === name.toLowerCase()
    );

    if (!doctor) {
      setError('Doctor not found. Please check your name or use demo credentials.');
      setLoading(false);
      return;
    }

    try {
      const email = `doctor-${doctor.id.replace('doc-', '')}@medichain.app`;
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          if (password === DEMO_DOCTOR_PASSWORD) {
            setRole('doctor');
            setUserId(doctor.id);
            navigate('/doctor');
            return;
          }
          setError('Invalid password. Try the demo password or sign up first.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        setRole('doctor');
        setUserId(doctor.id);
        navigate('/doctor');
      }
    } catch {
      if (password === DEMO_DOCTOR_PASSWORD) {
        setRole('doctor');
        setUserId(doctor.id);
        navigate('/doctor');
        return;
      }
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setName(DEMO_DOCTOR_NAME);
    setPassword(DEMO_DOCTOR_PASSWORD);
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Portal</h1>
          <p className="text-gray-600 mt-2">
            Sign in to access patient records
          </p>
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
                Doctor Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  list="doctor-names"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <datalist id="doctor-names">
                  {doctors.map(d => (
                    <option key={d.id} value={d.name} />
                  ))}
                </datalist>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select from registered doctors or type your name
              </p>
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
              disabled={loading}
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

          {/* Selected Doctor Info */}
          {matchingDoctors.length === 1 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 mb-1">Doctor Found:</p>
              <p className="font-medium text-gray-900">{matchingDoctors[0].name}</p>
              <p className="text-sm text-gray-600">{matchingDoctors[0].specialty}</p>
              <p className="text-sm text-gray-600">{matchingDoctors[0].hospital}</p>
            </div>
          )}

          {/* Demo Mode */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-3 text-center">
              <strong>Testing?</strong> Use demo credentials:
            </p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2 px-4 bg-warning-100 text-warning-800 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-warning-200 transition-colors text-sm"
            >
              Use Demo Account
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Dr. {DEMO_DOCTOR_NAME} | Password: <code className="font-mono">{DEMO_DOCTOR_PASSWORD}</code>
            </p>
          </div>
        </div>

        {/* Available Doctors */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-medium text-gray-500 mb-2">Registered Doctors:</p>
          <div className="space-y-2">
            {doctors.map(doctor => (
              <button
                key={doctor.id}
                type="button"
                onClick={() => setName(doctor.name)}
                className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">{doctor.name}</p>
                <p className="text-xs text-gray-500">
                  {doctor.specialty} | {doctor.hospital}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
