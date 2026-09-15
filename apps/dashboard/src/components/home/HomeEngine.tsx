'use client';

import { Zap, CalendarClock } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader, PullQuote } from './Section';
import { Reveal } from './Reveal';

/**
 * El ciclo 02 abierto a detalle.
 *
 * Va inmediatamente después del ciclo porque es el que sostiene la diferencia:
 * prospección, cierre y borradores se pueden aproximar con buenos prompts;
 * esto necesita estado, relojes y una regla sobre qué NO enseñar. Enseñar la
 * mecánica de esa decisión —cinco cohortes, dos relojes, una sola tarjeta— es
 * más convincente que cualquier adjetivo sobre lo inteligente que es.
 */
export function HomeEngine() {
  const t = useT();
  const e = t.home.engine;

  return (
    <Section id="motor">
      <SectionHeader label={e.label} title={e.title} subtitle={e.subtitle} />

      {/* Tabla de verdad, no una rejilla de tarjetas: son cinco filas con las
          mismas cuatro columnas y compararlas es justo la gracia. El scroll
          horizontal está acotado a este contenedor — el cuerpo de la página
          nunca se desplaza de lado. */}
      <Reveal className="mt-12 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[42rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              {[e.table.cohort, e.table.trigger, e.table.clock, e.table.goal].map((head) => (
                <th
                  key={head}
                  scope="col"
                  className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {e.cohorts.map((cohort, i) => {
              // El último renglón es la decisión de diseño, no un caso más:
              // se atenúa a propósito para que se lea como lo que es.
              const isIgnored = i === e.cohorts.length - 1;
              return (
                <tr
                  key={cohort.name}
                  className={`border-b border-hairline last:border-b-0 ${isIgnored ? 'text-muted' : ''}`}
                >
                  <th
                    scope="row"
                    className={`px-4 py-4 text-[14px] font-medium sm:px-5 ${
                      isIgnored ? 'text-muted' : 'text-foreground'
                    }`}
                  >
                    {cohort.name}
                  </th>
                  <td className="px-4 py-4 text-[13.5px] text-muted-foreground sm:px-5">
                    {cohort.trigger}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-[12px] text-muted sm:px-5">
                    {cohort.clock}
                  </td>
                  <td
                    className={`px-4 py-4 text-[13.5px] sm:px-5 ${
                      isIgnored ? 'text-muted' : 'text-foreground'
                    }`}
                  >
                    {cohort.goal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Reveal>

      <PullQuote>{e.quote}</PullQuote>

      {/* Dos relojes */}
      <Reveal className="mt-20">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          {e.clocks.label}
        </p>
      </Reveal>
      <div className="rule-grid grid lg:grid-cols-2">
        {e.clocks.items.map((clock, i) => {
          const Icon = i === 0 ? Zap : CalendarClock;
          return (
            <Reveal key={clock.name} delay={i * 80} className="p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <Icon aria-hidden className="h-4 w-4 text-accent-green" />
                <h3 className="text-[17px] font-medium text-foreground">{clock.name}</h3>
                <span className="rounded border border-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {clock.unit}
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-muted-foreground">{clock.detail}</p>
            </Reveal>
          );
        })}
      </div>

      {/* Una jugada a la vez + el manual como código */}
      <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {e.play.label}
          </p>
          <h3 className="mb-4 text-[21px] font-medium leading-snug tracking-[-0.02em] text-foreground">
            {e.play.title}
          </h3>
          <p className="mb-5 text-[14.5px] leading-relaxed text-muted-foreground">
            {e.play.detail}
          </p>
          <p className="border-t border-hairline pt-5 text-[14.5px] leading-relaxed text-foreground">
            {e.play.closing}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {e.guardrails.label}
          </p>
          <h3 className="mb-4 text-[21px] font-medium leading-snug tracking-[-0.02em] text-foreground">
            {e.guardrails.title}
          </h3>
          <p className="mb-8 text-[14.5px] leading-relaxed text-muted-foreground">
            {e.guardrails.detail}
          </p>
          <div className="rounded-xl border border-hairline bg-surface p-5 sm:p-6">
            <h4 className="mb-2.5 text-[15px] font-medium text-foreground">
              {e.guardrails.checksTitle}
            </h4>
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              {e.guardrails.checksDetail}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
