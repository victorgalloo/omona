import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { Wrap, Eyebrow, now, TIPO } from '@/components/site/Home';
import { fechaCorta } from '@/lib/notas';
import { BASE, PERSON } from '@/lib/entidad';
import { POSICION } from '@/lib/perfil';

/**
 * /now — la bitácora de Victor (estilo nownownow.com), en español. Se arma sola:
 * scripts/now-refresh.mjs → data/now/now.json, a diario por cron (skill omona-tech).
 * Solo hechos públicos y confirmados; nada de planes como si fueran hechos.
 */
export const dynamic = 'force-static';

const TITLE = 'Ahora · qué está haciendo Victor Gallo';
const DESC = 'Bitácora diaria de Victor Gallo: pull requests, reportes, notas de ingeniería, eventos y programas. Se actualiza sola desde GitHub y el blog.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${BASE}/now`, types: { 'application/rss+xml': `${BASE}/now/rss.xml` } },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/now`, type: 'website', siteName: 'Omona', locale: 'es_MX' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};

/** Agrupa por mes («nov 2026») conservando el orden (más reciente primero). */
function porMes() {
  const grupos: { mes: string; items: typeof now.items }[] = [];
  for (const it of now.items) {
    const mes = fechaCorta(it.date).split(' ').slice(1).join(' ');
    const g = grupos.at(-1);
    if (g && g.mes === mes) g.items.push(it);
    else grupos.push({ mes, items: [it] });
  }
  return grupos;
}

export default function NowPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${BASE}/now#page`,
        name: TITLE,
        description: DESC,
        url: `${BASE}/now`,
        inLanguage: 'es-MX',
        dateModified: now.updated,
        mainEntity: { '@id': PERSON['@id'] },
      },
      PERSON,
    ],
  };
  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <JsonLd data={ld} />
      <LandingNav />
      <main>
        <header className="pb-10 pt-16 sm:pt-24">
          <Wrap>
            <Eyebrow>Ahora · Victor Gallo</Eyebrow>
            <h1 className="text-heading-lg max-w-[22ch] text-balance text-obsidian">Qué estoy haciendo ahora</h1>
            <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.5] text-charcoal">
              {POSICION.es} Esta página se arma sola cada día con lo que pasa en GitHub, en el blog y en mi agenda confirmada.
            </p>
            <p className="mono-label mt-5 flex flex-wrap gap-x-4 gap-y-1 text-stone">
              <span>última entrada · {fechaCorta(now.updated)}</span>
              <a href="/now/rss.xml" className="hover:text-obsidian">RSS</a>
              <Link href="/about" className="hover:text-obsidian">About (EN)</Link>
            </p>
          </Wrap>
        </header>

        <section className="pb-10" aria-labelledby="foco">
          <Wrap>
            <div className="ring-card p-5">
              <p id="foco" className="mono-label text-graphite">En foco</p>
              <ul className="mt-3 space-y-3">
                {now.foco.map((f) => (
                  <li key={f.es} className="flex gap-2.5 text-[16px] leading-[1.5] text-charcoal">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#297a3a]" />
                    {f.url ? <a href={f.url} className="hover:text-obsidian">{f.es}</a> : f.es}
                  </li>
                ))}
              </ul>
            </div>
          </Wrap>
        </section>

        <section className="py-6 sm:py-10" aria-labelledby="bitacora">
          <Wrap>
            <h2 id="bitacora" className="text-heading text-obsidian">Bitácora</h2>
            <div className="mt-8 grid gap-10">
              {porMes().map((g) => (
                <div key={g.mes}>
                  <p className="mono-label mb-3 text-graphite">{g.mes}</p>
                  <ol className="ring-card divide-y divide-hair">
                    {g.items.map((it) => (
                      <li key={`${it.kind}${it.ref}`} className="grid gap-1 px-4 py-3 sm:grid-cols-[12ch_9ch_minmax(0,1fr)] sm:gap-3">
                        <time dateTime={it.date} className="mono-label pt-0.5 text-graphite">{fechaCorta(it.date)}</time>
                        <span className="mono-label pt-0.5 text-stone">{TIPO[it.kind] ?? it.kind}</span>
                        <p className="min-w-0 text-[15px] leading-[1.5] text-charcoal">
                          {it.url ? <a href={it.url} className="break-words hover:text-obsidian">{it.es}</a> : it.es}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Wrap>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
