'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

/**
 * Una banda de color a sangre completa: la sección ES el color.
 *
 * Sustituye al patrón de card (`rounded-2xl + border + bg-surface + shadow`)
 * que hacía que todo se viera como una caja gris flotando sobre blanco. Aquí
 * el contenido va directo sobre el color, sin caja y sin sombra.
 *
 * Cada tono trae su color de texto obligatorio y lo publica como variables CSS
 * (`--band-fg`, `--band-muted`, `--band-accent`) en su propio envoltorio. Los
 * hijos escriben `text-band`, `border-band` o `text-band-muted` y heredan el par
 * correcto: no hay forma de poner lima sobre hueso por accidente, que es
 * exactamente el error que la paleta fosforescente invita a cometer.
 *
 * `neutral` y `contrast` siguen al tema; los tonos de neón son pigmento fijo.
 */
export type BandTone =
  | 'neutral'
  | 'contrast'
  | 'lime'
  | 'yellow'
  | 'cyan'
  | 'magenta'
  | 'orange'
  | 'blue';

/**
 * Cada tono publica el color en dos formas:
 *  - `--band-bg` / `--band-fg`: para usarlo directo en `style` o en CSS.
 *  - `--band-bg-rgb` / `--band-fg-rgb`: canales sueltos, que es lo único que
 *    deja a Tailwind aplicar el modificador de opacidad (`border-band-fg/25`).
 *    Con la forma plana lo descarta en silencio.
 */
type BandVars = {
  '--band-bg': string;
  '--band-fg': string;
  '--band-bg-rgb': string;
  '--band-fg-rgb': string;
  '--band-muted': string;
  '--band-accent': string;
};

export const BAND_TONES: Record<BandTone, BandVars> = {
  // Sigue el tema: hueso en claro, negro en oscuro.
  neutral: {
    '--band-bg': 'var(--background)',
    '--band-fg': 'var(--foreground)',
    '--band-bg-rgb': 'var(--background-rgb)',
    '--band-fg-rgb': 'var(--foreground-rgb)',
    '--band-muted': 'var(--muted)',
    '--band-accent': 'var(--accent-green)',
  },
  // El inverso del tema: negro brilloso en claro, hueso en oscuro.
  contrast: {
    '--band-bg': 'var(--foreground)',
    '--band-fg': 'var(--background)',
    '--band-bg-rgb': 'var(--foreground-rgb)',
    '--band-fg-rgb': 'var(--background-rgb)',
    '--band-muted': 'rgb(var(--background-rgb) / 0.62)',
    '--band-accent': 'var(--neon-lime)',
  },
  // Pigmento fijo. Texto negro en todos: verificado en check-contrast.mjs.
  lime: neon('--neon-lime'),
  yellow: neon('--neon-yellow'),
  cyan: neon('--neon-cyan'),
  magenta: neon('--neon-magenta'),
  orange: neon('--neon-orange'),
  // La única banda de neón con texto blanco (5.91:1).
  blue: {
    '--band-bg': 'var(--electric-blue)',
    '--band-fg': '#FFFFFF',
    '--band-bg-rgb': 'var(--electric-blue-rgb)',
    '--band-fg-rgb': '255 255 255',
    '--band-muted': 'rgb(255 255 255 / 0.74)',
    '--band-accent': 'var(--neon-lime)',
  },
};

function neon(token: string): BandVars {
  return {
    '--band-bg': `var(${token})`,
    '--band-fg': 'var(--ink)',
    '--band-bg-rgb': `var(${token}-rgb)`,
    '--band-fg-rgb': 'var(--ink-rgb)',
    '--band-muted': 'rgb(var(--ink-rgb) / 0.66)',
    '--band-accent': 'var(--ink)',
  };
}

export function Band({
  tone = 'neutral',
  id,
  className = '',
  innerClassName = '',
  /** Ancho del contenido. `full` deja al hijo controlarlo todo. */
  width = 'default',
  /** El color barre de izquierda a derecha al entrar. Apágalo en el héroe. */
  wipe = true,
  children,
}: {
  tone?: BandTone;
  id?: string;
  className?: string;
  innerClassName?: string;
  width?: 'default' | 'narrow' | 'wide' | 'full';
  wipe?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // `once` porque una banda que se despinta al subir se siente rota.
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const animate = wipe && !reduced;

  const inner =
    width === 'full'
      ? innerClassName
      : `mx-auto px-5 sm:px-8 ${
          width === 'narrow' ? 'max-w-3xl' : width === 'wide' ? 'max-w-7xl' : 'max-w-6xl'
        } ${innerClassName}`;

  return (
    <section
      ref={ref}
      id={id}
      data-band={tone}
      style={BAND_TONES[tone] as React.CSSProperties}
      className={`relative isolate text-band ${className}`}
    >
      {/* El color va en su propia capa para poder barrerlo sin mover el
          contenido — animar el background del <section> no se puede escalonar. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 bg-band-bg"
        initial={animate ? { clipPath: 'inset(0 100% 0 0)' } : false}
        animate={animate && inView ? { clipPath: 'inset(0 0% 0 0)' } : undefined}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className={inner}>{children}</div>
    </section>
  );
}

/**
 * Regla horizontal del color del texto de la banda. Es el recurso que
 * reemplaza al borde de las cards: separa igual y no flota.
 */
export function BandRule({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`h-px w-full bg-band-fg opacity-20 ${className}`} />;
}

/** Etiqueta mono de sección, en el gris de la banda. */
export function BandLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-sm text-band-muted">{children}</p>;
}
