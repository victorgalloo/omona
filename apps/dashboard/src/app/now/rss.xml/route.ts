import { BASE } from '@/lib/entidad';
import nowData from '../../../../data/now/now.json';

export const dynamic = 'force-static';

type Item = { date: string; kind: string; es: string; url: string | null; ref: string };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** RSS 2.0 de la bitácora «Ahora» (data/now/now.json, se regenera a diario). */
export async function GET() {
  const d = nowData as unknown as { updated: string; items: Item[] };
  const items = d.items
    .map((it) => {
      const link = it.url || `${BASE}/now`;
      const guid = `${BASE}/now#${encodeURIComponent(`${it.kind}-${it.ref}`)}`;
      return `    <item>
      <title>${esc(it.es)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">${esc(guid)}</guid>
      <pubDate>${new Date(`${it.date}T12:00:00-06:00`).toUTCString()}</pubDate>
      <dc:creator>Victor Gallo</dc:creator>
      <category>${esc(it.kind)}</category>
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Victor Gallo · Ahora</title>
    <link>${BASE}/now</link>
    <atom:link href="${BASE}/now/rss.xml" rel="self" type="application/rss+xml" />
    <description>Bitácora diaria de Victor Gallo: pull requests, reportes, notas, eventos y programas.</description>
    <language>es-MX</language>
    <lastBuildDate>${new Date(`${d.updated}T12:00:00-06:00`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
