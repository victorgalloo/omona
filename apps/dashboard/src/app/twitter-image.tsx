import { ogCard, OG_SIZE } from '@/lib/og';

export const alt = 'Omona: el laboratorio open source de Victor Gallo';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({
    eyebrow: 'laboratorio open source · victor gallo',
    title: 'Agentes de IA sobre Amazon Bedrock. Los arreglos van upstream.',
    footer: 'github.com/victorgalloo',
  });
}
