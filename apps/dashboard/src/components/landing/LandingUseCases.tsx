'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Stethoscope, Building2, GraduationCap, Wrench, ArrowRight } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { RevealText } from './motion/RevealText';

type LucideIcon = React.ComponentType<{ className?: string }>;

const ICONS: LucideIcon[] = [Wrench, Stethoscope, Building2, GraduationCap];

export function LandingUseCases() {
  const t = useT();
  return (
    <Band tone="neutral" id="casos" className="py-24 sm:py-32">
      {/* Header */}
      <div className="mb-16 max-w-3xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {t.useCases.sectionLabel}
        </p>
        <RevealText
          as="h2"
          lines={[t.useCases.heading]}
          className="mb-5 text-display-sm font-bold text-band-fg"
        />
        <p className="text-xl leading-relaxed text-band-muted">{t.useCases.subheading}</p>
      </div>

      {/* Rejilla de casos: separada por reglas duras, sin cajas */}
      <div className="grid gap-x-12 sm:grid-cols-2">
          {t.useCases.items.map((useCase, index) => {
            const Icon = ICONS[index];
            return (
              <motion.div
                key={useCase.tag}
              >
                <Link
                  href={useCase.href}
                  className="group block border-t-2 border-band-fg py-8 transition-opacity hover:opacity-70"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-band-fg" />
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-band-muted">
                      {useCase.tag}
                    </span>
                  </div>

                  <h3 className="mb-3 text-2xl font-bold text-band-fg">{useCase.title}</h3>

                  <p className="mb-5 text-sm leading-relaxed text-band-muted">
                    {useCase.description}
                  </p>

                  <div className="mb-5 border-l-2 border-band-fg/30 py-1 pl-4">
                    <p className="mb-1 font-mono text-xs text-band-muted">
                      {t.useCases.clientLabel}
                    </p>
                    <p className="text-sm text-band-fg">{useCase.example}</p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-xs text-band-fg">{useCase.metrics}</p>
                    <ArrowRight className="h-4 w-4 shrink-0 text-band-fg transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
      </div>
    </Band>
  );
}
