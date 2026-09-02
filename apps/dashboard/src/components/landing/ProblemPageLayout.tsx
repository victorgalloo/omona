'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { LandingNav } from './LandingNav';
import { Band } from './motion/Band';
import { LoopVideo } from './motion/LoopVideo';
import { RevealBlock, RevealText } from './motion/RevealText';
import { useT } from '@/contexts/LanguageContext';
import { Logo } from '../shared/Logo';

/**
 * Layout de las páginas nombradas por problema (/problemas/*).
 *
 * No reusa UseCasePageLayout a propósito: ese layout exige una tira de `stats`
 * y las páginas de caso de uso que existen la llenan con cifras que nadie puede
 * sostener ("80% leads pre-calificados"). Aquí la prueba es el loop del producto
 * haciendo justo lo que el título promete, que sí se puede sostener.
 */
export function ProblemPageLayout({ slug }: { slug: string }) {
  const t = useT();
  const problem = t.problems.items.find((p) => p.slug === slug);
  if (!problem) return null;

  const others = t.problems.items.filter((p) => p.slug !== slug);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingNav />

      {/* ── HERO ─────────────────────────────────────────── */}
      <Band tone="contrast" wipe={false} className="pt-32 pb-20">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 font-mono text-sm text-band-muted transition-colors hover:text-band-fg"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.problems.backHome}
          </Link>

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">{t.problems.sectionLabel}</p>
              <RevealText
                as="h1"
                lines={[problem.title, problem.titleBreak]}
                className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
              />
              <p className="mb-10 max-w-xl text-lg leading-relaxed text-band-muted lg:text-xl">
                {problem.subtitle}
              </p>
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2.5 bg-neon-lime px-8 py-4 text-base font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                {t.problems.ctaSignup}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <RevealBlock className="overflow-hidden border-2 border-band-fg">
              <LoopVideo
                name={problem.video}
                alt={problem.videoAlt}
                className="block h-auto w-full"
                priority
              />
            </RevealBlock>
        </div>
      </Band>

      {/* ── DOLORES ──────────────────────────────────────── */}
      <Band tone="lime" width="narrow" className="py-20 sm:py-24">
        <h2 className="mb-10 text-display-sm font-bold text-band-fg">{t.problems.painsTitle}</h2>
        <ul className="border-t-2 border-band-fg">
          {problem.pains.map((pain) => (
            <li key={pain} className="flex items-start gap-4 border-b border-band-fg/25 py-5">
              <X className="mt-1 h-5 w-5 shrink-0 text-band-fg" aria-hidden />
              <span className="text-lg leading-relaxed text-band-fg">{pain}</span>
            </li>
          ))}
        </ul>
      </Band>

      {/* ── RESPUESTAS ───────────────────────────────────── */}
      <Band tone="neutral" className="py-20 sm:py-24">
        <RevealText
          as="h2"
          lines={[t.problems.answersTitle]}
          className="mb-14 text-display-sm font-bold text-band-fg"
        />
        <div className="grid gap-x-10 md:grid-cols-3">
          {problem.answers.map((answer, i) => (
            <RevealBlock key={answer.title} delay={i * 0.08} className="border-t-2 border-band-fg py-7">
              <Check className="mb-5 h-6 w-6 text-band-fg" aria-hidden />
              <h3 className="mb-3 text-xl font-semibold text-band-fg">{answer.title}</h3>
              <p className="text-base leading-relaxed text-band-muted">{answer.body}</p>
            </RevealBlock>
          ))}
        </div>
      </Band>

      {/* ── CTA ──────────────────────────────────────────── */}
      <Band tone="orange" className="py-24 sm:py-32">
        <div className="max-w-3xl">
          <h2 className="mb-4 text-display-sm font-bold text-band-fg">{t.problems.ctaTitle}</h2>
          <p className="mb-10 max-w-lg text-lg text-band-muted">{t.problems.ctaBody}</p>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2.5 bg-ink px-8 py-4 text-base font-semibold text-bone transition-transform hover:-translate-y-0.5"
            >
              {t.problems.ctaSignup}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 border border-band-fg px-8 py-4 text-base font-medium text-band-fg transition-colors hover:bg-band-fg hover:text-band-bg"
            >
              {t.problems.ctaDemo}
            </Link>
          </div>
        </div>
      </Band>

      {/* ── OTROS PROBLEMAS ──────────────────────────────── */}
      <Band tone="neutral" className="py-20">
        <p className="mb-8 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {t.problems.otherTitle}
        </p>
        <div className="grid gap-x-10 sm:grid-cols-3">
          {others.map((other) => (
              <Link
                key={other.slug}
                href={`/problemas/${other.slug}`}
                className="group block border-t-2 border-band-fg py-6 transition-opacity hover:opacity-70"
              >
                <p className="mb-2 text-lg font-semibold text-band-fg">{other.short}</p>
                <ArrowRight
                  className="h-4 w-4 text-band-fg transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            ))}
        </div>
      </Band>

      <footer className="bg-ink py-12 text-bone">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <Logo size={22} className="shrink-0 text-bone" />
            <span className="ml-2 font-mono text-base font-semibold text-bone">omona_</span>
          </div>
          <p className="text-sm text-bone/60">
            © {new Date().getFullYear()} omona by anthana · made with ♥ in méxico
          </p>
        </div>
      </footer>
    </div>
  );
}
