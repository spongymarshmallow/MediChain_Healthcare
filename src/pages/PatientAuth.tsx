import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, UserPlus, LogIn, Loader2, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup';

interface PatientAuthProps {
  onBack: () => void;
}

const DEMO_HEALTH_ID = 'MC-2026-00000001';
const DEMO_PASSWORD = 'demo123';

export function PatientAuth({ onBack }: PatientAuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [healthId, setHealthId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { setRole } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const email = `${healthId.toLowerCase().replace(/-/g, '')}@medichain.app`;
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid Health ID or password. If this is your first time, please sign up first.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Account created but not verified. Check your email for confirmation, or try signing up again.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        setRole('patient');
        navigate('/patient');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }
    if (name.length < 2) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    try {
      const generatedHealthId = healthId || `MC-2026-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
      const email = `${generatedHealthId.toLowerCase().replace(/-/g, '')}@medichain.app`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            health_id: generatedHealthId,
            name: name,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('This Health ID is already registered. Try logging in instead.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data.user) {
        if (!data.session) {
          setSuccess(`Account created! Your Health ID is: ${generatedHealthId}. Please check your email to verify your account, then log in.`);
          setMode('login');
          setHealthId(generatedHealthId);
          setPassword('');
        } else {
          setRole('patient');
          navigate('/patient/setup');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setHealthId(DEMO_HEALTH_ID);
    setPassword(DEMO_PASSWORD);
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
          <h1 className="text-3xl font-bold text-gray-900">MediChain</h1>
          <p className="text-gray-600 mt-2">
            {mode === 'login' ? 'Sign in to your health account' : 'Create your health identity'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
              {success}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health ID
                </label>
                <input
                  type="text"
                  value={healthId}
                  onChange={(e) => setHealthId(e.target.value.toUpperCase())}
                  placeholder="MC-2026-XXXXXXXX"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder-gray-400 uppercase tracking-wider"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your 8-digit Health ID
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
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
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
                className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health ID (Optional)
                </label>
                <input
                  type="text"
                  value={healthId}
                  onChange={(e) => setHealthId(e.target.value.toUpperCase())}
                  placeholder="Leave empty to auto-generate"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 uppercase tracking-wider"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If empty, we'll generate a unique Health ID for you
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
                    placeholder="Create a password (min 6 characters)"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Health ID
                  </>
                )}
              </button>
            </form>
          )}

          {/* Demo Mode */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-3 text-center">
              <strong>Testing?</strong> Use the demo account or create a new one:
            </p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full py-2 px-4 bg-warning-100 text-warning-800 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-warning-200 transition-colors text-sm"
            >
              <Play className="w-4 h-4" />
              Use Demo Account
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Health ID: <code className="font-mono">{DEMO_HEALTH_ID}</code> | Password: <code className="font-mono">{DEMO_PASSWORD}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
