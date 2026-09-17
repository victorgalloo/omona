'use client';

import Link from 'next/link';
import { useT } from '@/contexts/LanguageContext';
import { Logo } from '../shared/Logo';

/**
 * El pie. Antes era una banda `bg-ink text-bone` fija, que sobre el tema
 * oscuro quedaba del mismo color que la página y se leía como si la página
 * simplemente se acabara. Ahora sigue al tema y se separa con una regla.
 *
 * La columna de problemas se queda: son páginas nombradas con la frase que el
 * dueño del negocio diría en voz alta, y son superficie de búsqueda.
 */
export function HomeFooter() {
  const t = useT();

  return (
    <footer className="border-t border-hairline px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Omona - Inicio">
            <Logo size={20} className="shrink-0 text-foreground" />
            <span className="font-mono font-semibold text-foreground">omona_</span>
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[13.5px] text-muted-foreground">
            <Link href="/login" className="transition-colors hover:text-foreground">
              {t.footer.login}
            </Link>
            <Link href="/signup" className="transition-colors hover:text-foreground">
              {t.footer.signup}
            </Link>
            <Link href="/demo" className="transition-colors hover:text-foreground">
              {t.footer.demo}
            </Link>
            <Link href="/privacidad" className="transition-colors hover:text-foreground">
              Privacidad
            </Link>
            <Link href="/terminos" className="transition-colors hover:text-foreground">
              Términos de uso
            </Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-hairline pt-8">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {t.problems.sectionLabel}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13.5px] text-muted-foreground">
            {t.problems.items.map((problem) => (
              <Link
                key={problem.slug}
                href={`/problemas/${problem.slug}`}
                className="transition-colors hover:text-foreground"
              >
                {problem.short}
              </Link>
            ))}
          </div>
        </div>

        {/* Las guías largas.
            Mismo criterio que la columna de problemas de arriba: el pie es
            donde alguien que ya leyó encuentra lo siguiente que leer. Y es el
            único punto de la portada que reparte enlaces hacia el corpus —
            antes de esto, las guías sólo se alcanzaban desde /blog, que es la
            página con menos visitas del sitio. */}
        <div className="mt-10 border-t border-hairline pt-8">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {t.home.guides.label}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13.5px] text-muted-foreground">
            {t.home.guides.items.map((guide) => (
              <Link
                key={guide.slug}
                href={`/blog/${guide.slug}`}
                className="transition-colors hover:text-foreground"
              >
                {guide.short}
              </Link>
            ))}
            <Link href="/blog" className="text-foreground/70 transition-colors hover:text-foreground">
              {t.footer.allGuides}
            </Link>
          </div>
        </div>

        {/* El hueco final de vi: la columna de virgulillas y el EOF. Es lo que
            cierra la metafora del archivo sin necesidad de explicarla. */}
        <div aria-hidden className="md-eof mt-12 select-none text-xs leading-[1.6]">
          {['~', '~', '~'].map((t, i) => (
            <p key={i}>{t}</p>
          ))}
          <p className="mt-1">{'~'} EOF</p>
        </div>

        <p className="mt-6 text-xs text-muted">
          © {new Date().getFullYear()} {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
