import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero, Aportes, Proyectos, Notas, Quien } from '@/components/site/Home';
import { BASE, ORG, ORG_DESC_ES, ORG_ID, PERSON } from '@/lib/entidad';
import { HomeFooter } from '@/components/home/HomeFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import ossData from '../../data/oss/oss.json';

const TITLE = 'Omona · laboratorio open source de Victor Gallo';
const DESC =
  'Pull requests, reportes y notas de ingeniería de Victor Gallo sobre agentes de IA en Amazon Bedrock, Hermes Agent y Strands Agents, con su estado real en GitHub.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  openGraph: { title: TITLE, description: DESC, locale: 'es_MX', type: 'website', url: BASE, siteName: 'Omona' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  alternates: { canonical: BASE },
};

/**
 * JSON-LD de la portada. Omona es el laboratorio de Victor, no un producto:
 * sin ProfessionalService, sin ofertas, sin FAQ comercial. La organización
 * (con `founder`) y la persona comparten @id con victorgallo.com.
 */
const prs = (ossData as { prs: { title: string; url: string }[] }).prs;
const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...ORG, description: ORG_DESC_ES },
    PERSON,
    { '@type': 'WebSite', '@id': `${BASE}/#website`, name: 'Omona', url: BASE, inLanguage: 'es-MX', publisher: { '@id': ORG_ID } },
    {
      '@type': 'WebPage',
      '@id': `${BASE}/#page`,
      name: TITLE,
      description: DESC,
      url: BASE,
      inLanguage: 'es-MX',
      dateModified: '2026-11-22',
      isPartOf: { '@id': `${BASE}/#website` },
      about: { '@id': PERSON['@id'] },
      mainEntity: {
        '@type': 'ItemList',
        name: 'Pull requests de Victor Gallo a proyectos open source',
        itemListElement: prs.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: p.url })),
      },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '#hero-description'] },
    },
  ],
};

/**
 * ══ LA PORTADA ══════════════════════════════════════════════════
 * 22-nov-2026: laboratorio open source (estilo GitHub personal). Orden:
 *   1. héroe       quién es Victor + panel CLI con la actividad real
 *   2. aportes     PRs y reportes con el estado que dice GitHub
 *   3. proyectos   repos propios
 *   4. notas       las últimas del blog
 *   5. qué es      Omona = laboratorio, sin producto
 * Las secciones del producto (ciclo, medición, alcance, FAQ, cierre) se
 * retiraron; siguen en el historial de git.
 */
export default function LandingPage() {
  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <JsonLd data={jsonLdGraph} />
      <LandingNav />
      <main>
        <Hero />
        <Aportes />
        <Proyectos />
        <Notas />
        <Quien />
      </main>
      <HomeFooter />
    </div>
  );
}
