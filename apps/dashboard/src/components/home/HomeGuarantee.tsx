'use client';

import { useT } from '@/contexts/LanguageContext';
import { Section } from './Section';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';

/**
 * La garantía. Antes era una banda de neón lima a sangre — la interrupción
 * salía del color. Aquí sale del contraste: es el único bloque de la página
 * que invierte fondo y texto, y eso basta para que se lea como un alto.
 *
 * Las condiciones siguen al lado y no en letra chica al pie. Esconderlas
 * convertiría la garantía en un truco, que es lo contrario de lo que la hace
 * funcionar.
 */
export function HomeGuarantee() {
  const t = useT();
  const g = t.guarantee;

  return (
    <Section id="garantia">
      <Reveal className="overflow-hidden rounded-2xl bg-foreground text-background">
        <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:p-14">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-background/60">
              {g.sectionLabel}
            </p>
            <h2 className="mb-6 text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
              {g.heading}
            </h2>
            <p className="max-w-[62ch] text-[15.5px] leading-relaxed text-background/75">
              <Emphasis text={g.body} />
            </p>
          </div>

          <div className="rounded-xl border border-background/20 p-6 sm:p-7">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-background/60">
              {g.conditionsLabel}
            </p>
            <ol className="space-y-3.5">
              {g.conditions.map((condition, i) => (
                <li key={condition} className="flex gap-3.5 text-[14px] leading-relaxed">
                  <span className="font-mono text-[12px] text-background/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{condition}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-background/20 pt-5 text-[13px] leading-relaxed text-background/60">
              {g.note}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
