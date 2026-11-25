import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Wrap, Eyebrow, Marcas, now, TIPO_EN } from '@/components/site/Home';
import { BASE, ORG, ORG_ID, PERSON } from '@/lib/entidad';
import { fechaCorta } from '@/lib/notas';
import { AVISO_PROGRAMAS, EVIDENCIA, FILOSOFIA, FOTO, LAB, LOGO_PROGRAMAS, NOMBRE_LEGAL, ORIGEN, POSICION, PROGRAMAS_SL, REDES, SUPERLEADS } from '@/lib/perfil';
import ossData from '../../../data/oss/oss.json';

/**
 * /about, en inglés: la página que leen los revisores de programas (AWS Community
 * Builders, NVIDIA, Claude/Anthropic y OpenAI ambassadors, user groups). v2
 * (22-nov-2026): Victor primero (foto, línea, cargo, filosofía), luego evidencia,
 * logos nominativos, bitácora y contacto. Solo hechos fechados; lo que es plan dice
 * «planned». Textos en lib/perfil.ts. Ver skill omona-tech.
 */
export const dynamic = 'force-static';

const TITLE = 'Victor Gallo · AI Agents & Cloud Security (Omona)';
const DESC =
  'Victor Gallo builds AI agents and defensive security architectures in León, Mexico: upstream PRs to Hermes Agent and Strands Agents, AWS Bedrock and notes.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: `${BASE}/about` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/about`, type: 'profile', siteName: 'Omona', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};

const stats = (ossData as { stats: Record<string, number> }).stats;

const TIMELINE: { date: string; what: string; status: 'done' | 'planned'; href?: string }[] = [
  {
    date: 'Oct 2026',
    what: 'AWS Activate credits (Portfolio, via NVIDIA Inception) granted to SuperLeads, the company where I work. They fund the Amazon Bedrock and SageMaker work.',
    status: 'done',
    href: 'https://github.com/victorgalloo/superleads-ai-aws-nvidia',
  },
  {
    date: 'Oct–Nov 2026',
    what: `Upstream contributions: ${stats.prs} pull requests to Hermes Agent and Strands Agents and ${stats.issues} issue reports. ${stats.merged === 0 ? 'None merged yet; all are under review.' : `${stats.merged} merged.`}`,
    status: 'done',
    href: '/en/open-source',
  },
  {
    date: '14 Nov 2026',
    what: 'Attended the Hackatón México 2026 kickoff (CoDi + pey API) in León. Building inscripcion-codi: school enrollment payments with CoDi from WhatsApp, MIT-licensed. Submission closes 12 Dec.',
    status: 'done',
    href: 'https://github.com/victorgalloo/inscripcion-codi',
  },
  {
    date: '19 Nov 2026',
    what: 'AWS Builder ID and Builder Center profile (@victorgalloo). Joined the AWS Community Builders waitlist; the application itself opens in the yearly window.',
    status: 'done',
    href: 'https://builder.aws.com/community/@victorgalloo',
  },
  {
    date: 'Planned',
    what: 'A talk at AWS User Group León (Guanajuato) on running agents on Amazon Bedrock in production, and helping co-organize local builder meetups.',
    status: 'planned',
  },
];

const STACK = [
  ['Agent runtime', 'Hermes Agent (Nous Research): scheduled routines, skills, sessions and the messaging gateway.'],
  ['Models', 'Anthropic Claude on Amazon Bedrock, with IAM-scoped credentials per profile.'],
  ['Agents SDK', 'Strands Agents (AWS), where he also sends fixes.'],
  ['Upstream', 'A bug found in production is reported with a reproduction, and the fix goes to the original project as a PR with tests.'],
];

const CONTACT = [
  ['LinkedIn', REDES.linkedin, 'preferred for programs, talks and events'],
  ['X', REDES.x, ''],
  ['GitHub', REDES.github, ''],
  ['AWS Builder Center', REDES.builder, ''],
  ['victorgallo.com', REDES.web, 'personal site, with WhatsApp'],
];

export default function AboutPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${BASE}/about#page`,
        name: TITLE,
        description: DESC,
        url: `${BASE}/about`,
        inLanguage: 'en',
        dateModified: now.updated,
        about: { '@id': ORG_ID },
        mainEntity: { '@id': PERSON['@id'] },
      },
      PERSON,
      ORG,
    ],
  };

  return (
    <div lang="en" className="md min-h-screen bg-paper text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LandingNav lang="en" />
      <main>
        <header className="pb-12 pt-12 sm:pt-20">
          <Wrap>
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)] lg:gap-16">
              <div className="order-2 lg:order-1">
                <Eyebrow>About · León, Mexico</Eyebrow>
                <h1 className="text-display text-obsidian">Victor Gallo</h1>
                <p className="mt-4 text-balance text-[26px] leading-[1.2] tracking-[-0.04em] text-stone sm:max-w-[26ch] sm:text-[32px]">{POSICION.en}</p>
                <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.5] text-charcoal">
                  Full name: {NOMBRE_LEGAL}. {SUPERLEADS.en}
                </p>
                <p className="mt-4 max-w-[60ch] text-[16px] leading-[1.5] text-stone">{LAB.en} There is no product here.</p>
                <p className="mono-label mt-6 flex flex-wrap gap-x-5 gap-y-2 text-stone">
                  <a href="#evidence" className="text-obsidian underline decoration-hair underline-offset-2">Evidence</a>
                  <a href="#contact" className="hover:text-obsidian">Contact</a>
                  <Link href="/en/open-source" className="hover:text-obsidian">Open source</Link>
                  <a href="/llms-full.txt" className="hover:text-obsidian">llms-full.txt</a>
                  <a href={REDES.web} rel="author" className="hover:text-obsidian">victorgallo.com</a>
                </p>
              </div>
              <figure className="order-1 w-full max-w-[168px] sm:max-w-[280px] lg:order-2 lg:ml-auto lg:max-w-[340px]">
                <div className="ring-card overflow-hidden p-1.5">
                  <img src={FOTO} width={824} height={1024} alt="Victor Gallo, black and white portrait" className="block h-auto w-full rounded-[4px]" />
                </div>
              </figure>
            </div>
          </Wrap>
        </header>

        <Marcas lang="en" />

        <section className="py-14 sm:py-20" aria-labelledby="why">
          <Wrap>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
              <div>
                <Eyebrow>Philosophy</Eyebrow>
                <h2 id="why" className="text-heading text-obsidian">Why I do this</h2>
                <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.5] text-stone">Translated from my Spanish original on the home page.</p>
              </div>
              <ol className="divide-y divide-hair border-y border-hair">
                {FILOSOFIA.en.map((linea, i) => (
                  <li key={linea} className="grid grid-cols-[3ch_minmax(0,1fr)] gap-4 py-4">
                    <span className="mono-label pt-1 text-graphite">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-pretty text-[18px] leading-[1.45] tracking-[-0.02em] text-obsidian">{linea}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="origin">
          <Wrap>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-16">
              <div>
                <Eyebrow>Origin</Eyebrow>
                <h2 id="origin" className="text-heading text-obsidian">Where I started</h2>
                <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.5] text-stone">
                  Full story with the photo, in Spanish:{' '}
                  <a href={ORIGEN.historia} rel="author" className="text-obsidian underline decoration-hair underline-offset-2">victorgallo.com/inicios</a>
                  {' · '}
                  <a href={ORIGEN.post} className="text-obsidian underline decoration-hair underline-offset-2">LinkedIn</a>
                </p>
              </div>
              <div>
                <div className="grid gap-3">
                  {ORIGEN.en.map((p) => (
                    <p key={p} className="text-pretty text-[17px] leading-[1.5] tracking-[-0.01em] text-charcoal">{p}</p>
                  ))}
                </div>
                <div className="ring-card mt-6 p-4">
                  <p className="mono-label text-stone">SuperLeads, where I work, is part of</p>
                  {/* Logos oficiales sin tocar (LOGOS-CREDITOS.md); LOGO_PROGRAMAS en perfil.ts los pasa a texto.
                      Celdas iguales de 120 × 52 (recuadro visible 108 × 40, el de la insignia de NVIDIA): sin brincos. */}
                  <ul aria-label="Startup programs SuperLeads is part of" className="-ml-1.5 mt-3 grid grid-cols-[repeat(2,max-content)] items-start gap-x-5 gap-y-4 sm:grid-cols-[repeat(4,max-content)] lg:grid-cols-[repeat(2,max-content)] xl:grid-cols-[repeat(4,max-content)]">
                    {PROGRAMAS_SL.map((p) => {
                      const conLogo = LOGO_PROGRAMAS[p.clave];
                      const img = (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.logo.src}
                          width={p.logo.ancho}
                          height={p.logo.alto}
                          alt={p.logo.alt}
                          loading="lazy"
                          decoding="async"
                          style={{ height: p.logo.alto }}
                          className="block w-auto max-w-none"
                        />
                      );
                      return (
                        <li key={p.nombre} className="flex min-h-[52px] items-center">
                          <a
                            href={p.href}
                            target="_blank"
                            rel="noopener nofollow"
                            title={conLogo ? `${p.nombre}: ${p.sub.toLowerCase()}` : undefined}
                            className="group flex min-h-[52px] flex-col justify-center leading-[1.2] text-obsidian focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            {conLogo ? (
                              <>
                                <span className="flex h-[52px] w-[120px] items-center justify-center">
                                  {p.logo.insignia ? (
                                    img
                                  ) : (
                                    <span className="flex h-[40px] w-[108px] items-center justify-center border border-[rgba(0,18,64,0.12)] bg-white">{img}</span>
                                  )}
                                </span>
                                <span aria-hidden="true" className="mt-0.5 block w-[120px] text-center text-[12px] text-stone group-hover:underline group-hover:underline-offset-2">{p.nombre}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-[15px] font-semibold tracking-[-0.01em] group-hover:underline group-hover:underline-offset-2">{p.nombre}</span>
                                <span className="text-[12px] text-stone">{p.sub}</span>
                              </>
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 text-[12px] leading-[1.5] text-stone">{AVISO_PROGRAMAS.en}</p>
                </div>
              </div>
            </div>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="evidence">
          <Wrap>
            <Eyebrow muted>For program reviewers</Eyebrow>
            <h2 id="evidence" className="text-heading text-obsidian">Evidence</h2>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-stone">Every item links to something you can check. PR status is read from GitHub daily.</p>
            <ul className="ring-card mt-8 divide-y divide-hair">
              {EVIDENCIA.map((e) => (
                <li key={e.href + e.en}>
                  <a href={e.href} className="flex items-start justify-between gap-4 px-4 py-3 text-[15px] leading-[1.5] text-charcoal hover:bg-white hover:text-obsidian">
                    <span>{e.en}</span>
                    <span className="mono-label shrink-0 pt-0.5 text-stone">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14">
          <Wrap>
            <Eyebrow muted>Programs and community</Eyebrow>
            <h2 className="text-heading text-obsidian">What has happened, with dates</h2>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-stone">Only verifiable facts. Anything not done yet is marked as planned.</p>
            <ol className="mt-8 grid gap-3">
              {TIMELINE.map((e) => (
                <li key={e.what} className="ring-card grid gap-3 p-4 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-start">
                  <p className="mono-label pt-0.5 text-charcoal">{e.date}</p>
                  <p className="max-w-[78ch] text-pretty text-[15px] leading-[1.5] text-charcoal">
                    {e.what}{' '}
                    {e.href && (
                      <a href={e.href} className="whitespace-nowrap text-obsidian underline decoration-hair underline-offset-2">
                        Link&nbsp;→
                      </a>
                    )}
                  </p>
                  <span
                    className={`justify-self-start rounded-full px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.071em] ${
                      e.status === 'done' ? 'bg-white text-charcoal shadow-[0_0_0_1px_#ebebeb]' : 'text-charcoal shadow-[0_0_0_1px_#ebebeb]'
                    }`}
                  >
                    {e.status === 'done' ? <span className="text-[#297a3a]">✓ </span> : null}
                    {e.status}
                  </span>
                </li>
              ))}
            </ol>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="now">
          <Wrap>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow muted>Now</Eyebrow>
                <h2 id="now" className="text-heading text-obsidian">Latest, updated daily</h2>
              </div>
              <Link href="/now" className="mono-label text-charcoal hover:text-obsidian">Full log (Spanish) →</Link>
            </div>
            <ul className="ring-card divide-y divide-hair">
              {now.items.slice(0, 6).map((it) => (
                <li key={`${it.kind}${it.ref}`} className="grid grid-cols-[12ch_minmax(0,1fr)] gap-3 px-4 py-3">
                  <time dateTime={it.date} className="mono-label pt-0.5 text-graphite">{it.date}</time>
                  <p className="min-w-0 text-[14.5px] leading-[1.5] text-charcoal">
                    <span className="mono-label mr-2 text-stone">{TIPO_EN[it.kind] ?? it.kind}</span>
                    {it.url ? <a href={it.url} className="break-words hover:text-obsidian">{it.en}</a> : it.en}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mono-label mt-3 text-graphite">last entry · {fechaCorta(now.updated)}</p>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14">
          <Wrap>
            <Eyebrow muted>Stack</Eyebrow>
            <h2 className="text-heading text-obsidian">What the agents run on</h2>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STACK.map(([k, v]) => (
                <div key={k} className="ring-card p-4">
                  <dt className="mono-label text-graphite">{k}</dt>
                  <dd className="mt-3 text-[15px] leading-[1.5] text-charcoal">{v}</dd>
                </div>
              ))}
            </dl>
          </Wrap>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="contact">
          <Wrap>
            <div className="ring-card grid gap-6 p-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div>
                <p className="mono-label text-graphite">Contact</p>
                <h2 id="contact" className="mt-3 text-[22px] leading-[1.25] tracking-[-0.03em] text-obsidian">
                  Reviewing an application, or looking for a speaker on agents in production?
                </h2>
                <p className="mt-3 text-[15px] leading-[1.5] text-stone">I answer in English or Spanish.</p>
              </div>
              <ul className="divide-y divide-hair">
                {CONTACT.map(([k, href, note]) => (
                  <li key={k}>
                    <a href={href} rel="me" className="flex items-baseline justify-between gap-4 py-2.5 text-[15px] text-charcoal hover:text-obsidian">
                      <span>{k}</span>
                      <span className="mono-label text-right text-stone">{note || href.replace('https://', '')}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Wrap>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
