import fs from 'fs';
import path from 'path';
import { getAllGeo } from '@/lib/geo/articles';

export const dynamic = 'force-static';

const BASE = 'https://omona.tech';

export async function GET() {
  const { articulos, comparativas } = getAllGeo();
  let entidad = '';
  const llmsPath = path.join(process.cwd(), 'data', 'geo', 'llms.txt');
  if (fs.existsSync(llmsPath)) entidad = fs.readFileSync(llmsPath, 'utf8').trim();

  const lines: string[] = [];
  lines.push('# Omona', '');
  if (entidad) lines.push(entidad, '');
  lines.push('## Mapa del sitio', '');
  lines.push(`- [Inicio](${BASE}/): agente de IA para ventas B2B por WhatsApp.`);
  lines.push(`- [Demo](${BASE}/demo): prueba el agente en vivo.`);
  lines.push(`- [Blog](${BASE}/blog): ${articulos.length} guías.`);
  for (const a of articulos) lines.push(`  - [${a.title}](${BASE}/blog/${a.slug})`);
  lines.push(`- [Comparativas](${BASE}/comparativas): ${comparativas.length} análisis vs competidores.`);
  for (const c of comparativas) lines.push(`  - [${c.title}](${BASE}/comparativas/${c.slug})`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
