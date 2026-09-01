'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { CustomFieldDef, CustomFieldType } from '@omona/shared';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TIPOS: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Fecha' },
  { value: 'select', label: 'Lista de opciones' },
  { value: 'boolean', label: 'Sí / No' },
];

/**
 * Campos propios de cada organización. Una inmobiliaria querrá "zona" y
 * "recámaras"; una clínica, "especialidad". Los valores viven en un JSONB
 * sobre el lead, así que agregar un campo no altera el esquema.
 */
export function CustomFieldsSettings() {
  const [fields, setFields] = useState<CustomFieldDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [tipo, setTipo] = useState<CustomFieldType>('text');
  const [opciones, setOpciones] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    api
      .get<{ data: CustomFieldDef[] }>('/api/crm/custom-fields')
      .then((r) => setFields(r.data))
      .catch(() => setFields([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(cargar, [cargar]);

  async function crear() {
    if (!label.trim()) return;
    setGuardando(true);
    setError(null);
    try {
      await api.post('/api/crm/custom-fields', {
        // la clave se deriva de la etiqueta; el servidor la normaliza igual
        key: label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        label: label.trim(),
        type: tipo,
        options: tipo === 'select'
          ? opciones.split(',').map((o) => o.trim()).filter(Boolean)
          : [],
        position: fields.length,
      });
      setLabel('');
      setOpciones('');
      cargar();
    } catch {
      setError('No se pudo crear. ¿Ya existe un campo con ese nombre?');
    } finally {
      setGuardando(false);
    }
  }

  async function borrar(id: string) {
    await api.delete(`/api/crm/custom-fields/${id}`);
    cargar();
  }

  return (
    <div className="border-t border-border p-5">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Campos personalizados</h3>
      <p className="mb-5 max-w-lg text-sm text-muted">
        Agrega los campos que tu negocio necesita y que Omona no trae de fábrica.
        Aparecerán en cada lead y podrás llenarlos a mano.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && crear()}
          placeholder="Zona, especialidad, número de póliza…"
          className="flex-1 text-sm"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as CustomFieldType)}
          className="border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-green focus:outline-none"
        >
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <Button size="sm" onClick={crear} disabled={guardando || !label.trim()}>
          {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      {tipo === 'select' && (
        <Input
          value={opciones}
          onChange={(e) => setOpciones(e.target.value)}
          placeholder="Opciones separadas por coma: Norte, Sur, Centro"
          className="mt-2 text-sm"
        />
      )}

      {error && <p className="mt-2 text-sm text-error">{error}</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-muted">Cargando…</p>
        ) : fields.length === 0 ? (
          <p className="text-sm text-muted">
            Todavía no tienes campos propios. Los de fábrica —nombre, correo, empresa,
            presupuesto— ya los llena el agente solo.
          </p>
        ) : (
          fields.map((f) => (
            <div key={f.id} className="flex items-center gap-3 border-t border-border py-3">
              <span className="flex-1 text-sm text-foreground">{f.label}</span>
              <span className="font-mono text-xs text-muted">
                {TIPOS.find((t) => t.value === f.type)?.label ?? f.type}
              </span>
              <button
                type="button"
                onClick={() => borrar(f.id)}
                aria-label={`Eliminar ${f.label}`}
                className="text-muted transition-colors hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
