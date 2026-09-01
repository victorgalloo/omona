'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, X as XIcon, type LucideIcon } from 'lucide-react';
import { LandingNav } from './LandingNav';
import { useT } from '@/contexts/LanguageContext';
import { Logo } from '../shared/Logo';

/* ── Types ─────────────────────────────────────────────── */

interface Stat {
  value: string;
  label: string;
}

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface UseCasePageProps {
  /* Hero */
  icon: LucideIcon;
  tag: string;
  title: string;
  titleBreak?: string;
  subtitle: string;
  heroImage: string;
  /* Stats strip */
  stats: Stat[];
  /* Pain points */
  painPoints: string[];
  /* Benefits */
  benefits: Benefit[];
  /* Conversation */
  conversation: ConversationMessage[];
  /* Industries */
  industriesLabel: string;
  industries: string[];
  /* CTA */
  ctaTitle: string;
  /* FAQ (opcional) — se renderiza antes del CTA y alimenta el JSON-LD de FAQPage */
  faqs?: { q: string; a: string }[];
}

/* ── Animated counter ──────────────────────────────────── */

function AnimatedStat({ stat, index }: { stat: Stat; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center px-4 py-6"
    >
      <p className="text-4xl sm:text-5xl font-black font-mono text-foreground mb-2">{stat.value}</p>
      <p className="text-sm text-muted">{stat.label}</p>
    </motion.div>
  );
}

/* ── Chat bubble with stagger ──────────────────────────── */

function ChatBubble({ msg, index }: { msg: ConversationMessage; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.15 * index }}
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        msg.role === 'user'
          ? 'bg-foreground text-background'
          : 'bg-surface-2 border border-border text-foreground'
      }`}>
        {msg.role === 'assistant' && (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#27C93F] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F] animate-pulse" />
            omona_
          </span>
        )}
        <p>{msg.text}</p>
        {msg.role === 'assistant' && (
          <p className="text-[10px] text-muted mt-2 font-mono">delivered · 0.8s</p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Parallax section header ───────────────────────────── */

function SectionHeader({ mono, title, subtitle }: { mono: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-muted text-sm font-mono mb-4"
      >
        {mono}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ── Main layout ───────────────────────────────────────── */

export function UseCasePageLayout({
  icon: Icon,
  tag,
  title,
  titleBreak,
  subtitle,
  heroImage,
  stats,
  painPoints,
  benefits,
  conversation,
  industriesLabel,
  industries,
  ctaTitle,
  faqs,
}: UseCasePageProps) {
  const t = useT();
  const heroRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll({ target: mounted ? heroRef : undefined, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingNav />

      {/* ── HERO ───────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-5xl mx-auto">
          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/#casos" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" />
              {t.useCaseLayout.backLabel}
            </Link>
          </motion.div>

          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center">
              <Icon className="w-7 h-7 text-foreground" />
            </div>
            <span className="text-sm font-mono text-[#27C93F] bg-[#27C93F]/10 border border-[#27C93F]/20 rounded-full px-3 py-1">
              {tag}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-6 leading-[1.05]"
          >
            {title}
            {titleBreak && <><br />{titleBreak}</>}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-muted max-w-2xl mb-10"
          >
            {subtitle}
          </motion.p>

          {/* Hero CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/signup"
              className="group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base font-medium text-background transition-all hover:opacity-90"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {t.useCaseLayout.heroCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-surface hover:border-border-hover"
            >
              {t.useCaseLayout.heroDemo}
            </Link>
          </motion.div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16"
          >
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <div className="relative aspect-[16/7]">
                <Image
                  src={heroImage}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────── */}
      <section className="border-y border-border bg-background">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#2A2A2A]">
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </section>

      {/* ── PAIN POINTS (sin omona) ────────────────────── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            mono={t.useCaseLayout.painMono}
            title={t.useCaseLayout.painTitle}
            subtitle={t.useCaseLayout.painSubtitle}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            {painPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 border-l-2 border-[#EF4444]/30 pl-4 py-2"
              >
                <XIcon className="w-4 h-4 text-[#EF4444] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS (con omona) ───────────────────────── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            mono={t.useCaseLayout.benefitsMono}
            title={t.useCaseLayout.benefitsTitle}
          />

          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border-t border-border pt-6"
              >
                <div className="w-10 h-10 rounded-xl bg-[#27C93F]/10 border border-[#27C93F]/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-[#27C93F]" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONVERSATION ───────────────────────────────── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            mono={t.useCaseLayout.demoMono}
            title={t.useCaseLayout.demoTitle}
            subtitle={t.useCaseLayout.demoSubtitle}
          />

          <div className="max-w-2xl mx-auto">
            <div className="border-t border-border pt-4">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  <span className="ml-3 text-xs font-mono text-muted">whatsapp_session.live</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F] animate-pulse" />
                  <span className="text-xs font-mono text-[#27C93F]">online</span>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 sm:p-6 space-y-4 min-h-[300px]">
                {conversation.map((msg, i) => (
                  <ChatBubble key={i} msg={msg} index={i} />
                ))}
              </div>

              {/* Input bar */}
              <div className="border-t border-border px-5 py-3 flex items-center gap-3">
                <div className="flex-1 rounded-xl bg-background border border-border px-4 py-2.5">
                  <span className="text-sm text-muted">{t.useCaseLayout.inputPlaceholder}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#27C93F] flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-background" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            mono={`${industriesLabel}_`}
            title={t.useCaseLayout.idealTitle}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {industries.map((industry, i) => (
              <motion.div
                key={industry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3 border-t border-border py-3.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#27C93F] shrink-0" />
                <span className="text-sm text-muted-foreground">{industry}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <section className="py-24 sm:py-32 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeader mono="faq_" title="Preguntas frecuentes" />

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="border-t border-border pt-6"
                >
                  <h3 className="text-base font-medium text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ──────────────────────────────────── */}
      <section className="py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-t border-border pt-10 sm:pt-14 relative"
          >
            {/* Gradient glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#27C93F]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
                {ctaTitle}
              </h2>
              <p className="text-muted mb-8">
                {t.useCaseLayout.ctaSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base font-medium text-background transition-all hover:opacity-90"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  {t.useCaseLayout.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="https://api.whatsapp.com/send?phone=529849800629"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-medium text-foreground transition-colors hover:bg-surface-2 hover:border-border-hover"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#27C93F]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t.useCaseLayout.ctaSecondary}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <Link href="/" className="flex items-center gap-1.5">
              <Logo size={24} className="shrink-0 text-foreground" />
              <span className="font-mono font-semibold text-lg text-foreground ml-2">omona_</span>
            </Link>
            <div className="flex gap-6 text-sm text-muted">
              <Link href="/login" className="hover:text-foreground transition-colors">{t.useCaseLayout.footer.login}</Link>
              <Link href="/signup" className="hover:text-foreground transition-colors">{t.useCaseLayout.footer.signup}</Link>
              <Link href="/demo" className="hover:text-foreground transition-colors">{t.useCaseLayout.footer.demo}</Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted">© {new Date().getFullYear()} omona by anthana · made with ♥ in méxico</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
