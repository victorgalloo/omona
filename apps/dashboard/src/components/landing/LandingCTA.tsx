'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { RevealText } from './motion/RevealText';
import { Shimmer } from './motion/Shimmer';

/** El cierre de la página, en la banda más caliente de la coreografía. */
export function LandingCTA() {
  const t = useT();

  return (
    <Band tone="orange" className="py-28 sm:py-40">
      <div className="max-w-4xl">
        <RevealText
          as="h2"
          lines={[t.cta.heading]}
          className="mb-6 text-display font-bold text-band-fg"
        />
        <p className="mb-12 max-w-2xl text-xl leading-relaxed text-band-muted">
          {t.cta.subheading}
        </p>

        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Link
            href="/signup"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden bg-ink px-9 py-4 text-base font-semibold text-bone transition-transform hover:-translate-y-0.5"
          >
            <Shimmer className="bg-bone/15" />
            <span className="relative">{t.cta.primary}</span>
            <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="https://api.whatsapp.com/send?phone=529849800629"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-band-fg px-8 py-4 text-base font-medium text-band-fg transition-colors hover:bg-band-fg hover:text-band-bg"
          >
            {t.cta.secondary}
          </a>
        </div>

        <p className="mt-8 font-mono text-sm text-band-muted">{t.cta.trust}</p>
      </div>
    </Band>
  );
}
