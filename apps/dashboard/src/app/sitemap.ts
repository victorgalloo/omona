import type { MetadataRoute } from 'next';
import { getAllGeo } from '@/lib/geo/articles';
import { getAllSoluciones } from '@/lib/soluciones';
import { es } from '@/lib/i18n';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omona.tech';
  const { articulos, comparativas, servicios } = getAllGeo();
  const soluciones = getAllSoluciones();
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/como-trabajamos`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    // Las paginas de servicio son la oferta. Prioridad por encima del corpus.
    { url: `${baseUrl}/servicios`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/comparativas`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // Páginas nombradas por problema: entran al sitemap porque son la superficie
    // de búsqueda con las palabras del cliente, no con nuestra categoría.
    ...es.problems.items.map((problem) => ({
      url: `${baseUrl}/problemas/${problem.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...soluciones.map((s) => ({
      url: `${baseUrl}/soluciones/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...articulos.map((a) => ({
      url: `${baseUrl}/blog/${a.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...comparativas.map((c) => ({
      url: `${baseUrl}/comparativas/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...servicios.map((s) => ({
      url: `${baseUrl}/servicios/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    })),
    // `delivery` NO entra todavia: data/geo/delivery/ esta vacio, y anunciar
    // en el sitemap URLs que devuelven 404 es peor que no anunciarlas. Se
    // agrega en cuanto haya markdown, con el mismo patron de arriba.
  ];
}
