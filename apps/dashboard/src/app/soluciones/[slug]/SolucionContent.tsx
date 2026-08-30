'use client';

import {
  BarChart3, Bell, BookOpen, Bot, CalendarCheck, Clock, Database, FileDown,
  Filter, GitMerge, Inbox, Layers, MessageCircle, Mic, QrCode, RefreshCw,
  Sparkles, TrendingUp, UserCheck, Webhook, Zap, type LucideIcon,
} from 'lucide-react';
import { UseCasePageLayout } from '@/components/landing/UseCasePageLayout';
import type { Solucion } from '@/lib/soluciones';

/**
 * Los datos de las landings viven en un módulo plano (src/lib/soluciones.ts) y
 * guardan el icono como string, porque un componente no puede cruzar la
 * frontera servidor → cliente como prop. Aquí se resuelve el nombre a componente.
 */
const ICONS: Record<string, LucideIcon> = {
  BarChart3, Bell, BookOpen, Bot, CalendarCheck, Clock, Database, FileDown,
  Filter, GitMerge, Inbox, Layers, MessageCircle, Mic, QrCode, RefreshCw,
  Sparkles, TrendingUp, UserCheck, Webhook, Zap,
};

function icon(name: string): LucideIcon {
  return ICONS[name] ?? Bot;
}

export function SolucionContent({ solucion }: { solucion: Solucion }) {
  return (
    <UseCasePageLayout
      icon={icon(solucion.iconName)}
      tag={solucion.tag}
      title={solucion.title}
      titleBreak={solucion.titleBreak}
      subtitle={solucion.subtitle}
      heroImage={solucion.heroImage}
      stats={solucion.stats}
      painPoints={solucion.painPoints}
      benefits={solucion.benefits.map((b) => ({
        icon: icon(b.iconName),
        title: b.title,
        description: b.description,
      }))}
      conversation={solucion.conversation}
      industriesLabel={solucion.industriesLabel}
      industries={solucion.industries}
      ctaTitle={solucion.ctaTitle}
      faqs={solucion.faqs}
    />
  );
}
