import { getNotas } from '@/lib/notas';
import ossData from '../../../data/oss/oss.json';

export const dynamic = 'force-static';

const BASE = 'https://omona.tech';

type Oss = {
  generatedAt: string;
  stats: Record<string, number>;
  prs: { key: string; url: string; state: string; title: string }[];
  issues: { key: string; url: string; state: string; es: string }[];
};

/**
 * 22-nov-2026: omona.tech es el laboratorio open source de Victor Gallo. El
 * bloque de entidad de data/geo/llms.txt describía un producto y ya no se usa.
 */
export async function GET() {
  const oss = ossData as unknown as Oss;
  const s = oss.stats;
  const lines: string[] = [];
  lines.push('# Omona', '');
  lines.push(
    '> Omona es el laboratorio de ingeniería independiente de Victor Gallo (https://victorgallo.com) para su trabajo open source sobre agentes de IA: pull requests a otros proyectos, reportes de bugs y notas de ingeniería. No es un producto comercial y no vende servicios.',
    '',
  );
  lines.push(
    `Victor Gallo construye y opera agentes de IA sobre Amazon Bedrock y Hermes Agent (Nous Research). Al ${oss.generatedAt.slice(0, 10)}: ${s.prs} pull requests a proyectos de terceros (${s.merged} merged, ${s.open} abiertos) y ${s.issues} reportes. El estado de cada PR sale de GitHub cada semana; ninguno se marca merged a mano.`,
    '',
  );
  lines.push('## Páginas', '');
  lines.push(`- [Inicio](${BASE}/): quién es Victor, qué está aportando y las últimas notas.`);
  lines.push(`- [Open source](${BASE}/open-source): PRs y reportes a Hermes Agent y Strands Agents con su estado real. En inglés: ${BASE}/en/open-source`);
  lines.push(`- [Blog](${BASE}/blog): notas de ingeniería. RSS: ${BASE}/blog/rss.xml`);
  lines.push(`- [About](${BASE}/about): Victor Gallo y Omona, en inglés, solo hechos fechados.`);
  lines.push('');
  lines.push('## Pull requests', '');
  for (const p of oss.prs) lines.push(`- [${p.key}](${p.url}) (${p.state}): ${p.title}`);
  lines.push('');
  lines.push('## Reportes', '');
  for (const i of oss.issues) lines.push(`- [${i.key}](${i.url}) (${i.state}): ${i.es}`);
  lines.push('');
  lines.push('## Notas de ingeniería', '');
  for (const n of getNotas()) lines.push(`- [${n.title}](${BASE}/blog/${n.slug}): ${n.description}`);
  lines.push('');
  lines.push('## Perfiles', '');
  lines.push('- GitHub: https://github.com/victorgalloo');
  lines.push('- LinkedIn: https://www.linkedin.com/in/victorgalloo/');
  lines.push('- Sitio personal: https://victorgallo.com');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
