'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { RevealText } from './motion/RevealText';

/**
 * Banda de neón a propósito: es el único punto de la página donde se asume un
 * riesgo con dinero, y tiene que leerse como una interrupción, no como una
 * sección más. Las condiciones van al lado y no en letra chica al pie —
 * esconderlas convertiría la garantía en un truco, que es justo lo contrario
 * de lo que hace que funcione.
 */
export function LandingGuarantee() {
  const t = useT();
  const reduced = useReducedMotion();

  return (
    <Band tone="lime" id="garantia" className="py-28 sm:py-36">
      <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
        {t.guarantee.sectionLabel}
      </p>

      <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <RevealText
            as="h2"
            lines={[t.guarantee.heading]}
            className="mb-8 text-display font-bold text-band-fg"
          />
          <p className="max-w-xl text-xl leading-snug text-band-fg/80">{t.guarantee.body}</p>
        </div>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-2 border-band-fg p-8"
        >
          <p className="mb-6 font-mono text-sm uppercase tracking-[0.16em] text-band-fg">
            {t.guarantee.conditionsLabel}
          </p>
          <ol className="space-y-4">
            {t.guarantee.conditions.map((condition, i) => (
              <li key={condition} className="flex gap-4 text-base text-band-fg">
                <span className="font-mono text-band-fg/55">{String(i + 1).padStart(2, '0')}</span>
                <span>{condition}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t border-band-fg/30 pt-5 text-sm leading-relaxed text-band-muted">
            {t.guarantee.note}
          </p>
        </motion.div>
      </div>
    </Band>
  );
}
