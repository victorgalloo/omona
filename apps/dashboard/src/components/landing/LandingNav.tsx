'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Menu, X, Wrench, Stethoscope, Building2, GraduationCap, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { CTA_PROYECTO } from '@/lib/cta';
import { Logo } from '../shared/Logo';

/**
 * La barra. La usan la portada, el blog, las páginas de problema y las de
 * caso de uso, así que lo que se arregle aquí se arregla en todas.
 *
 * Tres cosas se fueron, y las tres eran trabajo en el hilo principal durante
 * el scroll:
 *
 *  1. `useActiveBand`, que en cada fotograma llamaba a `elementsFromPoint`
 *     para averiguar de qué color era la sección de debajo y repintar el nav
 *     a juego. Hacía falta porque las secciones eran bandas de neón a sangre
 *     y un nav transparente desaparecía sobre la del mismo tono. Con una sola
 *     superficie el problema no existe: la barra tiene su propio fondo.
 *  2. El listener de scroll que alternaba entre transparente y sólido. Ahora
 *     es sólida siempre, como la de Vercel.
 *  3. `motion` y `AnimatePresence` en el desplegable y en el menú móvil.
 *     Animar `height: auto` obliga al navegador a medir el contenido en cada
 *     fotograma, y era lo primero que tocaba un visitante de teléfono.
 *
 * El desplegable de casos de uso ya no lleva estado: se abre con `group-hover`
 * y `focus-within`, así que también funciona con teclado y no re-renderiza.
 */

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
  const [isMobileCasosOpen, setIsMobileCasosOpen] = useState(false);

  const navLinks = [
    { href: '/#ciclo', label: t.nav.features },
    { href: '/#motor', label: t.nav.engine },
    { href: '/#preguntas', label: t.nav.process },
    { href: '/como-trabajamos', label: t.nav.pricing },
    { href: '/blog', label: t.nav.blog },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Omona - Inicio">
            <Logo size={20} className="shrink-0 text-foreground" />
            <span className="font-mono text-[15px] font-semibold text-foreground">omona_</span>
          </Link>

          {/* Enlaces de escritorio */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            {/* Desplegable sin estado: hover o foco de teclado. El `pt-3` del
                panel mantiene el puntero dentro del grupo al bajar del botón;
                sin ese puente el menú se cierra en el hueco. */}
            <div className="group relative">
              <button className="flex items-center gap-1 whitespace-nowrap text-[13.5px] text-muted-foreground transition-colors hover:text-foreground group-focus-within:text-foreground">
                {t.nav.useCases}
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
              </button>

              <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="w-[320px] overflow-hidden rounded-xl border border-border bg-surface shadow-elevated">
                  {t.useCases.items.map((useCase, i) => {
                    const Icon = USE_CASE_ICONS[i];
                    return (
                      <Link
                        key={useCase.href}
                        href={useCase.href}
                        className="flex items-start gap-3 border-b border-hairline px-4 py-3 transition-colors last:border-b-0 hover:bg-surface-2"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                          <Icon className="h-3.5 w-3.5 text-foreground" />
                        </span>
                        <span>
                          <span className="block text-[13.5px] font-medium text-foreground">
                            {useCase.title}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-muted">
                            {USE_CASE_DESCRIPTIONS[lang][i]}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones de escritorio */}
          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="whitespace-nowrap px-1 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-1.5 text-[13.5px] font-medium text-foreground transition-colors hover:border-border-hover hover:bg-surface"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {t.nav.demo}
            </Link>
            <a
              href={CTA_PROYECTO}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-lg bg-foreground px-4 py-1.5 text-[13.5px] font-medium text-background transition-opacity hover:opacity-90"
            >
              {t.nav.signup}
            </a>
          </div>

          <button
            className="-mr-2 p-2 text-foreground lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Menú"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil: se monta o no se monta. Sin animación de altura — es lo
          primero que toca un visitante de teléfono y tiene que ser inmediato. */}
      {isMenuOpen && (
        <div className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-hairline bg-background lg:hidden">
          <div className="space-y-1 px-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div>
              <button
                className="flex w-full items-center justify-between py-2 text-[15px] text-muted-foreground"
                onClick={() => setIsMobileCasosOpen((open) => !open)}
                aria-expanded={isMobileCasosOpen}
              >
                {t.nav.useCases}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isMobileCasosOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isMobileCasosOpen && (
                <div className="space-y-1 border-l border-hairline pb-2 pl-4">
                  {t.useCases.items.map((useCase, i) => {
                    const Icon = USE_CASE_ICONS[i];
                    return (
                      <Link
                        key={useCase.href}
                        href={useCase.href}
                        className="flex items-center gap-3 py-2 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileCasosOpen(false);
                        }}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {useCase.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-hairline pt-4">
              <div className="flex justify-center pb-1">
                <LanguageSwitcher />
              </div>
              <Link
                href="/login"
                className="block w-full rounded-lg border border-border px-4 py-2.5 text-center text-[14px] font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.login}
              </Link>
              <Link
                href="/demo"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-[14px] font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4" />
                {t.nav.demo}
              </Link>
              <a
                href={CTA_PROYECTO}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-foreground px-4 py-2.5 text-center text-[14px] font-medium text-background"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.signup}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
