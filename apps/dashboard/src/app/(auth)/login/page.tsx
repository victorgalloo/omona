'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '../../../components/shared/Logo';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { signIn } = useAuth();
  const posthog = usePostHog();
  const router      = useRouter();
  const searchParams = useSearchParams();
  const confirmed   = searchParams.get('confirmed') === 'true';
  const authError   = searchParams.get('error');
  const next        = searchParams.get('next') ?? '/inbox';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      posthog?.capture('signed_in', { method: 'email' });
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={20} className="shrink-0 text-foreground" />
          <span className="font-mono font-semibold text-foreground ml-1">omona_</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-mono font-semibold text-foreground">login_</h1>
            <p className="mt-1.5 text-sm text-muted">Accede a tu dashboard</p>
          </div>

          {/* Tab switcher */}
          <div className="flex mb-6 bg-surface border border-border rounded-xl p-1">
            <span className="flex-1 py-2 text-sm font-mono text-center rounded-lg bg-foreground text-background font-medium">
              ./login
            </span>
            <Link
              href="/signup"
              className="flex-1 py-2 text-sm font-mono text-center rounded-lg text-muted hover:text-foreground transition-colors"
            >
              ./signup
            </Link>
          </div>

          {/* Banners */}
          {confirmed && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#27C93F]/10 border border-[#27C93F]/20 px-3 py-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#27C93F]" />
              <p className="text-xs text-[#27C93F]">¡Cuenta confirmada! Ya puedes iniciar sesión</p>
            </div>
          )}
          {authError === 'confirmation_failed' && (
            <div className="mb-4 rounded-xl bg-[#FF5F56]/10 border border-[#FF5F56]/20 px-3 py-2.5">
              <p className="text-xs text-[#FF5F56]">El enlace de confirmación expiró o ya fue usado.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-2">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="tu@empresa.com"
                className="w-full px-3.5 py-3 rounded-xl text-sm bg-surface border border-border text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-2">password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
                className="w-full px-3.5 py-3 rounded-xl text-sm bg-surface border border-border text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="px-3 py-2.5 rounded-xl text-xs bg-[#FF5F56]/10 border border-[#FF5F56]/20 text-[#FF5F56]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-mono font-medium flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  ./continuar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-xs text-muted hover:text-foreground transition-colors font-mono">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted font-mono">
              powered by{' '}
              <a href="https://anthana.agency" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground transition-colors">
                anthana
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
