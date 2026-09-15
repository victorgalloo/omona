'use client';

import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';

/**
 * Las seis semanas. Mismo copy que antes (`t.howItWorks`), otra forma: la
 * versión anterior dibujaba cifras de 120px con un hilo vertical y animaba
 * cada paso desde -40px en el eje X. Aquí son cuatro columnas separadas por
 * una regla, que es como se lee una línea de tiempo sin tener que moverla.
 */
export function HomeProcess() {
  const t = useT();
  const h = t.howItWorks;

  return (
    <Section id="proceso">
      <SectionHeader label={h.sectionLabel} title={h.heading} subtitle={h.subheading} />

      <div className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
        {h.steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 70} className="border-t-2 border-foreground pt-5">
            <span className="mb-4 block font-mono text-xs text-accent-green">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mb-2 pr-4 text-[15.5px] font-medium leading-snug text-foreground">
              {step.title}
            </h3>
            <p className="pr-4 text-[13.5px] leading-relaxed text-muted-foreground">
              {step.detail}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
