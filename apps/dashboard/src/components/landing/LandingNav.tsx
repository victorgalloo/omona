'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Menu, X } from 'lucide-react';
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
 * Ya no hay desplegable de casos de uso. Las cuatro verticales que listaba
 * —clínicas, bienes raíces, escuelas, servicios— nombraban giros concretos, y
 * la oferta dejó de venderse por vertical: lo que se vende es el proceso
 * comercial, y el giro se define en la aplicación. Las páginas siguen en el
 * sitio para las búsquedas que ya las encuentran; simplemente no las anuncia
 * la barra.
 */

export function LandingNav() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // `/` es index.md; el resto toma su ultimo segmento. Las rutas anidadas se
  // quedan con la hoja porque la ruta completa no cabe en 390px.
  const segmento = (pathname ?? '/').split('/').filter(Boolean).pop();
  const filePath = `${segmento ?? 'index'}.md`;

  // El ancla /#preguntas salio del escritorio: en monoespaciado cada etiqueta
  // cuesta ~12% mas de ancho y la barra se pasaba 108px en 1440 (lo cazo el
  // chequeo por CDP). El FAQ sigue a un scroll de distancia y en el menu movil,
  // que es donde el espacio no aprieta.
  const navLinks = [
    { href: '/#ciclo', label: t.nav.features },
    { href: '/#medicion', label: t.nav.engine },
    { href: '/como-trabajamos', label: t.nav.pricing },
    { href: '/blog', label: t.nav.blog },
  ];

  // El movil si lo conserva: ahi los enlaces van en columna.
  const mobileLinks = [...navLinks, { href: '/#preguntas', label: t.nav.process }];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* La marca deja de ser un logotipo y pasa a ser la ruta del archivo
              que estas viendo. Es lo que convierte la barra en el encabezado de
              un editor en vez de en un menu de sitio web. El `.md` final no es
              adorno: es la promesa que cumple el resto de la pagina. */}
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Omona - Inicio">
            <Logo size={16} className="shrink-0 text-foreground" />
            <span className="font-mono text-[13px] text-muted">
              <span aria-hidden className="md-syntax hidden sm:inline">~/</span>
              <span className="hidden text-foreground sm:inline">omona.tech</span>
              <span aria-hidden className="md-syntax hidden sm:inline">/</span>
              <span aria-hidden className="md-syntax sm:hidden">./</span>
              <span className="text-foreground sm:text-muted">{filePath}</span>
            </span>
          </Link>

          {/* Enlaces de escritorio */}
          <div className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

          </div>

          {/* Acciones de escritorio */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <LanguageSwitcher />
            <Link
              href="/demo"
              className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:border-border-hover hover:bg-surface"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              {t.nav.demo}
            </Link>
            <a
              href={CTA_PROYECTO}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap bg-foreground px-3.5 py-1.5 text-[12px] font-medium text-background transition-opacity hover:opacity-90"
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
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="space-y-2 border-t border-hairline pt-4">
              <div className="flex justify-center pb-1">
                <LanguageSwitcher />
              </div>
              <Link
                href="/login"
                className="block w-full border border-border px-4 py-2.5 text-center text-[14px] font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.nav.login}
              </Link>
              <Link
                href="/demo"
                className="flex w-full items-center justify-center gap-2 border border-border px-4 py-2.5 text-[14px] font-medium text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4" />
                {t.nav.demo}
              </Link>
              <a
                href={CTA_PROYECTO}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-foreground px-4 py-2.5 text-center text-[14px] font-medium text-background"
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
