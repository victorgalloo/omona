'use client';

import { Check, Minus } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';

/**
 * Los límites, en la portada y no escondidos en un FAQ.
 *
 * El comprador B2B que vale la pena los va a descubrir en la semana dos de
 * todos modos. Descubrirlos entonces, después de haberlos leído aquí, gana
 * confianza; descubrirlos de golpe la quema. El correo personal y el WhatsApp
 * saliente desde el teléfono son huecos reales del producto y están escritos
 * como huecos, no como matices.
 */
export function HomeScope() {
  const t = useT();
  const s = t.home.scope;

  return (
    <Section id="alcance">
      <SectionHeader label={s.label} title={s.title} subtitle={s.subtitle} />

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-accent-green">
            {s.doTitle}
          </p>
          <ul className="space-y-4">
            {s.does.map((item) => (
              <li key={item} className="flex gap-3.5 border-t border-hairline pt-4">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                <span className="text-[14.5px] leading-relaxed text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {s.dontTitle}
          </p>
          <ul className="space-y-4">
            {s.donts.map((item) => (
              <li key={item.title} className="flex gap-3.5 border-t border-hairline pt-4">
                <Minus aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                <div>
                  <h3 className="mb-1 text-[14.5px] font-medium text-foreground">{item.title}</h3>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">
                    <Emphasis text={item.detail} />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
