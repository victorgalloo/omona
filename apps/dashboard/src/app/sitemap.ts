import type { MetadataRoute } from 'next';
import { getNotas } from '@/lib/notas';

export const dynamic = 'force-static';

/**
 * 22-nov-2026: solo el laboratorio (portada, open source ES/EN, blog, about y
 * las notas). Las rutas del producto responden 301 (next.config.js) y ya no
 * se anuncian; /privacidad y /terminos siguen para el dashboard, con noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omona.tech';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'es-US': baseUrl,
          'es-MX': baseUrl,
          'en-US': `${baseUrl}/en/security`,
          'x-default': baseUrl,
        },
      },
    },
    ...['/open-source', '/en/open-source'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/open-source`,
          'es-MX': `${baseUrl}/open-source`,
          'en-US': `${baseUrl}/en/open-source`,
          en: `${baseUrl}/en/open-source`,
          'x-default': `${baseUrl}/open-source`,
        },
      },
    })),
    ...['/comercial-ia', '/en/commercial-ai'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/comercial-ia`,
          'es-MX': `${baseUrl}/comercial-ia`,
          'en-US': `${baseUrl}/en/commercial-ai`,
          en: `${baseUrl}/en/commercial-ai`,
          'x-default': `${baseUrl}/comercial-ia`,
        },
      },
    })),
    ...['/seguridad', '/en/security'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/seguridad`,
          'es-MX': `${baseUrl}/seguridad`,
          'en-US': `${baseUrl}/en/security`,
          en: `${baseUrl}/en/security`,
          'x-default': `${baseUrl}/seguridad`,
        },
      },
    })),
    { url: `${baseUrl}/now`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...getNotas().map((n) => ({
      url: `${baseUrl}/blog/${n.slug}`,
      lastModified: new Date(n.updated),
      changeFrequency: 'monthly' as const,
      priority: n.slug === 'ciberseguridad-negocios-latinos-estados-unidos' ? 0.9 : 0.8,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/blog/${n.slug}`,
          'es-MX': `${baseUrl}/blog/${n.slug}`,
          'x-default': `${baseUrl}/blog/${n.slug}`,
        },
      },
    })),
  ];
}
