'use client';

import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader, PullQuote } from './Section';
import { Reveal } from './Reveal';

/**
 * El diagnóstico, sin cifras.
 *
 * Tenemos números medidos —de nuestro propio pipeline— y no se publican a
 * propósito: exponen la operación, y presentados en una portada parecerían un
 * caso de éxito ajeno en vez de lo que son. Lo que sí se puede afirmar sin
 * inventar nada es la mecánica de la fuga, que además es lo que el visitante
 * reconoce en el suyo. Si algún día hay un caso de cliente con permiso para
 * publicarlo, va aquí y las cifras hacen el trabajo que hoy hace el texto.
 */
export function HomeLeak() {
  const t = useT();
  const l = t.home.leak;

  return (
    <Section id="diagnostico" rule={false}>
      <SectionHeader label={l.label} title={l.title} subtitle={l.body} />

      <div className="rule-grid mt-14 grid sm:grid-cols-2">
        {l.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 60} className="p-6 sm:p-8">
            <span className="mb-4 block font-mono text-xs text-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mb-2.5 text-[17px] font-medium tracking-[-0.01em] text-foreground">
              {item.title}
            </h3>
            <p className="text-[14px] leading-relaxed text-muted-foreground">{item.detail}</p>
          </Reveal>
        ))}
      </div>

      <PullQuote>{l.quote}</PullQuote>
    </Section>
  );
}
