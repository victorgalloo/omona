'use client';

import { Quote } from 'lucide-react';
import type { Testimonial } from '@/lib/i18n/types';

/**
 * Marquee infinito, el mismo recurso que ManyChat usa para sus creadores
 * (`testimonials-marquee-small 40s linear`). La lista se duplica para que el
 * ciclo cierre sin salto; la copia es `aria-hidden` para no repetir el texto a
 * un lector de pantalla. Se detiene al pasar el cursor para poder leerla.
 *
 * Cada cita se separa con una regla dura del color de la banda, no con una card.
 */
export function ProofMarquee({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <div className="group relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-band-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-band-bg to-transparent" />

      <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:animate-none">
        {items.map((item) => (
          <Card key={item.name} item={item} />
        ))}
        {items.map((item) => (
          <Card key={`dup-${item.name}`} item={item} duplicate />
        ))}
      </div>
    </div>
  );
}

function Card({ item, duplicate = false }: { item: Testimonial; duplicate?: boolean }) {
  return (
    <figure
      aria-hidden={duplicate || undefined}
      className="w-[340px] shrink-0 border-t-2 border-band-fg pt-5"
    >
      <Quote className="mb-4 h-5 w-5 text-band-muted" aria-hidden />
      <blockquote className="text-base leading-relaxed text-band-fg">{item.quote}</blockquote>
      <figcaption className="mt-5">
        <p className="text-sm font-semibold text-band-fg">{item.name}</p>
        <p className="font-mono text-xs text-band-muted">
          {item.business} · {item.city}
        </p>
        <p className="mt-2 font-mono text-sm font-semibold text-band-fg">{item.metric}</p>
      </figcaption>
    </figure>
  );
}
