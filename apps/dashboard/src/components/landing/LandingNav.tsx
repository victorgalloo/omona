'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Menu, X, Wrench, Stethoscope, Building2, GraduationCap, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { Logo } from '../shared/Logo';

type LucideIcon = React.ComponentType<{ className?: string }>;

const USE_CASE_ICONS: LucideIcon[] = [Wrench, Stethoscope, Building2, GraduationCap];

const USE_CASE_DESCRIPTIONS: Record<'es' | 'en', string[]> = {
  es: [
    'Agencias, consultoras, freelancers',
    'Dentistas, psicólogos, veterinarias',
    'Desarrolladoras, corredores, inmobiliarias',
    'Universidades, bootcamps, academias',
  ],
  en: [
    'Agencies, consultants, freelancers',
    'Dentists, psychologists, vets',
    'Developers, brokers, real estate agencies',
    'Universities, bootcamps, academies',
  ],
};

export function LandingNav() {
  const { lang, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCasosOpen, setIsCasosOpen] = useState(false);
  const [isMobileCasosOpen, setIsMobileCasosOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#features', label: t.nav.features },
    { href: '/#proceso', label: t.nav.process },
    { href: '/pricing', label: t.nav.pricing },
    { href: '/blog', label: t.nav.blog },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Omona - Inicio">
            <Logo size={24} className="shrink-0 text-foreground" />
            <span className="font-mono font-semibold text-lg text-foreground ml-1">omona_</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-muted hover:text-foreground transition-colors text-sm group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* Casos de uso dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCasosOpen(true)}
              onMouseLeave={() => setIsCasosOpen(false)}
            >
              <button className="relative flex items-center gap-1 text-muted hover:text-foreground transition-colors text-sm group">
                {t.nav.useCases}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCasosOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </button>

              <AnimatePresence>
                {isCasosOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3"
                  >
                    <div className="w-[320px] rounded-xl border border-border bg-surface shadow-2xl overflow-hidden">
                      {t.useCases.items.map((useCase, i) => {
                        const Icon = USE_CASE_ICONS[i];
                        const description = USE_CASE_DESCRIPTIONS[lang][i];
                        return (
                          <Link
                            key={useCase.href}
                            href={useCase.href}
                            className={`flex items-start gap-3 px-4 py-3.5 hover:bg-surface-2 transition-colors ${
                              i !== t.useCases.items.length - 1 ? 'border-b border-border/50' : ''
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-4 h-4 text-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{useCase.title}</p>
                              <p className="text-xs text-muted mt-0.5">{description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface hover:border-border-hover"
            >
              <MessageCircle className="w-4 h-4" />
              {t.nav.demo}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-foreground px-5 py-2 text-sm font-medium text-background transition-all hover:opacity-90"
            >
              {t.nav.signup}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-t border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-muted hover:text-foreground text-base py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile: Casos de uso accordion */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-muted hover:text-foreground text-base py-2 transition-colors"
                  onClick={() => setIsMobileCasosOpen(!isMobileCasosOpen)}
                >
                  {t.nav.useCases}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileCasosOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMobileCasosOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 space-y-1 pb-2">
                        {t.useCases.items.map((useCase, i) => {
                          const Icon = USE_CASE_ICONS[i];
                          return (
                            <Link
                              key={useCase.href}
                              href={useCase.href}
                              className="flex items-center gap-3 py-2 text-muted hover:text-foreground transition-colors"
                              onClick={() => { setIsMenuOpen(false); setIsMobileCasosOpen(false); }}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="text-sm">{useCase.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-center pb-1">
                  <LanguageSwitcher />
                </div>
                <Link
                  href="/login"
                  className="block w-full text-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/demo"
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  {t.nav.demo}
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.nav.signup}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
