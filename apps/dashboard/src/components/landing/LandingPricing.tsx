'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Check,
  ArrowRight,
  MessageSquare,
  Brain,
  Users,
  Calendar,
  BarChart3,

  BookOpen,
  Zap,
  Shield,
  Headphones,
} from 'lucide-react';

const PRO_FEATURES = [
  { icon: Brain, text: 'Agente AI 24/7 en WhatsApp' },
  { icon: MessageSquare, text: 'Hasta 1,000 conversaciones/mes' },
  { icon: Zap, text: 'Calificación automática de leads' },
  { icon: Calendar, text: 'Agendamiento automático de citas' },
  { icon: Users, text: 'CRM y pipeline integrado' },
  { icon: BarChart3, text: 'Analytics y métricas en tiempo real' },

  { icon: BookOpen, text: 'Knowledge base (docs, sitio web)' },
  { icon: Headphones, text: 'Handoff inteligente a humanos' },
  { icon: Shield, text: 'Follow-up automático 24h' },
];

const CUSTOM_EXTRAS = [
  'Todo lo de Pro incluido',
  'Conversaciones ilimitadas',
  'Múltiples líneas de WhatsApp',
  'Integraciones personalizadas (CRM, ERP)',
  'Entrenamiento AI a la medida',
  'SLA y soporte dedicado',
  'Onboarding personalizado',
];

export function LandingPricing() {
  return (
    <section id="precios" className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            className="text-muted text-sm font-mono mb-4"
          >
            pricing_
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
          >
            Simple y transparente
          </motion.h2>
          <motion.p
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Sin costos ocultos. Sin contratos largos. Cancela cuando quieras.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">

          {/* ── PRO ──────────────────────────────────────── */}
          <motion.div
            className="relative border-t border-border pt-8"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-2 text-xs font-mono text-muted">plan_pro.config</span>
            </div>

            {/* Popular badge */}
            <div className="absolute top-3 right-4">
              <span className="text-xs font-mono font-medium text-[#27C93F] bg-[#27C93F]/10 border border-[#27C93F]/20 rounded-full px-3 py-1">
                popular
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-foreground mb-1">Pro</h3>
              <p className="text-sm text-muted mb-6">
                Todo lo que necesitas para automatizar ventas por WhatsApp.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-sm text-muted font-mono">$</span>
                <span className="text-5xl sm:text-6xl font-black text-foreground font-mono tracking-tight">
                  2,999
                </span>
                <div className="ml-1">
                  <span className="text-sm text-muted">MXN</span>
                  <span className="text-sm text-muted"> /mes</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/signup"
                className="group relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-xl bg-foreground px-6 py-3.5 text-base font-medium text-background transition-all hover:opacity-90 mb-8"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                Empezar gratis 14 días
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Features */}
              <ul className="space-y-3.5">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <feature.icon className="w-4 h-4 text-[#27C93F] mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ── CUSTOM ───────────────────────────────────── */}
          <motion.div
            className="border-t border-border pt-8"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              <span className="ml-2 text-xs font-mono text-muted">plan_custom.config</span>
            </div>

            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-foreground mb-1">Custom</h3>
              <p className="text-sm text-muted mb-6">
                Para equipos que necesitan escala, integraciones y soporte dedicado.
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl sm:text-6xl font-black text-foreground font-mono tracking-tight">
                  A la medida
                </span>
              </div>

              {/* CTA */}
              <a
                href="https://api.whatsapp.com/send?phone=529849800629&text=Hola%2C%20me%20interesa%20el%20plan%20Custom%20de%20Omona"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-border px-6 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-surface-2 hover:border-border-hover mb-8"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#27C93F]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contactar ventas
              </a>

              {/* Features */}
              <ul className="space-y-3.5">
                {CUSTOM_EXTRAS.map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-foreground mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-sm text-muted mt-10"
        >
          Todos los precios son en pesos mexicanos (MXN) + IVA. 14 días de prueba gratis.
        </motion.p>
      </div>
    </section>
  );
}
