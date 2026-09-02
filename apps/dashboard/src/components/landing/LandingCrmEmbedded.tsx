'use client';

import { useState } from 'react';
import { useT } from '@/contexts/LanguageContext';
import { Check, Columns3, ListTodo, Users } from 'lucide-react';
import { Band } from './motion/Band';
import { LoopVideo } from './motion/LoopVideo';
import { RevealText } from './motion/RevealText';

/**
 * Las tres vistas de NUESTRO dashboard. Antes esto mostraba capturas de Twenty
 * —un CRM ajeno que ya no usamos— así que enseñaba un producto que no es el
 * nuestro. Ahora son loops de Remotion dibujados sobre las pantallas reales
 * (apps/video/src/compositions/CrmReal.tsx): no necesitan login ni datos
 * sembrados, y se re-rinden solos cuando cambia la paleta.
 */
const VISTAS = [
  {
    video: 'pipeline-real',
    icon: Columns3,
    label: 'Pipeline',
    alt: 'Tablero con las seis etapas del pipeline y los leads que el agente ya calificó.',
    caption:
      'Las seis etapas reales de tu tablero: cada lead que atiende el agente entra en Nuevo y avanza solo hasta Convertido, con su score al lado.',
  },
  {
    video: 'inbox-real',
    icon: Users,
    label: 'Inbox',
    alt: 'Bandeja de conversaciones con el hilo abierto y el agente respondiendo.',
    caption:
      'Todas las conversaciones en un lugar, con lo que dijo cada cliente. Tu equipo entra cuando quiere; el agente sigue atendiendo el resto.',
  },
  {
    video: 'tareas-real',
    icon: ListTodo,
    label: 'Tareas',
    alt: 'Lista de tareas con vencimientos, una de ellas recién completada.',
    caption:
      'El agente deja los pendientes con fecha límite para que tu equipo cierre, no solo registre. Lo vencido se marca solo.',
  },
] as const;

export function LandingCrmEmbedded() {
  const t = useT();
  const [active, setActive] = useState(0);

  return (
    <Band tone="cyan" id="crm" className="py-24 sm:py-32">
      {/* Header */}
      <div className="mb-14 max-w-3xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          crm_embebido
        </p>
        <RevealText
          as="h2"
          lines={[t.features.crm.title]}
          className="mb-5 text-display font-bold text-band-fg"
        />
        <p className="text-xl leading-relaxed text-band-muted">{t.features.crm.subtitle}</p>
      </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {VISTAS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-mono border transition-colors ${
                active === i
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-surface text-muted border-border hover:text-foreground'
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

      {/* El screenshot va en un marco duro del color de la banda, no en una
          card con sombra: sobre cyan una caja gris se vería pegada encima. */}
      <div className="border-2 border-band-fg">
        <div className="flex items-center gap-2 border-b-2 border-band-fg px-4 py-3">
          <span className="font-mono text-xs text-band-muted">
            crm.omona.tech — {VISTAS[active].label}
          </span>
        </div>
          {/* image */}
          {VISTAS.map((vista, i) => (
            <div key={vista.video} className={i === active ? 'block' : 'hidden'}>
              <LoopVideo
                name={vista.video}
                alt={vista.alt}
                active={i === active}
                className="block h-auto w-full"
              />
            </div>
          ))}
        </div>

      {/* Caption */}
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-band-muted">
        {VISTAS[active].caption}
      </p>

        {/* Bullets */}
      <div className="mt-16 grid max-w-5xl gap-8 sm:grid-cols-2">
          {[
            t.features.crm.bullet1,
            t.features.crm.bullet2,
            t.features.crm.bullet3,
            t.features.crm.bullet4,
          ].map((b, i) => (
            <div key={i} className="flex gap-3 border-t border-band-fg/25 pt-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-band-fg" />
              <p className="text-sm leading-relaxed text-band-muted">{b}</p>
            </div>
          ))}
      </div>
    </Band>
  );
}
