'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

/** Campos de lead a los que se puede mapear una columna del archivo. */
const CAMPOS = [
  { key: 'phone_number', label: 'Teléfono', requerido: true },
  { key: 'name', label: 'Nombre', requerido: false },
  { key: 'email', label: 'Correo', requerido: false },
  { key: 'company', label: 'Empresa', requerido: false },
] as const;

interface Preview {
  headers: string[];
  sample: string[][];
  totalRows: number;
}

export default function ImportPage() {
  const router = useRouter();
  const [csv, setCsv] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [mapping, setMapping] = useState<Record<string, number | null>>({});
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ creados: number; totalErrores: number } | null>(null);

  async function leerArchivo(file: File) {
    setError(null);
    const texto = await file.text();
    setCsv(texto);
    setCargando(true);
    try {
      const p = await api.post<Preview>('/api/crm/import/preview', { csv: texto });
      setPreview(p);
      // adivina el mapeo por el nombre de cada encabezado
      const auto: Record<string, number | null> = {};
      for (const campo of CAMPOS) {
        const i = p.headers.findIndex((h) => {
          const n = h.toLowerCase();
          if (campo.key === 'phone_number') return /tel|phone|whats|cel|móvil|movil/.test(n);
          if (campo.key === 'name') return /nombre|name|contacto/.test(n);
          if (campo.key === 'email') return /mail|correo/.test(n);
          return /empresa|company|negocio/.test(n);
        });
        auto[campo.key] = i >= 0 ? i : null;
      }
      setMapping(auto);
    } catch {
      setError('No pudimos leer el archivo. ¿Es un CSV con encabezados en la primera fila?');
    } finally {
      setCargando(false);
    }
  }

  async function importar() {
    if (mapping.phone_number === null || mapping.phone_number === undefined) {
      setError('Falta indicar cuál columna tiene el teléfono.');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const r = await api.post<{ creados: number; totalErrores: number }>('/api/crm/import', {
        csv,
        mapping,
      });
      setResultado(r);
    } catch {
      setError('La importación falló. Revisa el archivo e inténtalo otra vez.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        title="Importar contactos"
        subtitle="Sube un CSV y di qué columna es cuál. Nada se guarda hasta que confirmes."
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {resultado ? (
          <div className="border-t border-border py-10">
            <p className="mb-1 text-sm font-semibold text-foreground">
              Se importaron {resultado.creados} contactos
            </p>
            {resultado.totalErrores > 0 && (
              <p className="text-sm text-muted">
                {resultado.totalErrores} filas se omitieron, casi siempre por no traer teléfono.
              </p>
            )}
            <Button size="sm" className="mt-4" onClick={() => router.push('/leads')}>
              Ver los leads
            </Button>
          </div>
        ) : !preview ? (
          <div className="border-t border-border py-10">
            <p className="mb-1 text-sm font-semibold text-foreground">Elige tu archivo</p>
            <p className="mb-5 max-w-md text-sm text-muted">
              Un CSV con los encabezados en la primera fila. El teléfono es el único
              campo obligatorio: es lo que identifica a cada contacto en WhatsApp.
            </p>
            <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface">
              <Upload className="h-4 w-4" />
              Seleccionar CSV
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && leerArchivo(e.target.files[0])}
              />
            </label>
          </div>
        ) : (
          <>
            <div className="border-t border-border py-6">
              <p className="mb-1 text-sm font-semibold text-foreground">
                {preview.totalRows} filas encontradas
              </p>
              <p className="mb-5 text-sm text-muted">
                Confirma qué columna corresponde a cada campo.
              </p>

              <div className="space-y-3">
                {CAMPOS.map((campo) => (
                  <div key={campo.key} className="flex items-center gap-3">
                    <span className="w-28 font-mono text-xs text-muted">
                      {campo.label}
                      {campo.requerido && <span className="text-error"> *</span>}
                    </span>
                    <select
                      value={mapping[campo.key] ?? ''}
                      onChange={(e) =>
                        setMapping((m) => ({
                          ...m,
                          [campo.key]: e.target.value === '' ? null : Number(e.target.value),
                        }))
                      }
                      className="border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent-green focus:outline-none"
                    >
                      <option value="">— ninguna —</option>
                      {preview.headers.map((h, i) => (
                        <option key={h + i} value={i}>
                          {h || `columna ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border py-6">
              <p className="mb-3 font-mono text-xs text-muted">vista_previa_</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {preview.headers.map((h, i) => (
                        <th key={h + i} className="py-2 pr-4 font-mono text-xs font-normal text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.sample.map((fila, i) => (
                      <tr key={i} className="border-b border-border">
                        {fila.map((celda, j) => (
                          <td key={j} className="py-2 pr-4 text-foreground">
                            {celda}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Button onClick={importar} disabled={cargando} className="mt-4">
              {cargando && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Importar {preview.totalRows} contactos
            </Button>
          </>
        )}

        {error && <p className="mt-4 text-sm text-error">{error}</p>}
      </div>
    </div>
  );
}
