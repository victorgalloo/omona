'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { RevealText } from './motion/RevealText';

/**
 * Los cuatro módulos se numeran pero no se dibujan como pasos: no son una
 * secuencia temporal —eso es LandingHowItWorks— sino piezas que corren a la vez
 * sobre la misma conversación. Por eso rejilla y no hilo vertical.
 */
export function LandingOfferStack() {
  const t = useT();
  const reduced = useReducedMotion();

  return (
    <Band tone="neutral" id="sistema" className="py-28 sm:py-40">
      <div className="mb-20 max-w-3xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {t.offerStack.sectionLabel}
        </p>
        <RevealText
          as="h2"
          lines={[t.offerStack.heading]}
          className="mb-5 text-display font-bold text-band-fg"
        />
        <p className="text-xl text-band-muted">{t.offerStack.subheading}</p>
      </div>

      <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2">
        {t.offerStack.modules.map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="border-t-2 border-band-fg pt-6"
          >
            <span className="mb-4 block font-mono text-sm text-band-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mb-3 text-display-sm font-bold text-band-fg">{mod.title}</h3>
            <p className="text-base leading-relaxed text-band-muted">{mod.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 border-t border-band-fg/25 pt-10">
        <p className="mb-6 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {t.offerStack.bonusLabel}
        </p>
        <ul className="grid gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.offerStack.bonuses.map((bonus, i) => (
            <motion.li
              key={bonus}
              initial={reduced ? undefined : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 text-base text-band-fg"
            >
              <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-band-accent" />
              <span>{bonus}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Band>
  );
}
