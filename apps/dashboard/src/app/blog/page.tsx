import type { Metadata } from 'next';
import { BlogIndex } from '@/components/geo/geo-views';
import { BASE, ORG_ID } from '@/lib/entidad';
import { getNotas } from '@/lib/notas';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Blog: notas de ingeniería y guías de ventas con IA',
  description:
    'Notas de ingeniería de Omona sobre agentes en producción (Hermes Agent, Amazon Bedrock, TTS) y guías de IA para ventas B2B por WhatsApp.',
  alternates: {
    canonical: `${BASE}/blog`,
    types: { 'application/rss+xml': `${BASE}/blog/rss.xml` },
  },
  openGraph: { title: 'Blog de Omona', url: `${BASE}/blog`, type: 'website', siteName: 'Omona' },
};

export default function BlogPage() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${BASE}/blog#blog`,
    name: 'Blog de Omona',
    url: `${BASE}/blog`,
    inLanguage: 'es-MX',
    publisher: { '@id': ORG_ID },
    blogPost: getNotas().map((n) => ({
      '@type': 'BlogPosting',
      '@id': `${BASE}/blog/${n.slug}#post`,
      headline: n.title,
      url: `${BASE}/blog/${n.slug}`,
      datePublished: n.date,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <BlogIndex kind="articulo" />
    </>
  );
}
