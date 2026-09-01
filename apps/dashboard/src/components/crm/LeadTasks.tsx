'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Bot, Loader2, Plus } from 'lucide-react';
import type { Task } from '@omona/shared';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function fechaCorta(iso: string | null): string {
  if (!iso) return 'sin fecha';
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

function vencida(t: Task): boolean {
  return t.status === 'open' && !!t.due_at && new Date(t.due_at) < new Date();
}

/** Tareas del lead. A diferencia de las citas, no ocupan un hueco en el calendario. */
export function LeadTasks({ leadId }: { leadId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    api
      .get<{ data: Task[] }>(`/api/crm/tasks?lead=${leadId}`)
      .then((r) => setTasks(r.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [leadId]);

  useEffect(cargar, [cargar]);

  async function crear() {
    if (!titulo.trim()) return;
    setGuardando(true);
    try {
      await api.post('/api/crm/tasks', {
        title: titulo,
        dueAt: fecha ? new Date(fecha).toISOString() : null,
        leadId,
      });
      setTitulo('');
      setFecha('');
      cargar();
    } finally {
      setGuardando(false);
    }
  }

  async function completar(t: Task) {
    // se marca en la interfaz antes de que responda el servidor
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: 'done' } : x)));
    await api.patch(`/api/crm/tasks/${t.id}`, {
      status: 'done',
      lead_id: t.lead_id,
      title: t.title,
    });
    cargar();
  }

  return (
    <div className="border-t border-border p-5">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Tareas</h3>
      <p className="mb-4 font-mono text-xs text-muted">pendientes_</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && crear()}
          placeholder="Mandar la cotización…"
          className="flex-1 text-sm"
        />
        <Input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="text-sm sm:w-40"
        />
        <Button size="sm" onClick={crear} disabled={guardando || !titulo.trim()}>
          {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted">
            Sin tareas. El agente también las crea solo cuando detecta un compromiso
            en la conversación.
          </p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="flex items-start gap-3 border-t border-border py-3 first:border-t-0">
              <button
                type="button"
                onClick={() => completar(t)}
                disabled={t.status === 'done'}
                aria-label={t.status === 'done' ? 'Completada' : 'Marcar como completada'}
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
                <div className="mt-0.5 flex items-center gap-2">
                  <span className={`font-mono text-xs ${vencida(t) ? 'text-error' : 'text-muted'}`}>
                    {fechaCorta(t.due_at)}
                  </span>
                  {t.created_by_agent && (
                    <span className="flex items-center gap-1 font-mono text-xs text-muted/60">
                      <Bot className="h-3 w-3" /> agente
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
