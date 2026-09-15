'use client';

import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';

/**
 * Qué mide. La fórmula va como bloque de código monoespaciado a propósito:
 * es una resta de dos renglones y verla escrita como cálculo —y no como
 * párrafo— es lo que la vuelve un argumento de dirección en vez de una
 * promesa de marketing.
 */
export function HomeMeasure() {
  const t = useT();
  const m = t.home.measure;

  return (
    <Section id="medicion">
      <SectionHeader label={m.label} title={m.title} subtitle={m.subtitle} />

      <div className="rule-grid mt-12 grid sm:grid-cols-2">
        {m.metrics.map((metric, i) => (
          <Reveal key={metric.name} delay={i * 60} className="p-6 sm:p-8">
            <h3 className="mb-2.5 text-[16px] font-medium tracking-[-0.01em] text-foreground">
              {metric.name}
            </h3>
            <p className="text-[14px] leading-relaxed text-muted-foreground">{metric.detail}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          {m.moneyLabel}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <pre className="px-5 py-5 font-mono text-[12px] leading-[1.9] text-foreground sm:px-6 sm:text-[13px]">
            {m.moneyFormula}
          </pre>
        </div>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {m.moneyNote}
        </p>
      </Reveal>
    </Section>
  );
}
