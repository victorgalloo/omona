'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bookmark, Loader2, Trash2, Users } from 'lucide-react';
import type { SavedView } from '@omona/shared';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * Combinaciones de filtro con nombre. Sin esto, los filtros se pierden al
 * recargar y hay que rearmarlos cada vez.
 */
export function SavedViews({
  entity = 'leads',
  filters,
  onApply,
}: {
  entity?: SavedView['entity'];
  /** Los filtros activos ahora mismo, que es lo que se guardaría. */
  filters: Record<string, unknown>;
  onApply: (filters: Record<string, unknown>) => void;
}) {
  const [views, setViews] = useState<SavedView[]>([]);
  const [creando, setCreando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [compartida, setCompartida] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    api
      .get<{ data: SavedView[] }>(`/api/crm/views?entity=${entity}`)
      .then((r) => setViews(r.data))
      .catch(() => setViews([]));
  }, [entity]);

  useEffect(cargar, [cargar]);

  async function guardar() {
    if (!nombre.trim()) return;
    setGuardando(true);
    try {
      await api.post('/api/crm/views', {
        name: nombre.trim(),
        entity,
        filters,
        isShared: compartida,
      });
      setNombre('');
      setCompartida(false);
      setCreando(false);
      cargar();
    } finally {
      setGuardando(false);
    }
  }

  async function borrar(id: string) {
    await api.delete(`/api/crm/views/${id}`);
    cargar();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {views.map((v) => (
        <div key={v.id} className="group flex items-center">
          <button
            type="button"
            onClick={() => onApply(v.filters)}
            className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-border-hover hover:text-foreground"
          >
            {v.is_shared ? <Users className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
            {v.name}
          </button>
          <button
            type="button"
            onClick={() => borrar(v.id)}
            aria-label={`Eliminar la vista ${v.name}`}
            className="ml-1 text-muted opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ))}

      {creando ? (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && guardar()}
            placeholder="Leads calientes de esta semana"
            className="h-8 w-56 text-sm"
            autoFocus
          />
          <label className="flex items-center gap-1.5 font-mono text-xs text-muted">
            <input
              type="checkbox"
              checked={compartida}
              onChange={(e) => setCompartida(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            para todo el equipo
          </label>
          <Button size="sm" onClick={guardar} disabled={guardando || !nombre.trim()}>
            {guardando && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Guardar
          </Button>
          <button
            type="button"
            onClick={() => setCreando(false)}
            className="font-mono text-xs text-muted hover:text-foreground"
          >
            cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreando(true)}
          className="font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          + guardar esta vista
        </button>
      )}
    </div>
  );
}
