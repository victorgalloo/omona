/**
 * /open-source y /en/open-source: el escaparate de aportes, armado desde
 * data/oss/oss.json (lo regenera scripts/oss-refresh.mjs a diario).
 *
 * Regla dura: el estado de cada PR es el que dice GitHub. Nada se marca
 * «merged» a mano y el texto de arriba cambia solo cuando cambien los datos.
 */
import Link from 'next/link';
import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Logo } from '@/components/shared/Logo';
import { Wrap, Eyebrow } from './Home';
import { AuthorBox } from './Blog';
import { BASE, ORG, ORG_ID, PERSON } from '@/lib/entidad';
import { getNotas } from '@/lib/notas';
import ossData from '../../../data/oss/oss.json';

type Lang = 'es' | 'en';
type Pr = {
  key: string; repo: string; number: number; title: string; url: string; state: string;
  createdAt: string; mergedAt: string | null; additions: number; deletions: number; changedFiles: number;
  fixes: string | null; area: string | null; es: string; en: string; post: string | null;
};
type Issue = {
  key: string; repo: string; number: number; url: string; state: string; createdAt: string; es: string; en: string;
  fixedBy: { pr: string; url: string; author: string; state?: string } | null;
};
type Project = { repo: string; url: string; language: string | null; license: string | null; pushedAt: string; es: string; en: string };
type Oss = { generatedAt: string; author: string; stats: Record<string, number>; prs: Pr[]; issues: Issue[]; projects?: Project[] };

const oss = ossData as unknown as Oss;

const T = {
  es: {
    path: '/open-source',
    other: { href: '/en/open-source', label: 'English' },
    eyebrow: 'Open source · Victor Gallo',
    h1: 'Aportes a los agentes que uso en producción.',
    sub: 'Los agentes que opero corren sobre Hermes Agent (Nous Research) y Amazon Bedrock. Cuando algo falla en producción, mando el arreglo al proyecto original, con prueba y con el reporte que lo explica.',
    auto: 'Esta página se arma sola desde GitHub cada día. El estado de cada PR es el que dice GitHub.',
    noneMerged: 'Ninguno está merged todavía: todos esperan revisión de los maintainers.',
    stats: { prs: 'PRs', open: 'abiertos', merged: 'merged', repos: 'proyectos', issues: 'reportes', lines: 'líneas' },
    prsH: 'Pull requests',
    prsSub: 'A proyectos de terceros. El texto en español es mío; el título es el del PR.',
    issuesH: 'Reportes',
    issuesSub: 'Bugs y propuestas que abrí, y quién los está arreglando.',
    fixedBy: 'Arreglo',
    by: 'de',
    projectsH: 'Proyectos propios',
    projectsSub: 'Código y documentación públicos.',
    notesH: 'Notas de ingeniería',
    notesSub: 'El porqué de algunos de estos PRs, con mediciones.',
    read: 'Leer la nota',
    files: 'archivos',
    fixes: 'resuelve',
    updated: 'actualizado',
    state: { merged: 'merged', open: 'abierto', draft: 'borrador', closed: 'cerrado' } as Record<string, string>,
    locale: 'es-MX',
    title: 'Open source: aportes a Hermes Agent y Strands Agents',
    desc: 'Pull requests y reportes de Victor Gallo (Omona) a Hermes Agent de Nous Research y a Strands Agents de AWS, con su estado real en GitHub. Se actualiza a diario.',
  },
  en: {
    path: '/en/open-source',
    other: { href: '/open-source', label: 'Español' },
    eyebrow: 'Open source · Victor Gallo',
    h1: 'Contributions to the agents I run in production.',
    sub: 'The agents I run are built on Hermes Agent (Nous Research) and Amazon Bedrock. When something breaks in production, I send the fix upstream, with tests and the report that explains it.',
    auto: 'This page rebuilds itself from GitHub every day. Each PR shows the status GitHub reports.',
    noneMerged: 'None is merged yet: all of them are waiting for maintainer review.',
    stats: { prs: 'PRs', open: 'open', merged: 'merged', repos: 'projects', issues: 'reports', lines: 'lines' },
    prsH: 'Pull requests',
    prsSub: 'To third-party projects. The one-line summary is mine; the title is the PR’s.',
    issuesH: 'Reports',
    issuesSub: 'Bugs and proposals I opened, and who is fixing them.',
    fixedBy: 'Fix',
    by: 'by',
    projectsH: 'My own projects',
    projectsSub: 'Public code and docs.',
    notesH: 'Engineering notes',
    notesSub: 'Why some of these PRs exist, with measurements (in Spanish).',
    read: 'Read the note',
    files: 'files',
    fixes: 'fixes',
    updated: 'updated',
    state: { merged: 'merged', open: 'open', draft: 'draft', closed: 'closed' } as Record<string, string>,
    locale: 'en-US',
    title: 'Open source: Hermes Agent & Strands Agents PRs',
    desc: 'Pull requests and issue reports by Victor Gallo (Omona) to Nous Research’s Hermes Agent and AWS’s Strands Agents, with live GitHub status.',
  },
};

const fecha = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Mexico_City' });

export function ossMetadata(lang: Lang): Metadata {
  const t = T[lang];
  return {
    title: t.title,
    description: t.desc,
    alternates: {
      canonical: `${BASE}${t.path}`,
      languages: { 'es-MX': `${BASE}/open-source`, en: `${BASE}/en/open-source`, 'x-default': `${BASE}/open-source` },
    },
    openGraph: { title: t.title, description: t.desc, url: `${BASE}${t.path}`, type: 'website', siteName: 'Omona', locale: lang === 'es' ? 'es_MX' : 'en_US' },
    twitter: { card: 'summary_large_image', title: t.title, description: t.desc },
  };
}

function Badge({ state, lang }: { state: string; lang: Lang }) {
  const merged = state === 'merged';
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.071em] ${
        merged ? 'bg-[#297a3a] text-white' : 'bg-white text-charcoal shadow-[0_0_0_1px_#ebebeb]'
      }`}
    >
      {merged ? '✓ ' : ''}
      {T[lang].state[state] ?? state}
    </span>
  );
}

function SectionHead({ h, sub }: { h: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-heading text-obsidian">{h}</h2>
      <p className="mt-2 text-[15px] leading-[1.5] text-stone">{sub}</p>
    </div>
  );
}

export function OssPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const s = oss.stats;
  const notas = getNotas();
  const url = `${BASE}${t.path}`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        name: t.title,
        description: t.desc,
        url,
        inLanguage: lang === 'es' ? 'es-MX' : 'en',
        dateModified: oss.generatedAt,
        about: { '@id': PERSON['@id'] },
        publisher: { '@id': ORG_ID },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: oss.prs.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: p.url })),
        },
      },
      PERSON,
      ORG,
    ],
  };
  const tiles: [string, string][] = [
    [String(s.prs), t.stats.prs],
    [String(s.open), t.stats.open],
    [String(s.merged), t.stats.merged],
    [String(s.repos), t.stats.repos],
    [String(s.issues), t.stats.issues],
    [`+${s.additions} −${s.deletions}`, t.stats.lines],
  ];

  return (
    <div lang={lang === 'es' ? 'es-MX' : 'en'} className="md min-h-screen bg-paper text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LandingNav lang={lang} />
      <main>
        <header className="pb-10 pt-16 sm:pt-24">
          <Wrap>
            <div className="flex items-baseline justify-between gap-6">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <Link href={t.other.href} hrefLang={lang === 'es' ? 'en' : 'es-MX'} className="mono-label text-charcoal hover:text-obsidian">
                {t.other.label} →
              </Link>
            </div>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <h1 className="text-heading-lg max-w-[20ch] text-balance text-obsidian">{t.h1}</h1>
                <p className="mt-6 max-w-[56ch] text-[18px] leading-[1.5] text-charcoal">{t.sub}</p>
                <p className="mt-4 max-w-[56ch] text-pretty text-[15px] leading-[1.5] text-stone">
                  {t.auto} {s.merged === 0 ? t.noneMerged : ''}
                </p>
              </div>
              <div className="cli text-[12.5px]">
                <p className="flex items-center gap-2">
                  <Logo size={11} className="shrink-0 text-black" />
                  <span>node scripts/oss-refresh.mjs</span>
                </p>
                <p className="mt-1">
                  <span className="ok">✓</span> oss.json: {s.prs} PRs ({s.merged} merged, {s.open} {lang === 'es' ? 'abiertos' : 'open'}), {s.issues} issues
                </p>
                <p className="dim mt-1">
                  {t.updated} {fecha(oss.generatedAt, t.locale)} · github.com/{oss.author}
                </p>
              </div>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {tiles.map(([v, k]) => (
                <div key={k} className="ring-card p-4">
                  <dt className="mono-label text-graphite">{k}</dt>
                  <dd className="mt-3 text-[28px] leading-none tracking-[-0.04em] text-obsidian">{v}</dd>
                </div>
              ))}
            </dl>
          </Wrap>
        </header>

        <section className="py-10 sm:py-14" aria-labelledby="prs">
          <Wrap>
            <SectionHead h={t.prsH} sub={t.prsSub} />
            <ul id="prs" className="grid gap-3">
              {oss.prs.map((p) => (
                <li key={p.key} className="ring-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <a href={p.url} className="font-mono text-[12.5px] text-obsidian underline decoration-hair underline-offset-2 hover:decoration-obsidian">
                      {p.repo}#{p.number}
                    </a>
                    <Badge state={p.state} lang={lang} />
                  </div>
                  <p className="mt-3 text-[17px] leading-[1.35] tracking-[-0.02em] text-obsidian">{lang === 'es' ? p.es : p.en}</p>
                  <p className="mt-1 font-mono text-[12px] leading-[1.54] text-stone">{p.title}</p>
                  <p className="mono-label mt-4 flex flex-wrap gap-x-4 gap-y-1 text-stone">
                    <span>{fecha(p.createdAt, t.locale)}</span>
                    {p.area && <span>{p.area}</span>}
                    <span>
                      +{p.additions} −{p.deletions}
                    </span>
                    <span>
                      {p.changedFiles} {t.files}
                    </span>
                    {p.fixes && (
                      <span>
                        {t.fixes} {p.fixes}
                      </span>
                    )}
                    {p.post && (
                      <Link href={`/blog/${p.post}`} className="text-obsidian hover:underline">
                        {t.read} →
                      </Link>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14">
          <Wrap>
            <div className="grid gap-16 lg:grid-cols-2">
              <div>
                <SectionHead h={t.issuesH} sub={t.issuesSub} />
                <ul className="grid gap-3">
                  {oss.issues.map((i) => (
                    <li key={i.key} className="ring-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <a href={i.url} className="font-mono text-[12.5px] text-obsidian underline decoration-hair underline-offset-2">
                          {i.repo.split('/')[1]}#{i.number}
                        </a>
                        <Badge state={i.state} lang={lang} />
                      </div>
                      <p className="mt-3 text-[15px] leading-[1.5] text-charcoal">{lang === 'es' ? i.es : i.en}</p>
                      {i.fixedBy && (
                        <p className="mono-label mt-4 flex flex-wrap items-center gap-2 text-graphite">
                          <span>{t.fixedBy}:</span>
                          <a href={i.fixedBy.url} className="text-obsidian underline decoration-hair underline-offset-2">
                            #{i.fixedBy.pr.split('#')[1]}
                          </a>
                          <span>
                            {t.by} <span className="normal-case">@{i.fixedBy.author}</span>
                          </span>
                          {i.fixedBy.state && <Badge state={i.fixedBy.state} lang={lang} />}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionHead h={t.projectsH} sub={t.projectsSub} />
                <ul className="grid gap-3">
                  {(oss.projects ?? []).map((p) => (
                    <li key={p.repo} className="ring-card p-4">
                      <a href={p.url} className="font-mono text-[12.5px] text-obsidian underline decoration-hair underline-offset-2">
                        {p.repo}
                      </a>
                      <p className="mt-3 text-[15px] leading-[1.5] text-charcoal">{lang === 'es' ? p.es : p.en}</p>
                      <p className="mono-label mt-4 flex flex-wrap gap-x-4 text-graphite">
                        {p.language && <span>{p.language}</span>}
                        {p.license && <span>{p.license}</span>}
                        <span>
                          {t.updated} {fecha(p.pushedAt, t.locale)}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14">
          <Wrap>
            <SectionHead h={t.notesH} sub={t.notesSub} />
            <div className="grid gap-3 md:grid-cols-3">
              {notas.map((n) => (
                <Link key={n.slug} href={`/blog/${n.slug}`} className="ring-card flex flex-col p-4 hover:text-obsidian">
                  <p className="mono-label text-graphite">{fecha(n.date, t.locale)}</p>
                  <h3 className="mt-6 text-[18px] leading-[1.25] tracking-[-0.03em] text-obsidian">{n.title}</h3>
                  <p className="mono-label mt-auto pt-6 text-stone">{n.prs.length ? n.prs.map((p) => `#${p.number}`).join(' · ') : n.tags.slice(0, 2).join(' · ')}</p>
                </Link>
              ))}
            </div>
            <div className="max-w-[720px]">
              <AuthorBox lang={lang} />
            </div>
          </Wrap>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
