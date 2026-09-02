'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Band } from './Band';
import { LoopVideo } from './LoopVideo';
import { RevealText } from './RevealText';

export type StickyFeature = {
  /** Slug del loop en /public/video (sin tema ni extensión). */
  video: string;
  videoAlt: string;
  kicker: string;
  title: string;
  description: string;
};

/**
 * Réplica del `.features_item_component` de ManyChat: el panel de video queda
 * sticky y va cambiando conforme cada bloque de copy entra a la banda central.
 * Es la forma más económica de mostrar seis capacidades sin seis secciones.
 *
 * El bloque activo lo decide un `useInView` por bloque con un margen que
 * recorta el viewport a su banda central — el equivalente directo del
 * `start: "top center+=25%"` / `end: "bottom center+=25%"` de ManyChat.
 * Se intentó primero con `useScroll` + `useMotionValueEvent` sobre la columna
 * de copy y el evento nunca actualizaba el estado, así que el panel se quedaba
 * congelado en el primer video.
 */
export function StickyFeatureSwap({
  sectionLabel,
  heading,
  subheading,
  features,
}: {
  sectionLabel: string;
  heading: string;
  subheading: string;
  features: StickyFeature[];
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const handleEnter = useCallback((index: number) => {
    setActive((current) => (current === index ? current : index));
  }, []);

  return (
    <Band tone="neutral" id="features" className="py-24 sm:py-32">
      <div className="mb-20 max-w-3xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {sectionLabel}
        </p>
        <RevealText
          as="h2"
          lines={[heading]}
          className="mb-5 text-display-sm font-bold text-band-fg"
        />
        <p className="text-xl leading-relaxed text-band-muted">{subheading}</p>
      </div>

        <div className="lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Copy que se desplaza */}
          <div>
            {features.map((feature, i) => (
              <CopyBlock
                key={feature.title}
                feature={feature}
                index={i}
                isActive={active === i}
                onEnter={handleEnter}
                dim={!reduced}
              />
            ))}
          </div>

          {/* Panel sticky */}
          <div className="hidden lg:block">
            <div className="sticky top-0 h-screen flex items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-band-fg bg-band-bg">
                {features.map((feature, i) => (
                  <motion.div
                    key={feature.video}
                    className="absolute inset-0"
                    // Sin `initial` las seis capas quedan en opacity 1 y el panel
                    // muestra siempre la última del DOM, sin importar el bloque activo.
                    initial={{ opacity: i === 0 ? 1 : 0 }}
                    animate={{ opacity: active === i ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden={active !== i}
                  >
                    <LoopVideo
                      name={feature.video}
                      alt={feature.videoAlt}
                      active={active === i}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </Band>
  );
}

function CopyBlock({
  feature,
  index,
  isActive,
  onEnter,
  dim,
}: {
  feature: StickyFeature;
  index: number;
  isActive: boolean;
  onEnter: (index: number) => void;
  dim: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Banda de detección del 20% de alto, ligeramente por encima del centro:
  // es donde cae la vista al leer, y es el equivalente del `center+=25%` de
  // ManyChat. Con la banda del 10% exacto al centro había huecos en los que
  // ningún bloque calificaba y el panel se quedaba mostrando el anterior —
  // por eso se veía el video de una sección mientras se leía otra.
  const inBand = useInView(ref, { margin: '-35% 0px -45% 0px' });

  useEffect(() => {
    if (inBand) onEnter(index);
  }, [inBand, index, onEnter]);

  return (
    <div ref={ref} className="lg:min-h-[76vh] flex flex-col justify-center py-12 lg:py-0">
      <motion.div
        initial={{ opacity: !dim || index === 0 ? 1 : 0.32 }}
        animate={{ opacity: !dim || isActive ? 1 : 0.32 }}
        transition={{ duration: 0.4 }}
        className="lg:pr-4"
      >
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.14em] text-band-muted">{feature.kicker}</p>
        <h3 className="mb-4 text-display-sm font-bold text-band-fg">
          {feature.title}
        </h3>
        <p className="max-w-lg text-lg leading-relaxed text-band-muted">{feature.description}</p>
      </motion.div>

      {/* En móvil el video acompaña a su bloque; no hay columna sticky */}
      <div className="mt-8 overflow-hidden border-2 border-band-fg lg:hidden">
        <LoopVideo name={feature.video} alt={feature.videoAlt} className="w-full h-auto block" />
      </div>
    </div>
  );
}
