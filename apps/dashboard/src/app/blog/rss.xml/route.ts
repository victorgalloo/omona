import { getNotas } from '@/lib/notas';
import { markdownToHtml } from '@/lib/geo/markdown';
import { BASE } from '@/lib/entidad';

export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** RSS 2.0 de las notas de ingeniería (las firmadas, con fecha). */
export async function GET() {
  const notas = getNotas();
  const items = notas
    .map((n) => {
      const url = `${BASE}/blog/${n.slug}`;
      return `    <item>
      <title>${esc(n.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${n.date}T12:00:00-06:00`).toUTCString()}</pubDate>
      <dc:creator>Victor Gallo</dc:creator>
      <description>${esc(n.description)}</description>
${n.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
      <content:encoded><![CDATA[${markdownToHtml(n.body).replaceAll(']]>', ']]]]><![CDATA[>').replaceAll('src="/', `src="${BASE}/`).replaceAll('href="/', `href="${BASE}/`)}]]></content:encoded>
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Omona · Notas de ingeniería</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Agentes en producción: lo que aprendimos arreglando cosas en Hermes Agent, Amazon Bedrock y más.</description>
    <language>es-MX</language>
    <lastBuildDate>${new Date(`${notas[0]?.updated ?? '2026-11-22'}T12:00:00-06:00`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
