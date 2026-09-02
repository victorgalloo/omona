'use client';

import { useEffect, type RefObject } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';

/**
 * Progreso de 0 a 1 del scroll a lo largo de un elemento alto: 0 cuando su
 * borde superior toca el del viewport, 1 cuando su borde inferior toca el
 * inferior. Es lo mismo que `useScroll({ target, offset })`.
 *
 * Existe porque `useScroll` con `target` no se re-engancha cuando el ref llega
 * un render después. La landing difería el ref con un flag `mounted` para que
 * midiera con layout ya resuelto, y el resultado era que el progreso se quedaba
 * clavado en 0: el antes/después nunca barría y los pasos de "cómo funciona"
 * se quedaban en opacidad 0.3. Medir a mano en el evento de scroll es explícito,
 * se puede depurar y no depende de cuándo decidió medir la librería.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Cuánto scroll cabe recorrer con el elemento en pantalla.
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) {
        // El elemento cabe entero: el progreso lo da su paso por el viewport.
        const span = window.innerHeight + rect.height;
        progress.set(Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span)));
        return;
      }
      progress.set(Math.min(1, Math.max(0, -rect.top / travel)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, progress]);

  return progress;
}
