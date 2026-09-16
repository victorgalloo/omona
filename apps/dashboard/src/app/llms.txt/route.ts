import fs from 'fs';
import path from 'path';
import { getAllGeo } from '@/lib/geo/articles';

export const dynamic = 'force-static';

const BASE = 'https://omona.tech';

export async function GET() {
  const { articulos, comparativas, servicios } = getAllGeo();
  let entidad = '';
  const llmsPath = path.join(process.cwd(), 'data', 'geo', 'llms.txt');
  if (fs.existsSync(llmsPath)) entidad = fs.readFileSync(llmsPath, 'utf8').trim();

  const lines: string[] = [];
  lines.push('# Omona', '');
  if (entidad) lines.push(entidad, '');
  lines.push('## Mapa del sitio', '');
  // Esta línea decía "agente de IA para ventas B2B por WhatsApp" y contradecía
  // el bloque de entidad de arriba: el producto de WhatsApp es evidencia, no la
  // oferta. Era además lo primero que leía un motor generativo del sitio.
  lines.push(`- [Inicio](${BASE}/): socio técnico de delivery de automatizaciones con Claude.`);
  lines.push(
    `- [Servicios](${BASE}/servicios): ${servicios.length} formas de entrar, según el estado del proyecto.`,
  );
  for (const s of servicios) lines.push(`  - [${s.title}](${BASE}/servicios/${s.slug})`);
  lines.push(`- [Cómo trabajamos](${BASE}/como-trabajamos): proceso, alcance y qué queda instalado.`);
  lines.push('');
  lines.push('## Evidencia de producción', '');
  lines.push(
    'Lo que sigue documenta el sistema de inteligencia comercial que Omona construyó y opera sobre WhatsApp. Es la credencial de delivery, no el catálogo de servicios.',
    '',
  );
  lines.push(`- [Demo](${BASE}/demo): el agente propio, funcionando.`);
  lines.push(`- [Blog](${BASE}/blog): ${articulos.length} guías.`);
  for (const a of articulos) lines.push(`  - [${a.title}](${BASE}/blog/${a.slug})`);
  lines.push(`- [Comparativas](${BASE}/comparativas): ${comparativas.length} análisis vs competidores.`);
  for (const c of comparativas) lines.push(`  - [${c.title}](${BASE}/comparativas/${c.slug})`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
