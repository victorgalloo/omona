'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { CTA_PROYECTO } from '@/lib/cta';
import { Logo } from '../shared/Logo';

/**
 * La barra (DESIGN_SYSTEM.md §7). La usan la portada, el blog, /open-source y
 * las páginas de problema y caso de uso: lo que se arregle aquí se arregla en
 * todas.
 *
 * 64px, pegada arriba, papel #fafafa con desenfoque de 20px y SIN borde
 * inferior. Marca a la izquierda (el glyph negro + `omona`), cuatro links de
 * 14px, y a la derecha un ghost (Demo) y el lleno (Aplicar), que es la única
 * acción principal del sitio.
 *
 * Open source y About no van aquí a propósito: la portada vende el sistema, y
 * esas secciones viven en el pie (entrada discreta).
 */
const NAV_EN = {
  features: 'The process',
  engine: 'Testing',
  process: 'FAQ',
  pricing: 'How I work',
  blog: 'Blog',
  demo: 'Demo',
  signup: 'Apply',
};

/** `lang="en"` solo cambia las etiquetas (páginas /about y /en/open-source). */
export function LandingNav({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  const tEs = useT();
  const t = lang === 'en' ? { ...tEs, nav: { ...tEs.nav, ...NAV_EN } } : tEs;
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/#ciclo', label: t.nav.features },
    { href: '/#medicion', label: t.nav.engine },
    { href: '/como-trabajamos', label: t.nav.pricing },
    { href: '/blog', label: t.nav.blog },
  ];

  return (
    <nav
      aria-label="Principal"
      className="sticky top-0 z-50 h-16 bg-[#fafafa]/80 backdrop-blur-[20px]"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Omona — inicio">
            <Logo size={20} className="shrink-0 text-black" />
            <span className="text-[17px] font-medium tracking-[-0.04em] text-obsidian">omona</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-nav px-2.5 py-1.5 text-[14px] text-charcoal transition-colors hover:text-obsidian"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/demo" className="btn-ghost !h-8 rounded-full">
            {t.nav.demo}
          </Link>
          <a
            href={CTA_PROYECTO}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fill !h-8 rounded-full"
          >
            {t.nav.signup}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-obsidian md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={lang === 'en' ? (open ? 'Close menu' : 'Open menu') : open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="menu-movil" className="border-t border-hair bg-[#fafafa] px-6 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {[...links, { href: '/#preguntas', label: t.nav.process }].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[16px] text-charcoal hover:text-obsidian"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/demo" onClick={() => setOpen(false)} className="btn-ghost">
              {t.nav.demo}
            </Link>
            <a href={CTA_PROYECTO} target="_blank" rel="noopener noreferrer" className="btn-fill">
              {t.nav.signup}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
