import { NotaView, notaJsonLd } from '@/components/site/Blog';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { getNota, getNotas } from '@/lib/notas';
import { BASE } from '@/lib/entidad';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const dynamicParams = false;

/**
 * Solo notas de ingeniería (data/notas). Las guías GEO de ventas se retiraron
 * con el producto el 22-nov-2026: next.config.js las manda 301 a /blog.
 */
export function generateStaticParams() {
  return getNotas().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const n = getNota(params.slug);
  if (!n) return { title: 'Blog' };
  const url = `${BASE}/blog/${n.slug}`;
  return {
    title: n.title,
    description: n.description,
    authors: [{ name: 'Victor Gallo', url: 'https://victorgallo.com' }],
    keywords: n.tags,
    alternates: { canonical: url, types: { 'application/rss+xml': `${BASE}/blog/rss.xml` } },
    openGraph: {
      title: n.title,
      description: n.description,
      url,
      siteName: 'Omona',
      type: 'article',
      locale: 'es_MX',
      publishedTime: n.date,
      modifiedTime: n.updated,
      authors: ['https://victorgallo.com'],
      tags: n.tags,
    },
    twitter: { card: 'summary_large_image', title: n.title, description: n.description },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const n = getNota(params.slug);
  if (!n) notFound();
  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: notaJsonLd(n) }} />
      <LandingNav />
      <main>
        <NotaView n={n} />
      </main>
      <HomeFooter />
    </div>
  );
}
