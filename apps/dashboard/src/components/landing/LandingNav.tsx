'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '../shared/Logo';

/**
 * La barra (DESIGN_SYSTEM.md §7). La usan la portada, el blog, /open-source,
 * /about y las páginas legales: lo que se arregle aquí se arregla en todas.
 *
 * 64px, pegada arriba, papel #fafafa con desenfoque de 20px y SIN borde
 * inferior. Marca a la izquierda (el glyph negro + `omona`), tres links de
 * 14px, y a la derecha una sola pill llena: GitHub.
 *
 * 22-nov-2026: omona.tech es el laboratorio open source de Victor, no un
 * producto. Sin Demo, sin Aplicar, sin «Cómo trabajo». v2: + Ahora (/now).
 * 24-nov-2026: + Seguridad (/seguridad, /en/security): servicio defensivo de la empresa.
 */
const LINKS = {
  es: [
    { href: '/#diagnostico', label: 'Diagnóstico' },
    { href: '/seguridad', label: 'Seguridad IA' },
    { href: '/open-source', label: 'Open source' },
    { href: '/blog', label: 'Notas' },
    { href: '/now', label: 'Ahora' },
    { href: '/about', label: 'About' },
  ],
  en: [
    { href: '/en/security#diagnostico', label: 'Diagnostic' },
    { href: '/en/security', label: 'AI Security' },
    { href: '/en/open-source', label: 'Open source' },
    { href: '/blog', label: 'Notes' },
    { href: '/now', label: 'Now' },
    { href: '/about', label: 'About' },
  ],
};

const AGENDA_MAILTO =
  'mailto:victor@omona.tech?subject=Agendar%20revisi%C3%B3n%20de%20arquitectura%20y%20agentes%20IA%20%E2%80%94%20Omona';

/** `lang="en"` solo cambia a dónde apunta Open source (páginas /about y /en/open-source). */
export function LandingNav({ lang = 'es' }: { lang?: 'es' | 'en' } = {}) {
  const [open, setOpen] = useState(false);
  const links = LINKS[lang];

  return (
    <nav aria-label={lang === 'en' ? 'Main' : 'Principal'} className="sticky top-0 z-50 h-16 bg-[#fafafa]/80 backdrop-blur-[20px]">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={lang === 'en' ? 'Omona — home' : 'Omona — inicio'}>
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
          <a href={AGENDA_MAILTO} className="btn-ghost !h-8 rounded-full text-[13px]">
            {lang === 'en' ? 'Book review' : 'Agendar llamada'}
          </a>
          <Link href={lang === 'en' ? '/en/security#diagnostico' : '/#diagnostico'} className="btn-fill !h-8 rounded-full text-[13px]">
            {lang === 'en' ? 'Analyze domain →' : 'Evaluar dominio →'}
          </Link>
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
            {links.map((l) => (
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
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href={lang === 'en' ? '/en/security#diagnostico' : '/#diagnostico'}
              onClick={() => setOpen(false)}
              className="btn-fill w-full"
            >
              {lang === 'en' ? 'Analyze domain →' : 'Evaluar dominio →'}
            </Link>
            <a href={AGENDA_MAILTO} className="btn-ghost w-full">
              {lang === 'en' ? 'Book review' : 'Agendar llamada'}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
