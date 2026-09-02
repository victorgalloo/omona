'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { ProofMarquee } from './motion/ProofMarquee';
import { Band } from './motion/Band';
import { RevealText } from './motion/RevealText';

/**
 * ManyChat abre con cuatro creadores, su cara y una cifra de dinero. Omona
 * todavía no tiene testimonios que pueda sostener, y una cifra inventada es
 * peor que ninguna: se nota y quema la confianza que la landing acaba de ganar.
 *
 * Así que la prueba aquí es de otro tipo, y es más fuerte para un producto que
 * nadie conoce: en vez de pedirle al visitante que crea, se le da el agente para
 * que lo interrogue él. Cuando existan citas reales se llenan en
 * `t.proof.testimonials` y el marquee toma el lugar principal sin tocar esto.
 */
export function LandingProof() {
  const t = useT();
  const testimonials = t.proof.testimonials;

  return (
    <Band tone="lime" id="prueba" className="py-24 sm:py-32">
      <div className="max-w-3xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {t.proof.sectionLabel}
        </p>
        <RevealText
          as="h2"
          lines={[t.proof.heading]}
          className="mb-5 text-display-sm font-bold text-band-fg"
        />
        <p className="text-xl leading-relaxed text-band-muted">{t.proof.subheading}</p>
      </div>

      {testimonials.length > 0 && (
        <div className="mt-16">
          <ProofMarquee items={testimonials} />
        </div>
      )}

      {/* Sin caja: el bloque se apoya en una regla dura, no en un fondo propio */}
      <div className="mt-16 border-t border-band-fg/25 pt-12 md:mt-20 md:pt-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <h3 className="mb-4 max-w-[16ch] text-display-sm font-bold text-band-fg">
              {t.proof.demoTitle}
            </h3>
            <p className="max-w-xl text-lg leading-relaxed text-band-muted">{t.proof.demoBody}</p>
          </div>

          <div className="md:text-right">
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2.5 bg-ink px-8 py-4 text-base font-semibold text-bone transition-transform hover:-translate-y-0.5"
            >
              {t.proof.demoCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-4 font-mono text-xs text-band-muted">{t.proof.demoNote}</p>
          </div>
        </div>
      </div>
    </Band>
  );
}
