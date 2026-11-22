import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Wrap, Eyebrow } from '@/components/site/Home';
import { AUTOR, BASE, ORG, ORG_ID, PERSON } from '@/lib/entidad';
import ossData from '../../../data/oss/oss.json';

/**
 * /about, en inglés: la página que leen los revisores de programas
 * (AWS Community Builders, NVIDIA Inception, user groups). Solo hechos
 * fechados y verificables; lo que es plan dice «planned». Ver skill omona-tech.
 */
export const dynamic = 'force-static';

const TITLE = 'About Omona and Victor Gallo';
const DESC =
  'Omona builds AI agents for the sales process and contributes the fixes upstream to Hermes Agent and Strands Agents. Founded by Victor Gallo in León, Mexico.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/about` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/about`, type: 'profile', siteName: 'Omona', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
};

const stats = (ossData as { stats: Record<string, number> }).stats;

const TIMELINE: { date: string; what: string; status: 'done' | 'planned'; href?: string }[] = [
  {
    date: 'Oct 2026',
    what: 'AWS Activate credits (Portfolio, via NVIDIA Inception) granted to SuperLeads, the education-sales company where Victor builds the AI agents. They fund the Amazon Bedrock and SageMaker work.',
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
    date: '19 Nov 2026',
    what: 'AWS Builder ID and Builder Center profile (@victorgalloo). Joined the AWS Community Builders waitlist; the application itself opens in the yearly window.',
    status: 'done',
  },
  {
    date: 'Nov 2026',
    what: 'Registered for Hackatón México 2026 (CoDi + pey API) in León. Building inscripcion-codi: school enrollment payments with CoDi from WhatsApp, MIT-licensed.',
    status: 'done',
    href: 'https://github.com/victorgalloo/inscripcion-codi',
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
  ['Agents SDK', 'Strands Agents (AWS), where we also send fixes.'],
  ['Evaluation', 'Every agent runs against a test set of real cases before it talks to a customer; every change reruns the full set.'],
];

export default function AboutPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${BASE}/about#page`,
        name: TITLE,
        description: DESC,
        url: `${BASE}/about`,
        inLanguage: 'en',
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
        <header className="pb-10 pt-16 sm:pt-24">
          <Wrap>
            <Eyebrow>About · Omona</Eyebrow>
            <h1 className="text-heading-lg max-w-[20ch] text-balance text-obsidian">
              AI agents for the sales process. The fixes go upstream.
            </h1>
            <p className="mt-6 max-w-[60ch] text-[18px] leading-[1.5] text-charcoal">
              Omona is a small engineering practice in León, Mexico. It builds agents that prospect, follow up and prepare proposals inside the CRM a team already uses, and evaluates each one against real cases before it goes live.
            </p>
          </Wrap>
        </header>

        <section className="py-10 sm:py-14">
          <Wrap>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <div>
                <Eyebrow muted>Founder</Eyebrow>
                <h2 className="text-heading text-obsidian">Victor Gallo</h2>
                <p className="mt-4 max-w-[52ch] text-[16px] leading-[1.5] text-charcoal">
                  Founder of Omona. He also leads sales at SuperLeads, an education-admissions company in Mexico, where he builds and runs its AI agent operation on Amazon Bedrock. He contributes to Hermes Agent and Strands Agents when production finds a bug.
                </p>
                <p className="mono-label mt-6 flex flex-wrap gap-x-5 gap-y-2 text-stone">
                  <a href={AUTOR.url} rel="author" className="text-obsidian underline decoration-hair underline-offset-2">victorgallo.com</a>
                  <a href={AUTOR.github} className="hover:text-obsidian">GitHub</a>
                  <a href={AUTOR.linkedin} className="hover:text-obsidian">LinkedIn</a>
                  <Link href="/en/open-source" className="hover:text-obsidian">Open source</Link>
                </p>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                {STACK.map(([k, v]) => (
                  <div key={k} className="ring-card p-4">
                    <dt className="mono-label text-graphite">{k}</dt>
                    <dd className="mt-3 text-[15px] leading-[1.5] text-charcoal">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
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

        <section className="py-10 sm:py-14">
          <Wrap>
            <div className="card-invert flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mono-label text-[#a8a8a8]">Writing</p>
                <p className="mt-2 max-w-[48ch] text-[20px] leading-[1.3] tracking-[-0.03em] text-white">
                  Engineering notes on Bedrock credentials, TTS loudness and agent hierarchies, written from real fixes.
                </p>
              </div>
              <Link href="/blog#ingenieria" className="inline-flex h-9 shrink-0 items-center rounded-[6px] bg-white px-3 text-[14px] text-[#171717]">
                Read the notes (Spanish)
              </Link>
            </div>
          </Wrap>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
