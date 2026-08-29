import type { MetadataRoute } from "next";
import { getAllGeo } from "@/lib/geo/articles";

const BASE = "https://omona.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const { articulos, comparativas } = getAllGeo();
  const hoy = new Date().toISOString().slice(0, 10);

  const urls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: hoy, priority: 1 },
    { url: `${BASE}/demo`, lastModified: hoy, priority: 0.9 },
    { url: `${BASE}/blog/`, lastModified: hoy, priority: 0.9 },
    { url: `${BASE}/comparativas/`, lastModified: hoy, priority: 0.9 },
  ];
  for (const a of articulos) {
    urls.push({ url: `${BASE}/blog/${a.slug}/`, lastModified: hoy, priority: 0.8 });
  }
  for (const c of comparativas) {
    urls.push({ url: `${BASE}/comparativas/${c.slug}/`, lastModified: hoy, priority: 0.8 });
  }
  return urls;
}
