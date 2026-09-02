'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * Brillo que recorre un botón en reposo, sin necesidad de hover.
 *
 * Es la aplicación más barata de la regla que rige toda la landing: nunca debe
 * haber una banda completamente quieta una vez revelada. ManyChat sostiene esa
 * sensación con catorce videos en loop; aquí, en los CTAs, basta con esto.
 *
 * El padre debe ser `relative overflow-hidden`, y el contenido ir en un
 * elemento `relative` para quedar por encima del brillo.
 */
export function Shimmer({ className = 'bg-ink/10' }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <motion.span
      aria-hidden
      className={`absolute inset-y-0 w-24 ${className}`}
      animate={{ x: ['-120%', '520%'] }}
      transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }}
    />
  );
}
