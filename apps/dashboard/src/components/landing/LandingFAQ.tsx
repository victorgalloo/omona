'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { RevealText } from './motion/RevealText';

/**
 * El FAQ vivía solo en el JSON-LD de page.tsx: Google lo leía y el visitante
 * no. Peor, ahí se afirmaban cosas que el copy de la página ya había dejado de
 * afirmar. Ahora las dos superficies salen del mismo `t.faq.items`.
 */
export function LandingFAQ() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band tone="contrast" id="preguntas" width="narrow" className="py-24 sm:py-32">
      <div className="mb-14">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {t.faq.sectionLabel}
        </p>
        <RevealText
          as="h2"
          lines={[t.faq.heading]}
          className="mb-5 text-display-sm font-bold text-band-fg"
        />
        <p className="text-lg text-band-muted">{t.faq.subheading}</p>
      </div>

        <ul className="divide-y divide-band-fg/20 border-y border-band-fg/20">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left transition-opacity hover:opacity-70"
                  >
                    <span className="text-lg font-medium text-band-fg sm:text-xl">{item.q}</span>
                    <Plus
                      aria-hidden
                      className={`mt-1 h-5 w-5 shrink-0 text-band-muted transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-base leading-relaxed text-band-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
      </ul>
    </Band>
  );
}
