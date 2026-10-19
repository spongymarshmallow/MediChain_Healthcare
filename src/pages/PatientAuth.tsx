import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Loader2,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup';

interface PatientAuthProps {
  onBack: () => void;
}

const inputClassName =
  'w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-3 text-[15px] text-[#142033] outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100 placeholder:text-[#8b9ab0]';

export function PatientAuth({ onBack }: PatientAuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [healthId, setHealthId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { setRole } = useAuthStore();
  const navigate = useNavigate();

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
    setSuccess(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedHealthId = healthId.trim().toUpperCase();
      const { data: existsData, error: existsError } = await supabase.rpc('health_id_exists', {
        p_health_id: normalizedHealthId,
      });

      if (existsError) {
        setError('Unable to verify your Health ID. Please try again.');
        return;
      }

      if (!existsData) {
        setError('Health ID not found. Create an account first or check the ID and try again.');
        return;
      }

      const email = `${normalizedHealthId.toLowerCase().replace(/-/g, '')}@medichain.app`;
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid Health ID or password. Please check your details and try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Your account still needs to be verified. Please check your email before signing in.');
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

  const handleForgotPassword = async () => {
    const normalizedHealthId = healthId.trim().toUpperCase();
    if (!normalizedHealthId) {
      setError('Enter your Health ID first so we can send a password reset email.');
      return;
    }

    setResettingPassword(true);
    setError(null);
    setSuccess(null);

    const email = `${normalizedHealthId.toLowerCase().replace(/-/g, '')}@medichain.app`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });

    if (resetError) {
      setError('We could not send a reset email. Check your Health ID and try again.');
    } else {
      setSuccess('If an account exists for this Health ID, a password reset email is on its way.');
    }
    setResettingPassword(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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
    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    try {
      const generatedHealthId = healthId.trim().toUpperCase() || `MC-2026-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
      const email = `${generatedHealthId.toLowerCase().replace(/-/g, '')}@medichain.app`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { health_id: generatedHealthId, name: name.trim() },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setError(
          signUpError.message.includes('already registered')
            ? 'This Health ID is already registered. Sign in instead.'
            : signUpError.message
        );
        return;
      }

      if (data.user) {
        if (!data.session) {
          setSuccess(`Account created. Your Health ID is ${generatedHealthId}. Check your email to verify your account, then sign in.`);
          setMode('login');
          setHealthId(generatedHealthId);
          setPassword('');
          setConfirmPassword('');
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

  const isSignup = mode === 'signup';

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
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary-600">Patient portal</p>
          <h1 className="mt-4 font-serif text-[48px] font-bold leading-[1.04] tracking-[-0.045em] text-[#101827] sm:text-[60px]">
            Access your secure health records.
          </h1>
          <p className="mt-5 max-w-[440px] text-[17px] leading-[1.65] text-[#536780]">
            Sign in to view the information and tools available to you.
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
              {isSignup ? <UserPlus className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#536780]">Patient portal</p>
              <h2 className="mt-1 font-serif text-[27px] leading-tight text-[#101827]">
                {isSignup ? 'Create your MediChain account' : 'Sign in to MediChain'}
              </h2>
            </div>
          </div>

          <div className="my-7 border-t border-[#e5eaf0]" />

          {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700">{error}</div>}
          {success && <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-5 text-emerald-700">{success}</div>}

          {isSignup ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="patient-name" className="mb-2 block text-sm font-semibold text-[#142033]">Full name</label>
                <input id="patient-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required className={inputClassName} />
              </div>
              <div>
                <label htmlFor="signup-health-id" className="mb-2 block text-sm font-semibold text-[#142033]">Health ID <span className="font-normal text-[#7b8da4]">(optional)</span></label>
                <input id="signup-health-id" type="text" value={healthId} onChange={(e) => setHealthId(e.target.value.toUpperCase())} placeholder="Leave blank to generate one" className={`${inputClassName} uppercase tracking-wider`} />
              </div>
              <div>
                <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-[#142033]">Password</label>
                <div className="relative">
                  <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6} className={`${inputClassName} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73849b] hover:text-primary-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-semibold text-[#142033]">Confirm password</label>
                <input id="confirm-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" required className={inputClassName} />
              </div>
              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                {loading ? 'Creating account...' : 'Create an account'}
              </button>
              <p className="pt-1 text-center text-sm text-[#536780]">
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('login')} className="font-semibold text-primary-600 hover:text-primary-700">Sign in</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="health-id" className="mb-2 block text-sm font-semibold text-[#142033]">Health ID</label>
                <input id="health-id" type="text" value={healthId} onChange={(e) => setHealthId(e.target.value.toUpperCase())} placeholder="MC-2026-XXXXXXXX" required className={`${inputClassName} uppercase tracking-wider`} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="patient-password" className="block text-sm font-semibold text-[#142033]">Password</label>
                  <button type="button" onClick={handleForgotPassword} disabled={resettingPassword} className="text-sm font-semibold text-primary-600 hover:text-primary-700 disabled:opacity-60">{resettingPassword ? 'Sending...' : 'Forgot password?'}</button>
                </div>
                <div className="relative">
                  <input id="patient-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className={`${inputClassName} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73849b] hover:text-primary-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign in securely'}
              </button>
              <p className="pt-1 text-center text-sm text-[#536780]">
                Need an account?{' '}
                <button type="button" onClick={() => switchMode('signup')} className="font-semibold text-primary-600 hover:text-primary-700">Create an account</button>
              </p>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
