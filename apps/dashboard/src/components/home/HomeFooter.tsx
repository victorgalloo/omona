import Link from 'next/link';
import { es } from '@/lib/i18n';
import { Logo } from '../shared/Logo';

/**
 * El pie (DESIGN_SYSTEM.md §7). Componente de servidor: sin estado.
 *
 * Aquí viven las entradas discretas: Open source, notas de ingeniería y About.
 * La portada vende el sistema; quien evalúa la ingeniería (o un programa de
 * embajadores) llega por aquí o por un enlace directo.
 *
 * La microlínea final enlaza a victorgallo.com. Es la liga indirecta que se
 * pidió: visible, pero no protagonista. El rel="author" va en el recuadro de
 * autor de cada artículo, no aquí.
 */
const COLUMNAS: { titulo: string; links: { href: string; label: string; ext?: boolean }[] }[] = [
  {
    titulo: 'Producto',
    links: [
      { href: '/#ciclo', label: 'El proceso' },
      { href: '/#medicion', label: 'Se prueba' },
      { href: '/como-trabajamos', label: 'Cómo trabajo' },
      { href: '/demo', label: 'Demo' },
    ],
  },
  {
    titulo: 'Recursos',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/blog#ingenieria', label: 'Notas de ingeniería' },
      { href: '/comparativas', label: 'Comparativas' },
      { href: '/blog/rss.xml', label: 'RSS' },
    ],
  },
  {
    titulo: 'Código abierto',
    links: [
      { href: '/open-source', label: 'Open source' },
      { href: '/en/open-source', label: 'Open source (EN)' },
      { href: '/about', label: 'About' },
      { href: 'https://github.com/victorgalloo', label: 'GitHub', ext: true },
    ],
  },
  {
    titulo: 'Cuenta',
    links: [
      { href: '/login', label: 'Iniciar sesión' },
      { href: '/privacidad', label: 'Privacidad' },
      { href: '/terminos', label: 'Términos de uso' },
    ],
  },
];

export function HomeFooter() {
  return (
    <footer className="mt-24 px-6 pb-12 pt-16 lg:px-12">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2" aria-label="Omona — inicio">
              <Logo size={18} className="text-black" />
              <span className="text-[15px] font-medium tracking-[-0.04em] text-obsidian">omona</span>
            </Link>
            <p className="mt-4 max-w-[30ch] text-[13px] leading-[1.54] text-stone">
              Prospectar, seguir y cerrar sin capturar nada a mano.
            </p>
          </div>
          {COLUMNAS.map((c) => (
            <div key={c.titulo}>
              <p className="eyebrow eyebrow-muted mb-4">{c.titulo}</p>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    {l.ext ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-charcoal transition-colors hover:text-obsidian"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-[14px] text-charcoal transition-colors hover:text-obsidian">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <p className="eyebrow eyebrow-muted mb-3">{es.problems.sectionLabel.replace(/_$/, '')}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-stone">
            {es.problems.items.map((p) => (
              <Link key={p.slug} href={`/problemas/${p.slug}`} className="transition-colors hover:text-obsidian">
                {p.short}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-[12px] text-graphite sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.071em]">© {new Date().getFullYear()} Omona · León, México</p>
          <p>
            Omona es el proyecto de{' '}
            <a href="https://victorgallo.com" className="underline decoration-hair underline-offset-2 hover:text-obsidian">
              Victor Gallo
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
