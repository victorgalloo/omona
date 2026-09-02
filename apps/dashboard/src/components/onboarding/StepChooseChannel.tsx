'use client';

import { useState } from 'react';
import { Zap, ShieldCheck, Check, Loader2, ArrowLeft, ExternalLink, CalendarClock, KeyRound } from 'lucide-react';
import { api } from '@/lib/api';
import { StepConnectWhatsApp } from './StepConnectWhatsApp';

export type Canal = 'baileys' | 'cloud_api';

/** El mismo patrón de contacto que ya usan PlanSettings, TrialExpired y Sidebar. */
const WA_TECNICO =
  'https://wa.me/5214773920529?text=' +
  encodeURIComponent('Hola, necesito ayuda para conectar la API oficial de WhatsApp en Omona');

/** Precio exacto por país y categoría: sólo Meta es fuente confiable, y cambia. */
const META_PRECIOS = 'https://developers.facebook.com/docs/whatsapp/pricing';

interface Opcion {
  id: Canal;
  etiqueta: string;
  titulo: string;
  resumen: string;
  icono: typeof Zap;
  aFavor: string[];
  enContra: string[];
}

const OPCIONES: Opcion[] = [
  {
    id: 'baileys',
    etiqueta: 'Modo rápido',
    titulo: 'Tu número de siempre',
    resumen: 'Escaneas un QR y en minutos tu agente está contestando.',
    icono: Zap,
    aFavor: [
      'Listo en minutos, sin trámites',
      'Usa el número que ya tienes, con tu historial',
      'Meta no te cobra por mensaje',
      'El agente escribe libre, sin aprobaciones',
    ],
    enContra: [
      'Canal no oficial: Meta puede bloquear el número',
      'El riesgo real aparece al mandar mensajes masivos',
      'La sesión puede caerse y hay que volver a escanear',
    ],
  },
  {
    id: 'cloud_api',
    etiqueta: 'Modo lento',
    titulo: 'API oficial de Meta',
    resumen: 'Toma días darlo de alta, pero es el canal soportado por Meta.',
    icono: ShieldCheck,
    aFavor: [
      'Canal oficial: no te bloquean por uso legítimo',
      'Puedes obtener la palomita de negocio verificado',
      'Difusión legítima por plantillas aprobadas',
    ],
    enContra: [
      'Dar de alta el negocio tarda días y pide documentos',
      'El número no puede estar ya usado en WhatsApp',
      'Los mensajes que tú inicias tienen costo',
    ],
  },
];

export function StepChooseChannel({
  onConnected,
}: {
  /** Se llama cuando el canal queda realmente conectado. */
  onConnected: () => void;
}) {
  const [elegido, setElegido] = useState<Canal | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function elegir(canal: Canal) {
    setGuardando(true);
    setError(null);
    try {
      await api.post('/api/whatsapp/provider', { provider: canal });
      setElegido(canal);
    } catch {
      setError('No pudimos guardar tu elección. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  if (elegido === 'baileys') {
    return (
      <div>
        <StepConnectWhatsApp onComplete={onConnected} />
        <button
          onClick={() => setElegido(null)}
          className="mx-auto mt-6 flex items-center gap-1 text-xs text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> elegir otro canal
        </button>
      </div>
    );
  }

  if (elegido === 'cloud_api') {
    return <PasosApiOficial onVolver={() => setElegido(null)} />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">¿Por dónde va a contestar tu agente?</h2>
      <p className="mt-1 text-sm text-muted">
        Puedes cambiar de canal cuando quieras desde Ajustes. Nada de esto es definitivo.
      </p>

      <div className="mt-5 space-y-3">
        {OPCIONES.map((o) => {
          const Icono = o.icono;
          return (
            <button
              key={o.id}
              onClick={() => elegir(o.id)}
              disabled={guardando}
              className="w-full border border-border p-4 text-left transition-colors hover:border-border-hover disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Icono className="h-4 w-4 shrink-0 text-foreground" />
                <span className="font-mono text-xs uppercase tracking-wider text-muted">{o.etiqueta}</span>
              </div>
              <div className="mt-1.5 text-sm font-semibold text-foreground">{o.titulo}</div>
              <p className="mt-0.5 text-sm text-muted">{o.resumen}</p>

              <div className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-2">
                <ul className="space-y-1">
                  {o.aFavor.map((t) => (
                    <li key={t} className="flex gap-1.5 text-xs text-foreground">
                      <span aria-hidden className="text-muted">+</span> {t}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {o.enContra.map((t) => (
                    <li key={t} className="flex gap-1.5 text-xs text-muted">
                      <span aria-hidden>−</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-error">{error}</p>}
      {guardando && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <Loader2 className="h-3 w-3 animate-spin" /> guardando…
        </p>
      )}

      <NotaCostos />
      <NotaDifusion />
    </div>
  );
}

/**
 * El modelo de cobro, sin cifras: los precios de Meta cambian por país y
 * categoría, y un número desactualizado aquí es peor que ninguno.
 */
function NotaCostos() {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <p className="mb-1.5 font-mono text-xs uppercase tracking-wider text-muted">costos_</p>
      <p className="text-sm text-muted">
        Con tu número de siempre, Meta no te cobra nada por mensaje. Con la API oficial,
        responderle a alguien dentro de las 24 horas siguientes a que te escribió{' '}
        <span className="text-foreground">tampoco cuesta</span>: se paga cuando eres tú
        quien inicia la conversación, y el precio depende del país y de si el mensaje es
        de marketing, de utilidad o de autenticación.
      </p>
      <a
        href={META_PRECIOS}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 inline-flex items-center gap-1 text-xs text-accent-link hover:underline"
      >
        Tarifas oficiales de Meta <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

function NotaDifusion() {
  return (
    <div className="mt-4 border-t border-border pt-4">
      <p className="mb-1.5 font-mono text-xs uppercase tracking-wider text-muted">listas_de_difusion_</p>
      {/* Mismo criterio que el FAQ público: Omona es para contestar a quien te
          escribe primero, no para mandar mensajes masivos en frío. */}
      <p className="text-sm text-muted">
        Si mandas mensajes masivos a gente que no te escribió, el riesgo de bloqueo es el
        mismo que si los mandaras a mano — y con tu número de siempre ese riesgo lo cargas
        tú. Con la API oficial la difusión va por plantillas que Meta aprueba antes, que es
        la vía legítima. Omona está pensado sobre todo para contestarle a quien te busca:
        ahí ese riesgo no existe.
      </p>
    </div>
  );
}

/**
 * Elegir la API oficial no desbloquea nada el mismo día: la verificación de
 * negocio con Meta tarda. En vez de dejar al usuario esperando, se le dan las
 * tres salidas y el onboarding continúa.
 */
function PasosApiOficial({ onVolver }: { onVolver: () => void }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Vas por la API oficial</h2>
      <p className="mt-1 text-sm text-muted">
        Ya lo dejamos guardado. Como el alta con Meta tarda unos días, puedes seguir
        avanzando y conectar el canal cuando esté listo.
      </p>

      <div className="mt-5 border-t border-border pt-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">lo_que_necesitas_de_meta_</p>
        <ul className="space-y-1.5 text-sm text-muted">
          <li>Una cuenta de Meta Business con el negocio verificado</li>
          <li>Un número que no esté usado hoy en WhatsApp</li>
          <li>El <span className="font-mono text-xs text-foreground">phone_number_id</span>, el{' '}
            <span className="font-mono text-xs text-foreground">waba_id</span> y un token de acceso</li>
        </ul>
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">mientras_tanto_</p>

        <button
          onClick={onVolver}
          className="flex w-full items-center gap-2 border border-border p-3 text-left text-sm transition-colors hover:border-border-hover"
        >
          <Zap className="h-4 w-4 shrink-0 text-foreground" />
          <span>
            <span className="font-medium text-foreground">Empieza con tu número de siempre</span>
            <span className="block text-xs text-muted">Contesta desde hoy y migra cuando Meta te apruebe</span>
          </span>
        </button>

        <button
          onClick={() => setAbierto((v) => !v)}
          className="flex w-full items-center gap-2 border border-border p-3 text-left text-sm transition-colors hover:border-border-hover"
        >
          <KeyRound className="h-4 w-4 shrink-0 text-foreground" />
          <span>
            <span className="font-medium text-foreground">Ya tengo las credenciales</span>
            <span className="block text-xs text-muted">Pégalas y quedas conectado ahora mismo</span>
          </span>
        </button>

        {abierto && <FormularioCredenciales />}

        <a
          href={WA_TECNICO}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-2 border border-border p-3 text-left text-sm transition-colors hover:border-border-hover"
        >
          <CalendarClock className="h-4 w-4 shrink-0 text-foreground" />
          <span>
            <span className="font-medium text-foreground">Agenda con un técnico</span>
            <span className="block text-xs text-muted">Te acompañamos en el alta con Meta</span>
          </span>
        </a>
      </div>

      <button
        onClick={onVolver}
        className="mt-6 flex items-center gap-1 text-xs text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> elegir otro canal
      </button>
    </div>
  );
}

function FormularioCredenciales() {
  const [form, setForm] = useState({ phone_number_id: '', waba_id: '', access_token: '' });
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completo = form.phone_number_id && form.waba_id && form.access_token;

  async function guardar() {
    setGuardando(true);
    setError(null);
    try {
      await api.post('/api/whatsapp/cloud-credentials', form);
      setListo(true);
    } catch {
      setError('Meta rechazó esas credenciales, o falta alguna. Revísalas e inténtalo otra vez.');
    } finally {
      setGuardando(false);
    }
  }

  if (listo) {
    return (
      <p className="flex items-center gap-1.5 border border-border p-3 text-sm text-foreground">
        <Check className="h-4 w-4 text-accent-green" /> Credenciales guardadas. Tu canal oficial quedó conectado.
      </p>
    );
  }

  return (
    <div className="space-y-2 border border-dashed border-border p-3">
      {(['phone_number_id', 'waba_id', 'access_token'] as const).map((campo) => (
        <label key={campo} className="block">
          <span className="font-mono text-xs text-muted">{campo}</span>
          <input
            type={campo === 'access_token' ? 'password' : 'text'}
            value={form[campo]}
            onChange={(e) => setForm((f) => ({ ...f, [campo]: e.target.value }))}
            className="mt-0.5 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-border-hover focus:outline-none"
          />
        </label>
      ))}

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        onClick={guardar}
        disabled={guardando || !completo}
        className="flex items-center gap-1.5 border border-foreground bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {guardando && <Loader2 className="h-3 w-3 animate-spin" />}
        Guardar credenciales
      </button>
    </div>
  );
}
