'use client';

import { Check, Zap, Crown, MessageSquare, Mail } from 'lucide-react';
import { useTrialStatus } from '@/components/shared/AuthGuard';
import { cn } from '@/lib/utils';

const FREE_FEATURES = [
  'Agente de ventas con IA',
  '1 conexion de WhatsApp',
  'CRM basico',
  'Hasta 100 conversaciones/mes',
  'Soporte por email',
];

const PRO_FEATURES = [
  'Todo del plan Gratis',
  'Conversaciones ilimitadas',
  'Multi-agente (equipo)',
  'Analytics avanzados',
  'Broadcasts masivos',
  'Webhooks y API',
  'Calendario de citas',
  'Soporte prioritario por WhatsApp',
  'Base de conocimiento personalizada',
];

export function PlanSettings() {
  const trial = useTrialStatus();

  const isPro = trial.plan === 'pro' || trial.plan === 'enterprise';

  return (
    <div className="space-y-6">
      {/* Current plan card */}
      <div className={cn(
        'rounded-xl border p-5',
        isPro ? 'border-accent-green/30 bg-accent-green/5' : 'border-border bg-surface'
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isPro ? (
              <Crown className="h-5 w-5 text-accent-green" />
            ) : (
              <Zap className="h-5 w-5 text-warning" />
            )}
            <h3 className="text-lg font-semibold text-foreground capitalize">
              Plan {trial.plan === 'free' ? 'Gratis' : trial.plan}
            </h3>
          </div>
          {isPro && (
            <span className="rounded-full bg-accent-green/15 px-3 py-1 text-xs font-semibold text-accent-green">
              Activo
            </span>
          )}
          {trial.isTrial && (
            <span className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              (trial.daysRemaining ?? 0) <= 3
                ? 'bg-warning/15 text-warning'
                : 'bg-info/15 text-info'
            )}>
              {trial.daysRemaining} dia{(trial.daysRemaining ?? 0) === 1 ? '' : 's'} restantes
            </span>
          )}
        </div>
        {trial.isTrial && (
          <div className="space-y-2">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  (trial.daysRemaining ?? 0) <= 3 ? 'bg-warning' : 'bg-accent-green'
                )}
                style={{ width: `${Math.min(100, ((trial.daysRemaining ?? 0) / 14) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted">
              Tu periodo de prueba {trial.trialEndsAt ? `termina el ${new Date(trial.trialEndsAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'esta activo'}.
            </p>
          </div>
        )}
        {isPro && (
          <p className="text-sm text-muted">
            Tienes acceso completo a todas las funciones de Omona.
          </p>
        )}
      </div>

      {/* Plan comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Free card */}
        <div className={cn(
          'rounded-xl border p-5 space-y-4',
          !isPro ? 'border-foreground/20 ring-1 ring-foreground/10' : 'border-border'
        )}>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Gratis</h4>
            <p className="text-2xl font-bold text-foreground mt-1">$0 <span className="text-sm font-normal text-muted">MXN/mes</span></p>
            <p className="text-xs text-muted mt-1">Prueba de 14 dias, sin tarjeta</p>
          </div>
          <ul className="space-y-2">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-muted">
                <Check className="h-4 w-4 shrink-0 text-muted mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          {!isPro && (
            <div className="rounded-lg bg-surface-2 px-3 py-2 text-center text-xs font-medium text-muted">
              Plan actual
            </div>
          )}
        </div>

        {/* Pro card */}
        <div className={cn(
          'rounded-xl border p-5 space-y-4 relative overflow-hidden',
          isPro ? 'border-accent-green/30 ring-1 ring-accent-green/20' : 'border-border'
        )}>
          {!isPro && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-accent-green px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                Recomendado
              </span>
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Pro</h4>
            <p className="text-2xl font-bold text-foreground mt-1">$1,499 <span className="text-sm font-normal text-muted">MXN/mes</span></p>
            <p className="text-xs text-muted mt-1">Todo lo que necesitas para vender mas</p>
          </div>
          <ul className="space-y-2">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 shrink-0 text-accent-green mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          {isPro ? (
            <div className="rounded-lg bg-accent-green/15 px-3 py-2 text-center text-xs font-semibold text-accent-green">
              Plan actual
            </div>
          ) : (
            <div className="space-y-2">
              <a
                href="https://wa.me/5214773920529?text=Hola%2C%20quiero%20actualizar%20mi%20plan%20de%20Omona%20a%20Pro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-accent-green px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageSquare className="h-4 w-4" />
                Actualizar por WhatsApp
              </a>
              <a
                href="mailto:joscardona@icloud.com?subject=Quiero%20actualizar%20a%20Pro%20en%20Omona"
                className="flex items-center justify-center gap-2 w-full border-t border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
              >
                <Mail className="h-4 w-4" />
                Contactar por email
              </a>
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="border-t border-border p-5 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Preguntas frecuentes</h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-foreground">¿Que pasa cuando termina mi prueba?</p>
            <p className="text-muted mt-0.5">Tu cuenta se pausa y no podras acceder al dashboard hasta que actives un plan. Tus datos se conservan.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">¿Puedo cambiar de plan despues?</p>
            <p className="text-muted mt-0.5">Si, puedes cambiar o cancelar tu plan en cualquier momento contactando a nuestro equipo.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">¿Que metodos de pago aceptan?</p>
            <p className="text-muted mt-0.5">Transferencia bancaria, tarjeta de credito/debito, y pagos por SPEI.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
