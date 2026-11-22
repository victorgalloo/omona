import { ogCard, OG_SIZE } from '@/lib/og';

export const alt = 'Omona: prospectar, seguir y cerrar sin capturar nada';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({
    eyebrow: 'prospectar · seguir · cerrar',
    title: 'Prospectar, seguir y cerrar. Sin capturar cada paso a mano.',
    footer: 'agentes probados antes de operar',
  });
}
