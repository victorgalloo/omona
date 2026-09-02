'use client';

import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { RevealBlock } from './motion/RevealText';

/**
 * Cuatro hechos del producto, en tipografía grande y separados por reglas.
 * Antes era una rejilla de celdas con `gap-px bg-border`, que leía como cuatro
 * cards pegadas; ahora las cifras se sostienen solas sobre la banda.
 */
export function LandingStats() {
  const t = useT();

  return (
    <Band tone="neutral" className="py-20 sm:py-24">
      <div
        id="stats-section"
        aria-label="Que hace Omona, en cuatro hechos"
        className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {t.stats.map((stat, i) => (
          <RevealBlock key={stat.label} delay={i * 0.07} className="border-t-2 border-band-fg py-7">
            <p className="mb-2 text-3xl font-bold leading-none text-band-fg sm:text-4xl">
              {stat.value}
            </p>
            <p className="text-sm leading-relaxed text-band-muted">{stat.label}</p>
          </RevealBlock>
        ))}
      </div>
    </Band>
  );
}
