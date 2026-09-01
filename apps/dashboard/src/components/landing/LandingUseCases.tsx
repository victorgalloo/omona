'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Stethoscope, Building2, GraduationCap, Wrench, ArrowRight } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';

type LucideIcon = React.ComponentType<{ className?: string }>;

const ICONS: LucideIcon[] = [Wrench, Stethoscope, Building2, GraduationCap];

export function LandingUseCases() {
  const t = useT();
  return (
    <section id="casos" className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted text-sm font-mono mb-4"
          >
            {t.useCases.sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6"
          >
            {t.useCases.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            {t.useCases.subheading}
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          {t.useCases.items.map((useCase, index) => {
            const Icon = ICONS[index];
            return (
              <motion.div
                key={useCase.tag}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  href={useCase.href}
                  className="block border-t border-border pt-6 transition-colors hover:border-border-hover group"
                >
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 pb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 text-xs font-mono text-muted">{useCase.tag}.config</span>
                  </div>

                  <div className="p-6">
                    {/* Icon + title */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 flex items-center justify-center shrink-0 text-muted">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{useCase.title}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {useCase.description}
                    </p>

                    {/* Example message */}
                    <div className="border-l-2 border-border pl-4 py-1 mb-4">
                      <p className="text-xs font-mono text-muted mb-1">{t.useCases.clientLabel}</p>
                      <p className="text-sm text-foreground">{useCase.example}</p>
                    </div>

                    {/* Metrics + arrow */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono text-[#27C93F]">
                        {useCase.metrics}
                      </p>
                      <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
