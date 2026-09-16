'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { CTA_PROYECTO } from '@/lib/cta';
import { Section } from './Section';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';

/** El cierre. Misma retícula del héroe, para que la página abra y cierre igual. */
export function HomeCta() {
  const t = useT();
  const c = t.cta;

  return (
    <Section className="relative overflow-hidden">
      <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground">
          {c.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          <Emphasis text={c.subheading} />
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={CTA_PROYECTO}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-7 py-3.5 text-[15px] font-medium text-background transition-opacity hover:opacity-90"
          >
            {c.primary}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <Link
            href="/servicios"
            className="inline-flex items-center justify-center rounded-lg border border-border px-7 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:border-border-hover hover:bg-surface"
          >
            {c.secondary}
          </Link>
        </div>

        <p className="mt-7 font-mono text-xs text-muted">{c.trust}</p>
      </Reveal>
    </Section>
  );
}
