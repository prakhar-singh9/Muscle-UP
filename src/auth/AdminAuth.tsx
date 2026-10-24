import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type AdminProfile = {
  id: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
};

type AdminAuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: AdminProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function readableError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    if (!supabase) throw new Error('Supabase is not configured. Add the required VITE_ environment variables.');
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, role, is_active')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!data) throw new Error('Your account profile was not found. Ask the system administrator to check your account.');
    if (!data.is_active) throw new Error('This account is inactive. Contact the system administrator.');
    if (data.role !== 'admin') throw new Error('This account does not have admin access. Use the staff portal when it is available.');
    setProfile(data as AdminProfile);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let alive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setProfile(null);
        setLoading(false);
        return;
      }
      // Defer profile queries so auth state callbacks do not hold up Supabase's auth lock.
      window.setTimeout(() => {
        loadProfile(nextSession.user.id)
          .catch(async (profileError) => {
            if (!alive) return;
            setProfile(null);
            setError(readableError(profileError));
            await supabase?.auth.signOut();
          })
          .finally(() => { if (alive) setLoading(false); });
      }, 0);
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!alive) return;
      if (sessionError) setError(readableError(sessionError));
      setSession(data.session);
      if (!data.session) setLoading(false);
      // The auth listener handles profile loading for an existing session.
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured. Follow the setup instructions in README.md.');
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) throw signInError;
    if (data.user) await loadProfile(data.user.id);
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    setError(null);
    if (supabase) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    }
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo(() => ({ session, user: session?.user ?? null, profile, loading, error, signIn, signOut }), [session, profile, loading, error, signIn, signOut]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return value;
}

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isSupabaseConfigured) {
    return <AuthMessage title="Connect Muscle UP to Supabase" message="The admin sign-in screen is ready, but the app needs its Supabase environment variables before it can authenticate. Follow the setup steps in README.md, then restart the development server." />;
  }

  if (auth.loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600"><div className="text-center"><div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-lime-600" /><p className="text-sm font-medium">Checking admin session…</p></div></div>;
  }

  if (auth.user && auth.profile?.role === 'admin' && auth.profile.is_active) return <>{children}</>;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await auth.signIn(email, password);
      setPassword('');
    } catch (signInError) {
      setFormError(readableError(signInError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7f2] text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/10 grid md:grid-cols-2">
        <section className="hidden md:flex flex-col justify-between bg-[#0b1c30] p-10 text-white">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-500 text-xl font-black">M</div><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-lime-300">MuscleUp</p><p className="text-lg font-extrabold tracking-tight">MUSCLE<span className="text-lime-300">UP</span></p></div></div>
          <div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-lime-300">Admin portal</p><h1 className="text-4xl font-extrabold leading-tight">Your gym.<br />Under control.</h1><p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">Manage membership operations from one secure place.</p></div>
          <p className="text-xs text-slate-400">Authorized administrators only</p>
        </section>
        <section className="p-7 sm:p-10 md:p-12">
          <div className="mb-8 md:hidden"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-600 text-xl font-black text-white">M</div><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-700">MuscleUp admin</p></div>
          <p className="text-sm font-semibold text-lime-700">Welcome back</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight">Sign in</h2><p className="mt-2 text-sm leading-6 text-slate-500">Use the administrator account created for your gym.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div><label htmlFor="admin-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-lime-600 focus:bg-white focus:ring-4 focus:ring-lime-100" placeholder="admin@example.com" /></div>
            <div><label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-lime-600 focus:bg-white focus:ring-4 focus:ring-lime-100" placeholder="Enter your password" /></div>
            {(formError || auth.error) && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{formError || auth.error}</p>}
            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center rounded-xl bg-lime-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in to admin portal'}</button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-slate-400">Access is restricted to active accounts with the admin role.</p>
        </section>
      </div>
    </main>
  );
}

function AuthMessage({ title, message }: { title: string; message: string }) {
  return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 font-black text-lime-800">M</div><h1 className="text-2xl font-extrabold text-slate-900">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{message}</p></section></main>;
}
