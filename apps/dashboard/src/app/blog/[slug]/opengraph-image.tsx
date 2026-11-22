import { ogCard, OG_SIZE } from '@/lib/og';
import { getNota, getNotas, fechaCorta } from '@/lib/notas';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Nota de ingeniería · Omona';

export function generateStaticParams() {
  return getNotas().map((n) => ({ slug: n.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const n = getNota(params.slug);
  return ogCard({
    eyebrow: n ? `nota de ingeniería · ${fechaCorta(n.date)}` : 'notas de ingeniería',
    title: n ? n.title.split(':')[0] : 'Notas de ingeniería',
    footer: 'Victor Gallo',
  });
}
