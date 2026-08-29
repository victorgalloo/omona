'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useT } from '@/contexts/LanguageContext';

type Step = { title: string; detail: string };

function StepItem({ step, isLast, number }: { step: Step; isLast: boolean; number: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });

  const opacity  = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 1]);
  const xNumber  = useTransform(scrollYProgress, [0, 0.5], [-50, 0]);
  const xContent = useTransform(scrollYProgress, [0, 0.5], [30, 0]);

  return (
    <motion.div ref={ref} style={{ opacity }} className="relative pb-20 last:pb-0">
      {/* Connecting line */}
      {!isLast && (
        <div className="absolute left-[52px] lg:left-[68px] top-28 bottom-0 w-px bg-border" />
      )}

      <div className="flex gap-8 lg:gap-16 items-start">
        {/* Number */}
        <motion.div style={{ x: xNumber }} className="shrink-0">
          <span className="text-[80px] lg:text-[120px] font-black leading-none font-mono block text-surface">
            {number}
          </span>
        </motion.div>

        {/* Content */}
        <motion.div style={{ x: xContent }} className="pt-4 lg:pt-8">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {step.title}
          </h3>
          <span className="inline-block text-base text-muted px-4 py-2 bg-surface rounded-full border border-border">
            {step.detail}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function LandingHowItWorks() {
  const t = useT();
  return (
    <section id="proceso" className="py-32 sm:py-48 px-4 sm:px-6 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <p className="text-muted text-sm font-mono mb-4">{t.howItWorks.sectionLabel}</p>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6">
            {t.howItWorks.heading}
          </h2>
          <p className="text-xl text-muted">
            {t.howItWorks.subheading}
          </p>
        </motion.div>

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
      </div>
    </section>
  );
}
