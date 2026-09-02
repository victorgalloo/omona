'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Band } from './Band';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export type BeforeAfterCopy = {
  sectionLabel: string;
  heading: string;
  subheading: string;
  beforeKicker: string;
  beforeTitle: string;
  beforeItems: string[];
  afterKicker: string;
  afterTitle: string;
  afterItems: string[];
};

/**
 * El dispositivo más fuerte de la landing de ManyChat (`.ba_wrap`, scrub: true),
 * llevado a la paleta nueva: ya no se desliza una tarjeta sobre otra — el color
 * lima **toma la pantalla** encima del negro conforme bajas.
 *
 * El visitante ejecuta la transformación con su propio dedo en vez de leerla, y
 * como las dos capas son bandas a sangre y no cards, el cambio se siente en toda
 * la pantalla y no dentro de una caja.
 */
export function BeforeAfterScrub({ copy }: { copy: BeforeAfterCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const scrollYProgress = useScrollProgress(ref);

  // La capa lima entra desde la derecha y se detiene justo en la mitad, que es
  // donde termina la columna del "antes". Antes paraba en 34% y el borde
  // cortaba el titular a media palabra.
  const clip = useTransform(scrollYProgress, [0.08, 0.72], ['inset(0 0 0 100%)', 'inset(0 0 0 50%)']);

  if (reduced) {
    return (
      <Band tone="contrast" id="antes-despues" className="py-24">
        <Header copy={copy} />
        <div className="mt-16 grid gap-14 md:grid-cols-2">
          <Side kicker={copy.beforeKicker} title={copy.beforeTitle} items={copy.beforeItems} />
          <Side kicker={copy.afterKicker} title={copy.afterTitle} items={copy.afterItems} after />
        </div>
      </Band>
    );
  }

  return (
    <>
      <Band tone="contrast" id="antes-despues" className="pt-24 pb-10" wipe={false}>
        <Header copy={copy} />
      </Band>

      {/* 200vh de recorrido: es lo que le da a la toma de color espacio para leerse */}
      <div ref={ref} className="relative h-[200vh] bg-ink">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Capa negra: el antes */}
          <div className="absolute inset-0 bg-ink">
            <div className="mx-auto flex h-full max-w-6xl items-center px-5 sm:px-8">
              <div className="w-full md:w-1/2 md:pr-10">
                <Side
                  kicker={copy.beforeKicker}
                  title={copy.beforeTitle}
                  items={copy.beforeItems}
                  fg="text-bone"
                  muted="text-bone/60"
                />
              </div>
            </div>
          </div>

          {/* Capa lima: el después, que barre encima */}
          <motion.div className="absolute inset-0 bg-neon-lime" style={{ clipPath: clip }}>
            <div className="mx-auto flex h-full max-w-6xl items-center px-5 sm:px-8">
              <div className="ml-auto w-full md:w-1/2 md:pl-10">
                <Side
                  kicker={copy.afterKicker}
                  title={copy.afterTitle}
                  items={copy.afterItems}
                  after
                  fg="text-ink"
                  muted="text-ink/70"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function Header({ copy }: { copy: BeforeAfterCopy }) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 font-mono text-sm text-band-muted">{copy.sectionLabel}</p>
      <h2 className="mb-5 text-display-sm font-bold text-band-fg">{copy.heading}</h2>
      <p className="text-xl text-band-muted">{copy.subheading}</p>
    </div>
  );
}

function Side({
  kicker,
  title,
  items,
  after = false,
  fg = 'text-band-fg',
  muted = 'text-band-muted',
}: {
  kicker: string;
  title: string;
  items: string[];
  after?: boolean;
  fg?: string;
  muted?: string;
}) {
  return (
    <div>
      <p className={`mb-4 font-mono text-sm uppercase tracking-[0.16em] ${muted}`}>{kicker}</p>
      <h3 className={`mb-9 text-display-sm font-bold ${fg}`}>{title}</h3>
      <ul>
        {items.map((item) => (
          <li
            key={item}
            className={`flex gap-4 border-t py-4 ${after ? 'border-current/20' : 'border-current/15'} ${fg}`}
          >
            {after ? (
              <Check className="mt-1 h-5 w-5 shrink-0" aria-hidden />
            ) : (
              <X className="mt-1 h-5 w-5 shrink-0 opacity-50" aria-hidden />
            )}
            <span className={`text-lg leading-snug ${after ? fg : muted}`}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
