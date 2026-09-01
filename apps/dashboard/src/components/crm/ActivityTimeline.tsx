'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare, Phone, Mail, ArrowRightLeft, CheckCircle2, Bot, Loader2 } from 'lucide-react';
import type { LeadActivity, ActivityKind } from '@omona/shared';
import { api } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ICONO: Record<ActivityKind, typeof MessageSquare> = {
  note: MessageSquare,
  call: Phone,
  email: Mail,
  stage_change: ArrowRightLeft,
  task_done: CheckCircle2,
  agent: Bot,
};

const ETIQUETA: Record<ActivityKind, string> = {
  note: 'nota',
  call: 'llamada',
  email: 'correo',
  stage_change: 'cambio de etapa',
  task_done: 'tarea completada',
  agent: 'agente',
};

/**
 * Bitácora del lead. Sustituye al campo `notes` único, que se sobrescribía y
 * no guardaba quién ni cuándo.
 */
export function ActivityTimeline({ leadId }: { leadId: string }) {
  const [items, setItems] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(() => {
    api
      .get<{ data: LeadActivity[] }>(`/api/crm/leads/${leadId}/activities`)
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [leadId]);

  useEffect(cargar, [cargar]);

  async function agregar() {
    if (!texto.trim()) return;
    setEnviando(true);
    try {
      await api.post(`/api/crm/leads/${leadId}/activities`, { kind: 'note', body: texto });
      setTexto('');
      cargar();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="border-t border-border p-5">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Bitácora</h3>
      <p className="mb-4 font-mono text-xs text-muted">actividad_</p>

      <Textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Qué pasó con este lead…"
        rows={3}
        className="resize-none text-sm"
      />
      <Button size="sm" onClick={agregar} disabled={enviando || !texto.trim()} className="mt-3">
        {enviando && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
        Agregar
      </Button>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted">
            Todavía no hay actividad. Lo que escribas aquí queda con tu nombre y la fecha,
            y los cambios de etapa se registran solos.
          </p>
        ) : (
          items.map((a) => {
            const Icono = ICONO[a.kind] ?? MessageSquare;
            return (
              <div key={a.id} className="flex gap-3 border-t border-border py-4 first:border-t-0">
                <Icono className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="font-mono text-xs text-muted">{ETIQUETA[a.kind]}</span>
                    <span className="font-mono text-xs text-muted/60">
                      {formatRelativeTime(a.created_at)}
                    </span>
                  </div>
                  {a.body && (
                    <p className="whitespace-pre-wrap text-sm text-foreground">{a.body}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
