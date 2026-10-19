import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, LockKeyhole, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store';

type AuthMode = 'login' | 'signup';

interface PatientAuthProps {
  onBack: () => void;
}

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

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const getAccountEmail = async (identifier: string) => {
    const value = identifier.trim();
    if (value.includes('@')) {
      return value;
    }

    const normalizedHealthId = value.toUpperCase();
    const { data: existsData, error: existsError } = await supabase.rpc('health_id_exists', {
      p_health_id: normalizedHealthId,
    });

    if (existsError) {
      throw new Error('Unable to verify your Health ID. Please try again.');
    }

    if (!existsData) {
      throw new Error('Health ID not found in our records. Please check it or create an account.');
    }

    return `${normalizedHealthId.toLowerCase().replace(/-/g, '')}@medichain.app`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      const email = await getAccountEmail(healthId);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('The email or password is incorrect. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before signing in.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        setRole('patient');
        navigate('/patient');
      }
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!healthId.trim()) {
      setError('Enter your email address or Health ID first.');
      setSuccess(null);
      return;
    }

    setResettingPassword(true);
    clearMessages();

    try {
      const email = await getAccountEmail(healthId);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess('If an account matches those details, password reset instructions are on the way.');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Unable to send reset instructions. Please try again.');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

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
          data: { health_id: generatedHealthId, name },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setError(signUpError.message.includes('already registered')
          ? 'This Health ID is already registered. Try signing in instead.'
          : signUpError.message);
        return;
      }

      if (data.user) {
        if (!data.session) {
          setSuccess(`Account created. Your Health ID is ${generatedHealthId}. Please check your email, then sign in.`);
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

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setShowPassword(false);
    clearMessages();
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#122035]">
      <header className="h-[71px] border-b border-[#dde4ed] bg-[#f7f9fc]">
        <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-6 lg:px-0">
          <div className="flex items-center gap-3">
            <img src="/assets/images/image%20copy.png" alt="MediChain logo" className="h-7 w-7 object-contain" />
            <span className="text-[16px] font-bold tracking-[-0.03em] text-[#102038]">MediChain</span>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-[14px] font-medium text-[#263d5a] transition-colors hover:text-[#2452d2]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </button>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-71px)] max-w-[1080px] items-center px-6 py-14 lg:px-0 lg:py-20">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1fr_432px] lg:gap-[74px]">
          <section className="hidden lg:block">
            <p className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#2d5ee8]">Patient portal</p>
            <h1 className="mt-3 max-w-[470px] font-serif text-[52px] leading-[1.04] tracking-[-0.045em] text-[#111c2e]">
              Access your secure health records.
            </h1>
            <p className="mt-3 max-w-[430px] text-[17px] leading-[1.5] text-[#4c6380]">
              Sign in to view the information and tools available to your role.
            </p>
            <div className="mt-9 flex items-start gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center text-[#2d6af2]">
                <LockKeyhole className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#182b45]">Encrypted access</p>
                <p className="mt-1 text-[14px] leading-6 text-[#59708c]">Your credentials and record access are protected.</p>
              </div>
            </div>
          </section>

          <section className="w-full rounded-[10px] border border-[#dfe6ee] bg-white p-7 shadow-[0_14px_34px_rgba(31,55,88,0.08)] sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf2ff] text-[#2d64e8]">
                <UserRound className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#526986]">Patient portal</p>
                <h2 className="mt-0.5 font-serif text-[27px] leading-tight tracking-[-0.03em] text-[#101b2d]">
                  {mode === 'login' ? 'Sign in to MediChain' : 'Create your account'}
                </h2>
              </div>
            </div>
            <div className="my-7 h-px bg-[#e1e6ed]" />

            {error && <div className="mb-5 rounded-md border border-[#f2caca] bg-[#fff5f5] px-3 py-2.5 text-[13px] leading-5 text-[#a83d3d]">{error}</div>}
            {success && <div className="mb-5 rounded-md border border-[#bce5d2] bg-[#f1fbf5] px-3 py-2.5 text-[13px] leading-5 text-[#197247]">{success}</div>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="patient-identifier" className="block text-[14px] font-semibold text-[#17263b]">Email address</label>
                  <input
                    id="patient-identifier"
                    type="text"
                    value={healthId}
                    onChange={(e) => setHealthId(e.target.value)}
                    placeholder="name@organization.com"
                    autoComplete="username"
                    required
                    className="mt-2 h-12 w-full rounded-md border border-[#c8d1dc] bg-white px-3.5 text-[15px] text-[#17263b] outline-none transition focus:border-[#2d64e8] focus:ring-2 focus:ring-[#dbe5ff] placeholder:text-[#8899ad]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="patient-password" className="block text-[14px] font-semibold text-[#17263b]">Password</label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={resettingPassword}
                      className="text-[14px] font-semibold text-[#245bdc] transition-colors hover:text-[#173eaa] disabled:opacity-60"
                    >
                      {resettingPassword ? 'Sending...' : 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative mt-2">
                    <input
                      id="patient-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="h-12 w-full rounded-md border border-[#c8d1dc] bg-white px-3.5 pr-12 text-[15px] text-[#17263b] outline-none transition focus:border-[#2d64e8] focus:ring-2 focus:ring-[#dbe5ff]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76879a] transition-colors hover:text-[#2d64e8]"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#2d5ee8] text-[15px] font-bold text-white shadow-[0_4px_10px_rgba(45,94,232,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#2452d2] disabled:cursor-not-allowed disabled:bg-[#8ea9ed]"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-[18px] w-[18px]" />}
                  {loading ? 'Signing in...' : 'Sign in securely'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="patient-name" className="block text-[14px] font-semibold text-[#17263b]">Full name</label>
                  <input id="patient-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required className="mt-2 h-12 w-full rounded-md border border-[#c8d1dc] px-3.5 text-[15px] outline-none focus:border-[#2d64e8] focus:ring-2 focus:ring-[#dbe5ff]" />
                </div>
                <div>
                  <label htmlFor="signup-health-id" className="block text-[14px] font-semibold text-[#17263b]">Health ID <span className="font-normal text-[#71839a]">(optional)</span></label>
                  <input id="signup-health-id" type="text" value={healthId} onChange={(e) => setHealthId(e.target.value.toUpperCase())} placeholder="Leave empty to auto-generate" className="mt-2 h-12 w-full rounded-md border border-[#c8d1dc] px-3.5 text-[15px] outline-none focus:border-[#2d64e8] focus:ring-2 focus:ring-[#dbe5ff]" />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-[14px] font-semibold text-[#17263b]">Password</label>
                  <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required placeholder="At least 6 characters" className="mt-2 h-12 w-full rounded-md border border-[#c8d1dc] px-3.5 text-[15px] outline-none focus:border-[#2d64e8] focus:ring-2 focus:ring-[#dbe5ff]" />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-[14px] font-semibold text-[#17263b]">Confirm password</label>
                  <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-2 h-12 w-full rounded-md border border-[#c8d1dc] px-3.5 text-[15px] outline-none focus:border-[#2d64e8] focus:ring-2 focus:ring-[#dbe5ff]" />
                </div>
                <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#2d5ee8] text-[15px] font-bold text-white transition-colors hover:bg-[#2452d2] disabled:bg-[#8ea9ed]">
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading ? 'Creating account...' : 'Create patient account'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-[13px] leading-5 text-[#526985]">
              {mode === 'login' ? (
                <>Need access help? Contact your MediChain administrator. <button type="button" onClick={() => switchMode('signup')} className="font-semibold text-[#245bdc] hover:text-[#173eaa]">Create an account</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => switchMode('login')} className="font-semibold text-[#245bdc] hover:text-[#173eaa]">Sign in</button></>
              )}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
