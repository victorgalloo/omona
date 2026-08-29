'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-green">
            <MessageSquare className="h-7 w-7 text-background" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Omona</h1>
        </div>

        <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
                <Mail className="h-7 w-7 text-accent-green" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Revisa tu correo</h2>
              <p className="text-center text-sm text-muted">
                Te enviamos un enlace a <strong>{email}</strong> para restablecer tu contraseña.
              </p>
              <p className="text-center text-xs text-muted">
                ¿No lo ves? Revisa tu carpeta de spam.
              </p>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Volver al login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="mb-2 text-center text-lg font-semibold text-foreground">
                Recuperar contraseña
              </h2>
              <p className="mb-6 text-center text-sm text-muted">
                Te enviaremos un enlace para restablecer tu contraseña
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@empresa.com"
                    required
                    className="mt-1.5"
                  />
                </div>

                {error && (
                  <p className="text-sm text-error">{error}</p>
                )}

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar enlace
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-muted">
                <Link href="/login" className="font-medium text-accent-green hover:underline">
                  <ArrowLeft className="mr-1 inline h-3 w-3" />
                  Volver al login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
