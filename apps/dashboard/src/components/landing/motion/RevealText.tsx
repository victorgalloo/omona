'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { ElementType, ReactNode, Ref } from 'react';

/**
 * Equivalente al SplitText de ManyChat sin traer GSAP: el texto sube desde
 * una máscara. Dispara una sola vez y nunca revierte — igual que su
 * `toggleActions: "play none none none"`; que el texto se vaya al hacer scroll
 * hacia arriba se siente roto.
 *
 * Recibe `lines` en vez de partir el texto en runtime: así el HTML servido ya
 * trae las líneas y no hay salto de layout ni trabajo de medición en el cliente.
 *
 * El observador va en el encabezado completo, con `useInView`, y no en cada
 * línea. Dos razones, las dos aprendidas rompiéndolo:
 *
 *  1. Si se observa el <span> que se mueve, el `overflow-hidden` de su máscara
 *     lo recorta: el IntersectionObserver mide 0% visible, nunca dispara y el
 *     texto se queda oculto para siempre.
 *  2. Poner `whileInView` en la máscara y propagar la variante al hijo tampoco
 *     funciona: la propagación por etiqueta de variante no llega cuando el
 *     padre no declara `variants`, y el resultado es el mismo texto invisible.
 *
 * Un `useInView` sobre el elemento sin recortar y un `animate` booleano no
 * dependen de ninguna de esas dos sutilezas.
 */
export function RevealText({
  lines,
  as: Tag = 'p',
  className = '',
  delay = 0,
  stagger = 0.08,
}: {
  lines: string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  if (reduced) {
    return <Tag className={className}>{lines.join(' ')}</Tag>;
  }

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : { y: '110%' }}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Versión para bloques arbitrarios (tarjetas, imágenes): sube y aparece.
 * Es el `fadeInUp 0.6s ease-out` de ManyChat, atado al viewport. Aquí sí
 * sirve `whileInView` porque nada recorta al elemento observado.
 */
export function RevealBlock({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
