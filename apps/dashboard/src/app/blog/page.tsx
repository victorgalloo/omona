import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Wrap, Eyebrow } from '@/components/site/Home';
import { AuthorBox } from '@/components/site/Blog';
import { BASE, ORG_ID, PERSON } from '@/lib/entidad';
import { fechaCorta, getNotas } from '@/lib/notas';

export const dynamic = 'force-static';

const TITLE = 'Notas: Ciberseguridad e IA en EE. UU.';
const DESC =
  'Guías de ciberseguridad para negocios latinos en EE. UU., prevención de fraude ACH/BEC, regla FTC, procesos comerciales e IA en AWS Bedrock.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: `${BASE}/blog`,
    languages: {
      'es-US': `${BASE}/blog`,
      'es-MX': `${BASE}/blog`,
      'x-default': `${BASE}/blog`,
    },
    types: { 'application/rss+xml': `${BASE}/blog/rss.xml` },
  },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `${BASE}/blog`,
    type: 'website',
    siteName: 'Omona',
    locale: 'es_US',
    alternateLocale: ['es_MX'],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};

/**
 * 22-nov-2026: el blog son solo las notas de ingeniería (data/notas). Las
 * guías GEO de ventas por WhatsApp se retiraron con el producto: sus URLs
 * responden 301 a /blog (next.config.js).
 */
export default function BlogPage() {
  const notas = getNotas();
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${BASE}/blog#blog`,
    name: 'Notas de ingeniería · Omona',
    url: `${BASE}/blog`,
    inLanguage: 'es-MX',
    author: { '@id': PERSON['@id'] },
    publisher: { '@id': ORG_ID },
    blogPost: notas.map((n) => ({
      '@type': 'BlogPosting',
      '@id': `${BASE}/blog/${n.slug}#post`,
      headline: n.title,
      url: `${BASE}/blog/${n.slug}`,
      datePublished: n.date,
    })),
  };
  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LandingNav />
      <main>
        <header className="pb-10 pt-16 sm:pt-24">
          <Wrap>
            <Eyebrow>Blog · notas de ingeniería</Eyebrow>
            <h1 className="text-heading-lg max-w-[22ch] text-balance text-obsidian">Lo que aprendí arreglando agentes en producción.</h1>
            <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.5] text-charcoal">
              Cada nota sale de un PR o un reporte real: qué falló, cómo se midió y qué se mandó upstream.
            </p>
            <p className="mono-label mt-5 flex flex-wrap gap-x-4 text-stone">
              <a href="/blog/rss.xml" className="hover:text-obsidian">RSS</a>
              <Link href="/open-source" className="hover:text-obsidian">Open source →</Link>
            </p>
          </Wrap>
        </header>
        <section id="ingenieria" className="py-10 sm:py-14">
          <Wrap>
            <ul className="grid gap-3">
              {notas.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/blog/${n.slug}`}
                    className="ring-card grid gap-3 p-4 transition-shadow hover:shadow-card-hover sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-start"
                  >
                    <p className="mono-label pt-1 text-graphite">{fechaCorta(n.date)}</p>
                    <div className="min-w-0">
                      <h2 className="text-[20px] leading-[1.25] tracking-[-0.03em] text-obsidian">{n.title}</h2>
                      <p className="mt-2 max-w-[72ch] text-[14px] leading-[1.5] text-charcoal">{n.description}</p>
                    </div>
                    <p className="mono-label pt-1 text-stone">
                      {n.prs.length ? n.prs.map((p) => `#${p.number}`).join(' · ') : n.tags.slice(0, 2).join(' · ')}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="max-w-[720px]">
              <AuthorBox />
            </div>
          </Wrap>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
