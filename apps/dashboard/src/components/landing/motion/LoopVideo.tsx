'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useThemeName } from '@/hooks/useThemeName';

/**
 * Loop de producto rendido con Remotion (apps/video). Reglas:
 *
 * - Dos variantes por tema: un video es píxeles, no se adapta a `data-theme`.
 * - `poster` siempre, y `preload="none"`: el video no debe competir con el LCP.
 * - Solo reproduce cuando está en pantalla, vía IntersectionObserver.
 * - Con `prefers-reduced-motion` nunca se monta el <video>: se queda el poster.
 */
export function LoopVideo({
  name,
  alt,
  className = '',
  priority = false,
  active,
}: {
  /** Slug del archivo en /public/video, sin tema ni extensión. */
  name: string;
  alt: string;
  className?: string;
  /** Solo para el loop del héroe: precarga metadatos para que arranque antes. */
  priority?: boolean;
  /**
   * Para paneles donde conviven varios loops apilados (StickyFeatureSwap).
   * Sin esto los seis reproducían a la vez desde que el panel entraba en
   * pantalla, así que al llegar al bloque 3 su loop iba por el fotograma de
   * fundido —transparente por diseño— y el marco se veía vacío.
   * Cuando pasa a activo el video vuelve a 0 y arranca desde el principio.
   * Omitir el prop deja el comportamiento simple: reproduce si está visible.
   */
  active?: boolean;
}) {
  const theme = useThemeName();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const onScreen = useRef(false);

  // Reproduce sólo si está en pantalla Y (no hay control de activo, o está activo).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = (fromActivation: boolean) => {
      const shouldPlay = onScreen.current && active !== false;
      if (!shouldPlay) {
        el.pause();
        return;
      }
      // Reiniciar al activarse: el loop debe leerse entero, desde el principio.
      if (fromActivation) {
        try {
          el.currentTime = 0;
        } catch {
          /* aún sin metadatos: arrancará donde pueda */
        }
      }
      void el.play().catch(() => {
        /* autoplay bloqueado: se queda el poster, que es una imagen válida */
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        sync(false);
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    );

    observer.observe(el);
    sync(active === true);

    return () => observer.disconnect();
  }, [theme, active]);

  // Hasta saber el tema mostramos el poster claro: es el tema por omisión del sitio.
  const variant = `${name}-${theme ?? 'light'}`;
  const poster = `/video/${variant}.jpg`;

  if (reduced) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt={alt} className={className} loading="lazy" decoding="async" />;
  }

  return (
    <video
      ref={ref}
      key={variant}
      className={className}
      poster={poster}
      aria-label={alt}
      loop
      muted
      playsInline
      preload={priority ? 'metadata' : 'none'}
    >
      <source src={`/video/${variant}.webm`} type="video/webm" />
      <source src={`/video/${variant}.mp4`} type="video/mp4" />
    </video>
  );
}
