'use client';

import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { LoopVideo } from './motion/LoopVideo';
import { Shimmer } from './motion/Shimmer';

/**
 * Regla del héroe: **nunca puede haber un fotograma sin movimiento.**
 *
 * Todo el movimiento continuo de aquí —el halo, las burbujas— es CSS, no
 * `motion`. Dos razones. Una, que las animaciones CSS las mueve el compositor y
 * siguen corriendo aunque el hilo principal esté ocupado, mientras que `motion`
 * depende de requestAnimationFrame. Y dos, que el estado de una animación CSS se
 * lee del estilo computado, así que se puede comprobar que está corriendo sin
 * necesidad de verla — con rAF no, y eso costó tres rondas de diagnóstico ciego.
 *
 * `motion` se queda sólo con las animaciones de entrada, que ocurren una vez.
 */

/** Mensajes que entran sin parar. Las clases y los delays son CSS puro. */
const AMBIENTE = [
  { text: '¿Manejan tubería de cobre?', delay: '0s', left: '2%', top: '58%' },
  { text: '¿A cuánto el bulto?', delay: '2.4s', left: '38%', top: '72%' },
  { text: '¿Abren el domingo?', delay: '4.8s', left: '14%', top: '80%' },
  { text: '¿Facturan?', delay: '7.1s', left: '52%', top: '64%' },
];

function BurbujasDeAmbiente() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
      {AMBIENTE.map((m) => (
        <span
          key={m.text}
          className="anim-burbuja absolute whitespace-nowrap border border-band-fg/35 bg-band-bg/70 px-3 py-1.5 font-mono text-xs text-band-fg/80 backdrop-blur-sm"
          style={{ left: m.left, top: m.top, animationDelay: m.delay }}
        >
          {m.text}
        </span>
      ))}
    </div>
  );
}

export function LandingHero() {
  const t = useT();
  const reduced = useReducedMotion();

  return (
    <Band tone="contrast" wipe={false} className="min-h-screen flex items-center overflow-hidden">
      {/* Halo: recorrido amplio y ciclo corto. El anterior se movía 70px en 16s
          detrás de un desenfoque de 140px — corría, pero no se veía. */}
      <div
        aria-hidden
        className="anim-halo pointer-events-none absolute -left-[15%] top-0 -z-10 h-[46vw] w-[46vw] rounded-full blur-[120px]"
        style={{ background: 'var(--neon-lime)', ['--halo-dur' as string]: '11s' }}
      />
      <div
        aria-hidden
        className="anim-halo pointer-events-none absolute -right-[10%] bottom-0 -z-10 h-[40vw] w-[40vw] rounded-full blur-[120px]"
        style={{
          background: 'var(--electric-blue)',
          ['--halo-dur' as string]: '15s',
          animationDirection: 'reverse',
        }}
      />

      <BurbujasDeAmbiente />

      <div className="relative grid w-full items-center gap-14 py-24 lg:grid-cols-[1fr_1fr]">
        <div>
          <h1 className="mb-6 text-display-lg font-bold text-band-fg">
            {t.hero.tagline.split(' ').map((word, i) => (
              // El espacio va como margen, no como texto: dentro de un
              // inline-block con overflow hidden se colapsa y las palabras
              // salían pegadas ("11:40p.m.Alguiencontesta.").
              <span key={i} className="mr-[0.24em] inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduced ? false : { y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.85, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            id="hero-description"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 max-w-lg text-xl leading-snug text-band-muted"
          >
            {t.hero.subtagline}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start gap-4"
          >
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden bg-neon-lime px-9 py-4 text-base font-semibold text-ink"
            >
              <Shimmer />
              <span className="relative">{t.hero.cta}</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://api.whatsapp.com/send?phone=529849800629"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-band-muted underline decoration-band-fg/30 underline-offset-4 transition-colors hover:text-band-fg"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {t.hero.whatsappLink}
            </a>
          </motion.div>
        </div>

        {/* El producto, contestando de verdad. */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block"
        >
          <div className="overflow-hidden border-2 border-band-fg/70">
            <LoopVideo
              name="chat-respondiendo"
              alt={t.hero.chatContext}
              priority
              className="block h-auto w-full"
            />
          </div>
        </motion.div>
      </div>
    </Band>
  );
}
