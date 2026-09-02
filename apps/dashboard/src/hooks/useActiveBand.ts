'use client';

import { useEffect, useState } from 'react';
import type { BandTone } from '@/components/landing/motion/Band';

/**
 * Devuelve el tono de la <Band> que está justo debajo de la barra de navegación.
 *
 * El nav es fijo y las bandas cambian de color a lo largo del scroll, así que
 * un color de texto fijo se vuelve invisible en cuanto pasa sobre una banda del
 * mismo tono — que es exactamente lo que pasaba con `text-foreground` sobre el
 * héroe negro. Con esto el nav adopta el par fondo/texto de la banda que tiene
 * detrás, igual que hace ManyChat.
 *
 * Usa elementsFromPoint en vez de IntersectionObserver porque la pregunta real
 * no es "qué sección es visible" sino "qué hay pintado bajo este píxel".
 */
export function useActiveBand(probeY = 32): BandTone {
  const [tone, setTone] = useState<BandTone>('neutral');

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const stack = document.elementsFromPoint(Math.round(window.innerWidth / 2), probeY);
      const band = stack.find((el) => el instanceof HTMLElement && el.dataset.band);
      const next = (band as HTMLElement | undefined)?.dataset.band as BandTone | undefined;
      if (next) setTone((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [probeY]);

  return tone;
}
