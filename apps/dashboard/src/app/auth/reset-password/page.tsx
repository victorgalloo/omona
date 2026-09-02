'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Supabase will auto-exchange the token from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    // Also check if already in a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => router.push('/inbox'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Logo size={24} className="shrink-0 text-foreground" />
          <span className="font-mono text-lg font-semibold text-foreground">omona_</span>
        </div>

        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
                <CheckCircle2 className="h-7 w-7 text-accent-green" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">¡Contraseña actualizada!</h2>
              <p className="text-center text-sm text-muted">
                Redirigiendo al dashboard...
              </p>
            </div>
          ) : !sessionReady ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-accent-green" />
              <p className="text-sm text-muted">Verificando enlace...</p>
            </div>
          ) : (
            <>
              <h2 className="mb-2 text-center text-lg font-semibold text-foreground">
                Nueva contraseña
              </h2>
              <p className="mb-6 text-center text-sm text-muted">
                Ingresa tu nueva contraseña
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                    className="mt-1.5"
                  />
                </div>

                {error && (
                  <p className="text-sm text-error">{error}</p>
                )}

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cambiar contraseña
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
