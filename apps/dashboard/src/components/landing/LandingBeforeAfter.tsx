'use client';

import { useT } from '@/contexts/LanguageContext';
import { BeforeAfterScrub } from './motion/BeforeAfterScrub';

export function LandingBeforeAfter() {
  const t = useT();
  return <BeforeAfterScrub copy={t.beforeAfter} />;
}
