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
 * Es lo que separa a ManyChat de la landing de IA promedio. En su DOM hay 14
 * videos en loop, un marquee de 40s y hasta una flecha con animación propia:
 * siempre hay algo moviéndose. Nuestra versión anterior sólo tenía animación de
 * entrada — revelaba y se quedaba muerta — y por eso el negro con tipografía
 * blanca enorme leía como el fondo por defecto de cualquier producto de IA.
 *
 * Aquí hay tres capas continuas: el halo que respira, el loop del producto, y
 * las burbujas de ambiente. Las tres se apagan con `prefers-reduced-motion`.
 */

/** Mensajes que suben y se desvanecen: la sensación de que no paran de entrar. */
const AMBIENTE = [
  { text: '¿Manejan tubería de cobre?', delay: 0, x: '4%' },
  { text: '¿A cuánto el bulto?', delay: 2.6, x: '46%' },
  { text: '¿Abren el domingo?', delay: 5.1, x: '22%' },
  { text: '¿Facturan?', delay: 7.4, x: '62%' },
];

function BurbujasDeAmbiente() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {AMBIENTE.map((m) => (
        <motion.span
          key={m.text}
          className="absolute whitespace-nowrap border border-band-fg/20 px-3 py-1.5 font-mono text-xs text-band-fg/50"
          style={{ left: m.x, bottom: 0 }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.9, 0.9, 0], y: [0, -260, -300, -340] }}
          transition={{
            duration: 9,
            times: [0, 0.15, 0.75, 1],
            repeat: Infinity,
            delay: m.delay,
            ease: 'linear',
          }}
        >
          {m.text}
        </motion.span>
      ))}
    </div>
  );
}

export function LandingHero() {
  const t = useT();
  const reduced = useReducedMotion();

  return (
    <Band tone="contrast" wipe={false} className="min-h-screen flex items-center overflow-hidden">
      {/* Capa 1 — el halo respira y se desplaza. Nunca está quieto. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-[12%] top-[6%] -z-10 h-[560px] w-[560px] rounded-full blur-[140px]"
        style={{ background: 'var(--neon-lime)' }}
        animate={reduced ? { opacity: 0.16 } : { opacity: [0.12, 0.22, 0.12], x: [0, 70, 0], y: [0, 40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[460px] w-[460px] rounded-full blur-[140px]"
        style={{ background: 'var(--electric-blue)' }}
        animate={reduced ? { opacity: 0.14 } : { opacity: [0.16, 0.08, 0.16], x: [0, -60, 0], y: [0, -50, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Capa 3 — ambiente. Va detrás del contenido pero delante del halo. */}
      {!reduced && <BurbujasDeAmbiente />}

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
              {/* El CTA tampoco se queda quieto. */}
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

        {/* Capa 2 — el producto, contestando de verdad. */}
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
