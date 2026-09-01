'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bot, Check, Loader2 } from 'lucide-react';
import type { Task } from '@omona/shared';
import { Header } from '@/components/shared/Header';
import { api } from '@/lib/api';

const FILTROS = [
  { key: 'mine', label: 'mías' },
  { key: 'open', label: 'abiertas' },
  { key: 'done', label: 'completadas' },
] as const;

type FiltroKey = (typeof FILTROS)[number]['key'];

function fechaCorta(iso: string | null): string {
  if (!iso) return 'sin fecha';
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filtro, setFiltro] = useState<FiltroKey>('mine');
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(() => {
    setLoading(true);
    const query =
      filtro === 'mine' ? 'mine=1&status=open' : filtro === 'open' ? 'status=open' : 'status=done';
    api
      .get<{ data: Task[] }>(`/api/crm/tasks?${query}`)
      .then((r) => setTasks(r.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [filtro]);

  useEffect(cargar, [cargar]);

  async function completar(t: Task) {
    setTasks((prev) => prev.filter((x) => x.id !== t.id));
    await api.patch(`/api/crm/tasks/${t.id}`, { status: 'done', lead_id: t.lead_id, title: t.title });
    cargar();
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Tareas"
        subtitle="Los compromisos pendientes de tu equipo, incluidos los que deja el agente."
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-6 flex gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFiltro(f.key)}
              className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                filtro === f.key
                  ? 'text-foreground border-b border-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : tasks.length === 0 ? (
          <div className="border-t border-border py-10">
            <p className="mb-1 text-sm font-semibold text-foreground">Nada pendiente</p>
            <p className="max-w-md text-sm text-muted">
              Las tareas se crean desde el detalle de un lead, o las deja el agente solo
              cuando detecta un compromiso en la conversación — por ejemplo si alguien
              promete mandar una cotización el jueves.
            </p>
          </div>
        ) : (
          tasks.map((t) => {
            const vencida = t.status === 'open' && !!t.due_at && new Date(t.due_at) < new Date();
            return (
              <div key={t.id} className="flex items-start gap-3 border-t border-border py-4">
                <button
                  type="button"
                  onClick={() => completar(t)}
                  disabled={t.status === 'done'}
                  aria-label="Marcar como completada"
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                    t.status === 'done'
                      ? 'border-accent-green bg-accent-green'
                      : 'border-border hover:border-border-hover'
                  }`}
                >
                  {t.status === 'done' && <Check className="h-3 w-3 text-background" />}
                </button>

                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${t.status === 'done' ? 'text-muted line-through' : 'text-foreground'}`}>
                    {t.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3">
                    <span className={`font-mono text-xs ${vencida ? 'text-error' : 'text-muted'}`}>
                      {fechaCorta(t.due_at)}
                    </span>
                    {t.created_by_agent && (
                      <span className="flex items-center gap-1 font-mono text-xs text-muted/60">
                        <Bot className="h-3 w-3" /> agente
                      </span>
                    )}
                    {t.lead_id && (
                      <Link
                        href={`/leads/${t.lead_id}`}
                        className="font-mono text-xs text-muted hover:text-foreground"
                      >
                        ver lead →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
