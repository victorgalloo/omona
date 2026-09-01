'use client';

import { motion } from 'motion/react';
import { useT } from '@/contexts/LanguageContext';

export function LandingStats() {
  const t = useT();
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="border-t border-dashed border-border origin-left"
      />

      <div id="stats-section" aria-label="Estadisticas de rendimiento de Omona" className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden my-16">
        {t.stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-background p-8 lg:p-12 text-center"
          >
            <span className="text-5xl sm:text-6xl font-black text-foreground">{stat.value}</span>
            <p className="text-muted text-sm mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="border-t border-dashed border-border origin-left"
      />
    </section>
  );
}
