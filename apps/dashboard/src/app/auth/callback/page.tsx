'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function AuthCallbackPage() {
  return <Suspense><AuthCallbackContent /></Suspense>;
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/inbox';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirmando tu cuenta...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Read tokens from query params (primary) or hash fragment (fallback)
        let accessToken = searchParams.get('access_token');
        let refreshToken = searchParams.get('refresh_token');
        let type = searchParams.get('type');

        if (!accessToken && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
          type = hashParams.get('type');
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;

          // Clean tokens from URL to avoid leaking in browser history
          window.history.replaceState({}, '', window.location.pathname);

          setStatus('success');
          if (type === 'recovery') {
            setMessage('Redirigiendo para cambiar tu contraseña...');
            setTimeout(() => router.push('/auth/reset-password'), 1000);
          } else {
            setMessage('¡Cuenta confirmada! Redirigiendo...');
            setTimeout(() => router.push(next), 1500);
          }
          return;
        }

        // Fallback: check if session already exists
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
          setMessage('¡Sesión activa! Redirigiendo...');
          setTimeout(() => router.push(next), 1000);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    handleCallback();
  }, [router, searchParams, next]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background p-8 text-center shadow-sm">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent-green" />
            <h2 className="mt-4 text-lg font-bold text-foreground">{message}</h2>
            <p className="mt-1 text-sm text-muted">Solo un momento</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
              <CheckCircle2 className="h-8 w-8 text-accent-green" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">{message}</h2>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-muted">
              <XCircle className="h-8 w-8 text-error" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">Error de confirmación</h2>
            <p className="mt-1 text-sm text-muted">El enlace puede haber expirado o ya fue usado</p>
            <div className="mt-4 space-y-2">
              <button onClick={() => router.push('/login')}
                className="w-full rounded-xl bg-accent-green px-6 py-2.5 text-sm font-semibold text-background hover:bg-surface-2">
                Ir a iniciar sesión
              </button>
              <button onClick={() => router.push('/signup')}
                className="w-full rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-muted hover:bg-surface">
                Crear nueva cuenta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
