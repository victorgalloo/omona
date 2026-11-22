/**
 * Notas de ingeniería: vista de artículo, recuadro de autor e índice.
 * Componentes de servidor (DESIGN_SYSTEM.md). El cuerpo sale de data/notas.
 */
import Link from 'next/link';
import { markdownToHtml } from '@/lib/geo/markdown';
import { fechaCorta, getNotas, type Nota } from '@/lib/notas';
import { AUTOR, BASE, ORG, ORG_ID, PERSON } from '@/lib/entidad';
import ossData from '../../../data/oss/oss.json';
import { Logo } from '@/components/shared/Logo';

type OssPr = { key: string; state: string; url: string; title: string };
const prsOss = (ossData as { prs: OssPr[] }).prs;
const ESTADO: Record<string, string> = { merged: 'merged', open: 'abierto', draft: 'borrador', closed: 'cerrado' };

/** Estado vivo de un PR según data/oss/oss.json (lo refresca scripts/oss-refresh.mjs). */
export function estadoPr(key: string): string | null {
  const p = prsOss.find((x) => x.key === key);
  return p ? p.state : null;
}

export function StateBadge({ state }: { state: string }) {
  const merged = state === 'merged';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.071em] ${
        merged ? 'bg-[#297a3a] text-white' : 'bg-white text-charcoal shadow-[0_0_0_1px_#ebebeb]'
      }`}
    >
      {merged ? '✓ ' : ''}
      {ESTADO[state] ?? state}
    </span>
  );
}

export function AuthorBox({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  return (
    <aside className="ring-card mt-16 flex gap-4 p-4" aria-label={lang === 'es' ? 'Autor' : 'Author'}>
      <span aria-hidden className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171717]">
        <Logo size={16} className="text-white" />
      </span>
      <div>
        <p className="mono-label text-graphite">{lang === 'es' ? 'Escrito por' : 'Written by'}</p>
        <p className="mt-1 text-[15px] text-obsidian">
          <a href={AUTOR.url} rel="author" className="underline decoration-hair underline-offset-2 hover:decoration-obsidian">
            {AUTOR.nombre}
          </a>
        </p>
        <p className="mt-1 max-w-[60ch] text-[13px] leading-[1.54] text-stone">{lang === 'es' ? AUTOR.bio : AUTOR.bioEn}</p>
        <p className="mono-label mt-2 flex gap-4 text-stone">
          <a href={AUTOR.github} className="hover:text-obsidian">GitHub</a>
          <a href={AUTOR.linkedin} className="hover:text-obsidian">LinkedIn</a>
          <Link href={lang === 'es' ? '/open-source' : '/en/open-source'} className="hover:text-obsidian">Open source</Link>
        </p>
      </div>
    </aside>
  );
}

export function notaJsonLd(n: Nota): string {
  const url = `${BASE}/blog/${n.slug}`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#post`,
        headline: n.title,
        description: n.description,
        url,
        mainEntityOfPage: url,
        inLanguage: 'es-MX',
        datePublished: n.date,
        dateModified: n.updated,
        wordCount: n.palabras,
        keywords: n.tags.join(', '),
        image: `${url}/opengraph-image`,
        author: { '@id': PERSON['@id'] },
        publisher: { '@id': ORG_ID },
        isPartOf: { '@type': 'Blog', '@id': `${BASE}/blog#blog`, name: 'Blog de Omona', url: `${BASE}/blog` },
        citation: n.prs.map((p) => p.url),
      },
      PERSON,
      ORG,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE}/blog` },
          { '@type': 'ListItem', position: 3, name: n.title, item: url },
        ],
      },
    ],
  });
}

export function NotaView({ n }: { n: Nota }) {
  const html = markdownToHtml(n.body);
  const min = Math.max(1, Math.round(n.palabras / 200));
  return (
    <article className="mx-auto w-full max-w-[1280px] px-6 pb-8 pt-12 lg:px-12">
      <nav aria-label="Ruta" className="mono-label mb-10 text-stone">
        <Link href="/" className="hover:text-obsidian">Inicio</Link>
        <span className="mx-2 text-ash">/</span>
        <Link href="/blog" className="hover:text-obsidian">Blog</Link>
        <span className="mx-2 text-ash">/</span>
        <Link href="/blog#ingenieria" className="hover:text-obsidian">Ingeniería</Link>
      </nav>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <p className="eyebrow">Nota de ingeniería · {fechaCorta(n.date)}</p>
          <h1 className="max-w-[24ch] text-heading-lg text-obsidian">{n.h1}</h1>
          <p className="mono-label mt-6 text-stone">
            {AUTOR.nombre} · {min} min · {n.tags.slice(0, 3).join(' · ')}
          </p>
          <div className="geo-prose nota-prose mt-10" dangerouslySetInnerHTML={{ __html: html }} />
          <AuthorBox />
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            {n.prs.length > 0 && (
              <div className="ring-card p-4">
                <p className="mono-label text-graphite">Referencias en GitHub</p>
                <ul className="mt-3 space-y-2">
                  {n.prs.map((p) => {
                    const st = estadoPr(p.key);
                    return (
                      <li key={p.key} className="flex items-center justify-between gap-2">
                        <a href={p.url} className="font-mono text-[12px] text-obsidian underline decoration-hair underline-offset-2">
                          {p.repo.split('/')[1]}#{p.number}
                        </a>
                        {st && <StateBadge state={st} />}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className="cli !p-3 text-[12px]">
              <p className="mono-label text-graphite">rss</p>
              <a href="/blog/rss.xml" className="mt-1 block truncate underline decoration-hair">omona.tech/blog/rss.xml</a>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}

export function NotasIndex() {
  const notas = getNotas();
  if (!notas.length) return null;
  return (
    <section id="ingenieria" className="mb-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Notas de ingeniería</p>
          <h2 className="text-heading text-obsidian">Lo que aprendimos arreglando cosas en producción</h2>
        </div>
        <Link href="/open-source" className="mono-label hidden shrink-0 text-charcoal hover:text-obsidian sm:block">
          Open source →
        </Link>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {notas.map((n) => (
          <Link key={n.slug} href={`/blog/${n.slug}`} className="ring-card group flex flex-col p-4 transition-shadow hover:shadow-card-hover">
            <p className="mono-label text-graphite">{fechaCorta(n.date)}</p>
            <h3 className="mt-6 text-[19px] leading-[1.2] tracking-[-0.03em] text-obsidian">{n.title}</h3>
            <p className="mt-3 line-clamp-3 text-[14px] leading-[1.5] text-charcoal">{n.description}</p>
            <p className="mono-label mt-auto pt-6 text-stone">
              {n.prs.length ? n.prs.map((p) => `#${p.number}`).join(' · ') : n.tags.slice(0, 2).join(' · ')}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
