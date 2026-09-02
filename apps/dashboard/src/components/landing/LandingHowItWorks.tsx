'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { RevealText } from './motion/RevealText';

type Step = { title: string; detail: string };

/**
 * Antes esto ataba opacidad y desplazamiento al progreso de `useScroll` sobre
 * cada paso. Con el ref diferido un render, `useScroll` nunca se re-enganchaba
 * y los cuatro pasos se quedaban permanentemente en opacidad 0.3 — se veían
 * apagados y nadie entendía por qué. Un paso es un elemento corto: solo
 * necesita revelarse una vez, y `whileInView` hace justo eso sin listeners.
 */
function StepItem({ step, isLast, number }: { step: Step; isLast: boolean; number: string }) {
  const reduced = useReducedMotion();
  const reveal = {
    initial: reduced ? undefined : { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.5 } as const,
  };

  return (
    <div className="relative pb-20 last:pb-0">
      {/* Hilo que une los pasos */}
      {!isLast && (
        <div className="absolute left-[52px] top-28 bottom-0 w-px bg-band-fg/25 lg:left-[68px]" />
      )}

      <div className="flex gap-8 lg:gap-16 items-start">
        {/* Number */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0"
        >
          <span className="block font-mono text-[80px] font-black leading-none text-band-fg/15 lg:text-[120px]">
            {number}
          </span>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4 lg:pt-8"
        >
          <h3 className="mb-4 text-display-sm font-bold text-band-fg">
            {step.title}
          </h3>
          <span className="inline-block border border-band-fg/40 px-4 py-2 text-base text-band-muted">
            {step.detail}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export function LandingHowItWorks() {
  const t = useT();
  return (
    <Band tone="contrast" id="proceso" className="overflow-hidden py-28 sm:py-40">
      {/* Header */}
      <div className="mb-20 max-w-3xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {t.howItWorks.sectionLabel}
        </p>
        <RevealText
          as="h2"
          lines={[t.howItWorks.heading]}
          className="mb-5 text-display font-bold text-band-fg"
        />
        <p className="text-xl text-band-muted">{t.howItWorks.subheading}</p>
      </div>

        {/* Steps */}
        <div className="relative">
          {t.howItWorks.steps.map((step, index) => (
            <StepItem
              key={index}
              step={step}
              number={String(index + 1).padStart(2, '0')}
              isLast={index === t.howItWorks.steps.length - 1}
            />
          ))}
      </div>
    </Band>
  );
}
