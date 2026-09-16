'use client';

import { ArrowRight } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';

/**
 * ══ LA SECCIÓN QUE CARGA LA PÁGINA ══════════════════════════════
 *
 * La portada anterior dedicaba seis bloques —features, CRM embebido,
 * antes/después, stats, casos de uso— a una sola idea: que el agente
 * contesta. Contestar es la parte visible del producto y es la que dice
 * hacer cualquier chatbot de suscripción, así que insistir ahí obligaba a
 * competir en precio contra herramientas que cuestan veinte dólares.
 *
 * El ciclo completo no lo tiene ninguna de esas: prospección con
 * investigación real, seguimiento con reloj, cierre con la objeción
 * identificada, y propuestas que salen de la conversación. Por eso esta
 * sección va arriba y ocupa el espacio que ocupaba el chat.
 *
 * El riel de etapas de arriba existe para que la palabra "ciclo" se entienda
 * en un vistazo, antes de leer nada. Es marcado estático — ni carrusel ni
 * pestañas — porque las cuatro etapas se leen, no se navegan.
 */
export function HomeCycle() {
  const t = useT();
  const c = t.home.cycle;

  return (
    <Section id="ciclo">
      <SectionHeader label={c.label} title={c.title} subtitle={c.subtitle} />

      {/* Riel de etapas. En móvil se parte en dos filas de dos y las flechas
          desaparecen: una flecha que apunta al renglón de abajo miente. */}
      <Reveal className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2.5">
        {c.stages.map((stage, i) => (
          <span key={stage.id} className="flex items-center gap-3">
            <a
              href={`#${stage.id}`}
              className="inline-flex items-center gap-2 border border-border px-3.5 py-2 text-[13px] text-muted-foreground transition-colors hover:border-border-hover hover:text-foreground"
            >
              <span className="font-mono text-[11px] text-accent-green">{stage.index}</span>
              {stage.name}
            </a>
            {i < c.stages.length - 1 && (
              <ArrowRight aria-hidden className="hidden h-3.5 w-3.5 shrink-0 text-muted sm:block" />
            )}
          </span>
        ))}
      </Reveal>

      <div className="mt-6">
        {c.stages.map((stage) => (
          <Reveal
            key={stage.id}
            as="section"
            id={stage.id}
            className="grid gap-6 border-t border-hairline py-12 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-14"
          >
            <div>
              <span className="font-mono text-[11px] text-accent-green">{stage.index}</span>
              <h3 className="mt-2 text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-none tracking-[-0.03em] text-foreground">
                {stage.name}
              </h3>
              <p className="mt-2.5 font-mono text-xs text-muted">{stage.kicker}</p>
            </div>

            <div>
              <p className="max-w-2xl text-[19px] font-medium leading-snug tracking-[-0.015em] text-foreground">
                {stage.headline}
              </p>

              <ul className="mt-6 space-y-3.5">
                {stage.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3.5 text-[14.5px] leading-relaxed text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.62em] h-px w-4 shrink-0 bg-border-hover"
                    />
                    <Emphasis text={bullet} className="max-w-2xl" />
                  </li>
                ))}
              </ul>

              <p className="mt-7 inline-flex flex-wrap items-center gap-2.5 border border-hairline bg-surface px-3.5 py-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {c.outputLabel}
                </span>
                <span className="text-[13px] font-medium text-foreground">{stage.output}</span>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
