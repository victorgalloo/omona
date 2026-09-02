'use client';

import { useCallback, useEffect, useState } from 'react';
import { Send, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/lib/api';

type Filter = 'all' | 'new' | 'qualified';

interface Plantilla {
  name: string;
  language: string;
  category: string;
  body: string;
  variables: number;
}

interface Preview {
  provider: 'baileys' | 'cloud_api';
  total: number;
  fuera_de_ventana: number;
  requiere_plantilla: boolean;
  duracion_estimada_seg: number;
}

interface Campaña {
  id: string;
  status: 'running' | 'done' | 'failed';
  total: number;
  sent: number;
  failed: number;
}

const FILTROS: { value: Filter; label: string; desc: string }[] = [
  { value: 'all', label: 'Todos', desc: 'Todos tus contactos' },
  { value: 'new', label: 'Nuevos', desc: 'Leads en etapa "nuevo"' },
  // Antes decía «score > 50», pero el servidor filtra por etapa, no por score.
  { value: 'qualified', label: 'Calificados', desc: 'Leads en etapa "calificado"' },
];

function duracion(seg: number): string {
  if (seg < 60) return `${seg} s`;
  const min = Math.round(seg / 60);
  return min < 60 ? `${min} min` : `${Math.round(min / 60)} h`;
}

export default function BroadcastPage() {
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [plantilla, setPlantilla] = useState<string>('');
  const [campaña, setCampaña] = useState<Campaña | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const posthog = usePostHog();

  // Cuántas personas van a recibir esto. Antes no se veía por ningún lado:
  // se mandaba a ciegas y el número sólo aparecía al terminar.
  useEffect(() => {
    let cancelado = false;
    api
      .post<Preview>('/api/broadcast/preview', { filter })
      .then((p) => { if (!cancelado) setPreview(p); })
      .catch(() => { if (!cancelado) setPreview(null); });
    return () => { cancelado = true; };
  }, [filter]);

  useEffect(() => {
    api
      .get<{ data: Plantilla[] }>('/api/broadcast/templates')
      .then((r) => setPlantillas(r.data))
      .catch(() => setPlantillas([]));
  }, []);

  // El envío ya no bloquea la petición, así que el progreso se consulta.
  const seguir = useCallback((id: string) => {
    const t = setInterval(async () => {
      try {
        const c = await api.get<Campaña>(`/api/broadcast/${id}`);
        setCampaña(c);
        if (c.status !== 'running') clearInterval(t);
      } catch {
        clearInterval(t);
      }
    }, 2000);
    return t;
  }, []);

  async function enviar() {
    if (!message.trim()) return;
    const cuantos = preview?.total ?? 0;
    if (!confirm(`Se va a enviar a ${cuantos} ${cuantos === 1 ? 'contacto' : 'contactos'}. ¿Continuar?`)) return;

    setEnviando(true);
    setError(null);
    setCampaña(null);
    try {
      const elegida = plantillas.find((p) => p.name === plantilla);
      const res = await api.post<{ campaign_id: string; total: number }>('/api/broadcast', {
        message,
        filter,
        template: elegida ? { name: elegida.name, language: elegida.language } : undefined,
      });
      posthog?.capture('broadcast_sent', { recipient_count: res.total, filter });
      setCampaña({ id: res.campaign_id, status: 'running', total: res.total, sent: 0, failed: 0 });
      seguir(res.campaign_id);
    } catch {
      setError('No pudimos iniciar el envío. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  const esCloud = preview?.provider === 'cloud_api';
  const faltaPlantilla = !!preview?.requiere_plantilla && !plantilla;

  return (
    <div className="flex h-full flex-col">
      <Header title="Difusión" subtitle="Manda un mensaje a varios contactos a la vez, filtrando por etapa." />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-xl">
          <div className="border-t border-border py-5">
            <Label className="text-sm font-medium">Mensaje</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí…"
              rows={5}
              className="mt-1.5 resize-none"
            />
            <p className="mt-1 font-mono text-xs text-muted">{message.length} caracteres</p>
          </div>

          <div className="border-t border-border py-5">
            <Label className="mb-2 block text-sm font-medium">Destinatarios</Label>
            <div className="space-y-2">
              {FILTROS.map((f) => (
                <label
                  key={f.value}
                  className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${
                    filter === f.value ? 'border-foreground' : 'border-border hover:border-border-hover'
                  }`}
                >
                  <input
                    type="radio"
                    name="filter"
                    value={f.value}
                    checked={filter === f.value}
                    onChange={() => setFilter(f.value)}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.label}</p>
                    <p className="text-xs text-muted">{f.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {preview && (
              <p className="mt-3 font-mono text-xs text-muted">
                {preview.total} {preview.total === 1 ? 'contacto' : 'contactos'} · tarda ~
                {duracion(preview.duracion_estimada_seg)}
              </p>
            )}
          </div>

          {/* Con Baileys la difusión es exactamente donde aparece el riesgo de
              bloqueo. Decirlo aquí, no después. */}
          {preview && !esCloud && preview.total > 0 && (
            <div className="border-t border-border py-5">
              <p className="flex gap-2 text-sm text-muted">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span>
                  Estás enviando desde tu número de siempre. Si el mensaje va a gente que no
                  te escribió, el riesgo de que WhatsApp bloquee el número es el mismo que si
                  los mandaras a mano. Omona está pensado sobre todo para contestarle a quien
                  te busca: ahí ese riesgo no existe.
                </span>
              </p>
            </div>
          )}

          {/* Fuera de la ventana de 24 h, Meta sólo acepta plantillas aprobadas. */}
          {esCloud && preview.fuera_de_ventana > 0 && (
            <div className="border-t border-border py-5">
              <p className="mb-1 text-sm font-semibold text-foreground">
                {preview.fuera_de_ventana} de {preview.total} no te han escrito en 24 horas
              </p>
              <p className="mb-3 text-sm text-muted">
                A esos Meta sólo permite escribirles con una plantilla aprobada. El texto de
                arriba se usará con quienes sí estén dentro de la ventana.
              </p>

              {plantillas.length === 0 ? (
                <p className="text-sm text-muted">
                  No encontramos plantillas aprobadas en tu cuenta de Meta. Créalas en
                  Meta Business y vuelve aquí.
                </p>
              ) : (
                <select
                  value={plantilla}
                  onChange={(e) => setPlantilla(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-border-hover focus:outline-none"
                >
                  <option value="">— elige una plantilla —</option>
                  {plantillas.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.category.toLowerCase()})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="border-t border-border py-5">
            <Button
              onClick={enviar}
              disabled={enviando || !message.trim() || !preview?.total || faltaPlantilla}
              className="w-full"
              size="lg"
            >
              {enviando ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {enviando ? 'Iniciando…' : `Enviar a ${preview?.total ?? 0}`}
            </Button>

            {faltaPlantilla && (
              <p className="mt-2 text-center text-xs text-muted">
                Elige una plantilla para poder enviar.
              </p>
            )}
            {error && <p className="mt-2 text-center text-sm text-error">{error}</p>}
          </div>

          {campaña && (
            <div className="border-t border-border py-5">
              <p className="mb-2 text-sm font-semibold text-foreground">
                {campaña.status === 'running' ? 'Enviando…' : 'Envío terminado'}
              </p>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent-green" />
                  {campaña.sent} de {campaña.total}
                </span>
                {campaña.failed > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <XCircle className="h-4 w-4 text-error" />
                    {campaña.failed} fallidos
                  </span>
                )}
              </div>
              {campaña.status === 'running' && (
                <p className="mt-2 font-mono text-xs text-muted">
                  Puedes cerrar esta pantalla: el envío sigue por su cuenta.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
