'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { CustomFieldDef } from '@omona/shared';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';

/**
 * Los campos que la organización definió en Ajustes, con sus valores para
 * este lead. Los valores viven en leads.custom_fields (JSONB).
 */
export function CustomFields({
  leadId,
  values,
}: {
  leadId: string;
  values: Record<string, unknown>;
}) {
  const [defs, setDefs] = useState<CustomFieldDef[]>([]);
  const [local, setLocal] = useState<Record<string, unknown>>(values ?? {});
  const [loading, setLoading] = useState(true);
  const [guardado, setGuardado] = useState(false);

  const cargar = useCallback(() => {
    api
      .get<{ data: CustomFieldDef[] }>('/api/crm/custom-fields')
      .then((r) => setDefs(r.data))
      .catch(() => setDefs([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(cargar, [cargar]);

  async function guardar(key: string, value: unknown) {
    const next = { ...local, [key]: value };
    setLocal(next);
    // La ruta dedicada hace merge en el JSONB en vez de reemplazarlo: dos
    // personas editando campos distintos no se pisan entre sí.
    await api.patch(`/api/leads/${leadId}/custom-fields`, { [key]: value });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1500);
  }

  // Sin campos definidos no se ocupa espacio en la pantalla.
  if (loading || defs.length === 0) return null;

  return (
    <div className="border-t border-border p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-foreground">Campos propios</h3>
        {guardado && (
          <span className="flex items-center gap-1 font-mono text-xs text-accent-green">
            <Check className="h-3 w-3" /> guardado
          </span>
        )}
      </div>

      <div className="space-y-3">
        {defs.map((f) => {
          const valor = local[f.key];

          if (f.type === 'boolean') {
            return (
              <label key={f.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(valor)}
                  onChange={(e) => guardar(f.key, e.target.checked)}
                  className="h-4 w-4 border-border"
                />
                <span className="text-sm text-foreground">{f.label}</span>
              </label>
            );
          }

          if (f.type === 'select') {
            return (
              <div key={f.id} className="flex items-center gap-3">
                <span className="w-32 shrink-0 font-mono text-xs text-muted">{f.label}</span>
                <select
                  value={String(valor ?? '')}
                  onChange={(e) => guardar(f.key, e.target.value)}
                  className="flex-1 border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-green focus:outline-none"
                >
                  <option value="">— sin valor —</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={f.id} className="flex items-center gap-3">
              <span className="w-32 shrink-0 font-mono text-xs text-muted">{f.label}</span>
              <Input
                type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                defaultValue={String(valor ?? '')}
                onBlur={(e) => guardar(f.key, e.target.value)}
                className="flex-1 text-sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
