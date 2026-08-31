'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2, Eye, EyeOff, Mail } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '../../../components/shared/Logo';

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const [fullName, setFullName]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const { signUp } = useAuth();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? undefined;
  const posthog = usePostHog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName, next);
      posthog?.capture('signed_up', { method: 'email' });
      setConfirmationSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const Background = () => (
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
  );

  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Background />

        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={20} className="shrink-0 text-foreground" />
            <span className="font-mono font-semibold text-foreground ml-1">omona_</span>
          </Link>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
          <div className="w-full max-w-sm text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-border">
              <Mail className="h-8 w-8 text-foreground" />
            </div>
            <h2 className="text-xl font-mono font-semibold text-foreground">revisa_tu_correo</h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Enviamos un enlace de confirmación a
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{email}</p>

            <div className="mt-6 rounded-xl bg-surface border border-border p-4 text-left">
              <p className="text-xs font-mono text-muted">
                # Haz clic en el enlace para confirmar tu cuenta.<br />
                # Serás redirigido automáticamente al dashboard.
              </p>
            </div>

            <p className="mt-4 text-xs text-muted">
              ¿No lo ves? Revisa tu carpeta de <strong className="text-muted">spam</strong>
            </p>

            <div className="mt-8 space-y-3">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl text-sm font-mono flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                ./ir_al_login
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setConfirmationSent(false)}
                className="text-xs font-mono text-muted hover:text-foreground transition-colors"
              >
                usar otro correo
              </button>
            </div>

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Background />

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
            <h1 className="text-2xl font-mono font-semibold text-foreground">signup_</h1>
            <p className="mt-1.5 text-sm text-muted">Crea tu cuenta y conecta tu agente</p>
          </div>

          {/* Tab switcher */}
          <div className="flex mb-6 bg-surface border border-border rounded-xl p-1">
            <Link
              href="/login"
              className="flex-1 py-2 text-sm font-mono text-center rounded-lg text-muted hover:text-foreground transition-colors"
            >
              ./login
            </Link>
            <span className="flex-1 py-2 text-sm font-mono text-center rounded-lg bg-foreground text-background font-medium">
              ./signup
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-2">nombre</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                placeholder="Tu nombre o empresa"
                className="w-full px-3.5 py-3 rounded-xl text-sm bg-surface border border-border text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 disabled:opacity-50"
              />
            </div>

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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-3.5 py-3 pr-10 rounded-xl text-sm bg-surface border border-border text-foreground placeholder:text-muted outline-none transition-colors focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
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
                  ./crear_cuenta
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

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
