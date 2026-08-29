'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { Loader2, CheckCircle2, XCircle, Users } from 'lucide-react';

export default function InvitePage() {
  return <Suspense><InviteContent /></Suspense>;
}

function InviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'checking' | 'login_needed' | 'accepting' | 'success' | 'error'>('checking');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setErrorMsg('Token de invitación no válido'); return; }

    const tryAccept = async () => {
      let { data: { session } } = await supabase.auth.getSession();

      // Brave may delay session persistence — retry once after a short wait
      if (!session) {
        await new Promise(r => setTimeout(r, 1000));
        ({ data: { session } } = await supabase.auth.getSession());
      }

      if (!session) {
        setStatus('login_needed');
        return;
      }

      setStatus('accepting');
      try {
        await api.post('/api/team/invites/accept', { token });
        setStatus('success');
        setTimeout(() => router.push('/inbox'), 2000);
      } catch (err: any) {
        // If auth failed (401), redirect to login with invite context
        if (err.message?.includes('autorizado') || err.message?.includes('Token inválido')) {
          setStatus('login_needed');
          return;
        }
        setStatus('error');
        setErrorMsg(err.message || 'Invitación no válida o expirada');
      }
    };

    tryAccept();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background p-8 text-center shadow-sm">
        {status === 'checking' || status === 'accepting' ? (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-accent-green" />
            <h2 className="mt-4 text-lg font-bold text-foreground">Procesando invitación...</h2>
          </>
        ) : status === 'login_needed' ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10 mb-4">
              <Users className="h-8 w-8 text-accent-green" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Invitación de equipo</h2>
            <p className="mt-2 text-sm text-muted">Inicia sesión o crea una cuenta para unirte al equipo</p>
            <div className="mt-6 space-y-2">
              <button onClick={() => router.push(`/login?next=${encodeURIComponent(`/auth/invite?token=${token}`)}`)}
                className="w-full rounded-xl bg-accent-green px-6 py-2.5 text-sm font-semibold text-background hover:bg-surface-2">
                Iniciar sesión
              </button>
              <button onClick={() => router.push(`/signup?next=${encodeURIComponent(`/auth/invite?token=${token}`)}`)}
                className="w-full rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-muted hover:bg-surface">
                Crear cuenta
              </button>
            </div>
          </>
        ) : status === 'success' ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground">
              <CheckCircle2 className="h-8 w-8 text-accent-green" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">¡Te uniste al equipo!</h2>
            <p className="mt-1 text-sm text-muted">Redirigiendo al dashboard...</p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-muted">
              <XCircle className="h-8 w-8 text-error" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">Invitación no válida</h2>
            <p className="mt-1 text-sm text-muted">{errorMsg}</p>
            <button onClick={() => router.push('/login')}
              className="mt-4 rounded-xl bg-accent-green px-6 py-2.5 text-sm font-semibold text-background hover:bg-surface-2">
              Ir a iniciar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
