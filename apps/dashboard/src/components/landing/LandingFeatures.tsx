'use client';

import { StickyFeatureSwap } from './motion/StickyFeatureSwap';
import { useT } from '@/contexts/LanguageContext';

/**
 * Los loops que rinde apps/video, en el mismo orden que t.features.items.
 * Los slugs no dependen del idioma, así que viven aquí y no en i18n —
 * el mismo criterio que ya se usaba con el arreglo ICONS.
 */
const VIDEOS = [
  'chat-respondiendo',
  'nota-de-voz',
  'cita-agendada',
  'seguimiento-automatico',
  'handoff',
  'crm-se-llena-solo',
];

export function LandingFeatures() {
  const t = useT();

  return (
    <StickyFeatureSwap
      sectionLabel={t.features.sectionLabel}
      heading={t.features.heading}
      subheading={t.features.subheading}
      features={t.features.items.map((item, i) => ({
        video: VIDEOS[i],
        videoAlt: item.videoAlt,
        kicker: item.tech,
        title: item.title,
        description: item.description,
      }))}
    />
  );
}
