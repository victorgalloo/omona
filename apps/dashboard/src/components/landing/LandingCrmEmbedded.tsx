'use client';

import { useState } from 'react';
import { useT } from '@/contexts/LanguageContext';
import { Check, Columns3, ListTodo, Users } from 'lucide-react';

const SHOTS = [
  {
    src: '/screenshots/twenty-kanban.png',
    alt: 'CRM Omona — pipeline de oportunidades en Kanban',
    icon: Columns3,
    label: 'Pipeline',
    caption: 'Oportunidades por etapa: New → Screening → Meeting → Proposal → Customer, con valor por columna y contacto responsable',
  },
  {
    src: '/screenshots/twenty-people.png',
    alt: 'CRM Omona — contactos de escuelas con su empresa y teléfono',
    icon: Users,
    label: 'Contactos',
    caption: 'Cada conversación del agente crea y enriquece el contacto: escuela, cargo, teléfono y correo, sin captura manual',
  },
  {
    src: '/screenshots/twenty-tasks.png',
    alt: 'CRM Omona — tareas generadas por el agente de IA',
    icon: ListTodo,
    label: 'Tareas',
    caption: 'El agente agenda las tareas de seguimiento con fecha límite para que tu equipo cierre, no solo registre',
  },
] as const;

export function LandingCrmEmbedded() {
  const t = useT();
  const [active, setActive] = useState(0);

  return (
    <section id="crm" className="py-24 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-muted font-mono text-sm mb-3">// crm-embebido</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t.features.crm.title}
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            {t.features.crm.subtitle}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {SHOTS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono border transition-colors ${
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

        {/* Screenshot in terminal chrome */}
        <div className="rounded-xl overflow-hidden border border-border bg-surface shadow-2xl">
          {/* traffic lights bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-surface-2 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="ml-3 font-mono text-xs text-muted">crm.omona.tech — {SHOTS[active].label}</span>
          </div>
          {/* image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={SHOTS[active].src}
            src={SHOTS[active].src}
            alt={SHOTS[active].alt}
            className="w-full h-auto block animate-in fade-in duration-300"
          />
        </div>

        {/* Caption */}
        <p className="text-center text-muted text-sm mt-6 max-w-2xl mx-auto">
          {SHOTS[active].caption}
        </p>

        {/* Bullets */}
        <div className="grid sm:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          {[
            t.features.crm.bullet1,
            t.features.crm.bullet2,
            t.features.crm.bullet3,
          ].map((b, i) => (
            <div key={i} className="flex gap-3">
              <Check className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
              <p className="text-muted text-sm leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
