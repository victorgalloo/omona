import Link from 'next/link';
import { Logo } from '../shared/Logo';

/**
 * El pie (DESIGN_SYSTEM.md §7). Componente de servidor: sin estado.
 *
 * 22-nov-2026: omona.tech es el laboratorio open source de Victor Gallo, sin
 * producto. Aquí solo van el laboratorio (open source, blog, about) y los
 * perfiles de Victor. La liga a victorgallo.com es discreta: la microlínea
 * final; el rel="author" va en el recuadro de autor de cada nota.
 */
const COLUMNAS: { titulo: string; links: { href: string; label: string; ext?: boolean }[] }[] = [
  {
    titulo: 'Laboratorio',
    links: [
      { href: '/open-source', label: 'Open source' },
      { href: '/en/open-source', label: 'Open source (EN)' },
      { href: '/now', label: 'Ahora' },
      { href: '/conocimiento', label: 'Conocimiento' },
      { href: '/en/knowledge', label: 'Knowledge (EN)' },
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About' },
    ],
  },
  {
    titulo: 'Áreas',
    links: [
      { href: '/comercial-ia', label: 'Procesos comerciales + IA' },
      { href: '/en/commercial-ai', label: 'Commercial + AI (EN)' },
      { href: '/verificador-embudo-bilingue', label: 'Verificador de respuesta rápida' },
      { href: '/en/speed-to-lead-checker', label: 'Speed-to-Lead Checker (EN)' },
      { href: '/seguridad', label: 'Ciberseguridad e IA' },
      { href: '/en/security', label: 'Security (EN)' },
      { href: '/verificador-dmarc-spf', label: 'Verificador SPF/DMARC' },
      { href: '/en/dmarc-spf-checker', label: 'SPF/DMARC Checker (EN)' },
      { href: '/verificador-cabeceras-seguridad', label: 'Verificador de cabeceras de seguridad' },
      { href: '/en/security-headers-checker', label: 'Security Headers Checker (EN)' },
      { href: '/verificador-visibilidad-ia', label: 'Verificador de visibilidad en IA' },
      { href: '/en/ai-visibility-checker', label: 'AI Visibility Checker (EN)' },
      { href: 'mailto:victor@omona.tech', label: 'victor@omona.tech' },
    ],
  },
  {
    titulo: 'Victor',
    links: [
      { href: 'https://github.com/victorgalloo', label: 'GitHub', ext: true },
      { href: 'https://www.linkedin.com/in/victorgalloo/', label: 'LinkedIn', ext: true },
      { href: 'https://x.com/victorgallomx', label: 'X', ext: true },
      { href: 'https://builder.aws.com/community/@victorgalloo', label: 'AWS Builder Center', ext: true },
    ],
  },
  {
    titulo: 'Feeds',
    links: [
      { href: '/blog/rss.xml', label: 'RSS del blog' },
      { href: '/now/rss.xml', label: 'RSS de Ahora' },
      { href: '/llms.txt', label: 'llms.txt' },
      { href: '/llms-full.txt', label: 'llms-full.txt' },
    ],
  },
];

export function HomeFooter() {
  return (
    <footer className="mt-24 pb-12 pt-16">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.6fr_repeat(4,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2" aria-label="Omona — inicio">
              <Logo size={18} className="text-black" />
              <span className="text-[15px] font-medium tracking-[-0.04em] text-obsidian">omona</span>
            </Link>
            <p className="mt-4 max-w-[34ch] text-[13px] leading-[1.54] text-stone">
              Agentes comerciales bilingües con IA y ciberseguridad defensiva para negocios latinos en EE. UU., más laboratorio open source.
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
                        rel="noopener noreferrer me"
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

        <div className="mt-12 flex flex-col gap-2 text-[12px] text-graphite sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.071em]">© {new Date().getFullYear()} Omona · León, México</p>
          <p className="sm:max-w-[60ch] sm:text-right">
            Logos de sus dueños; no implica patrocinio. Omona es el laboratorio de{' '}
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
