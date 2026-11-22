import { ogCard, OG_SIZE } from '@/lib/og';
import { getNota, getNotas, fechaCorta } from '@/lib/notas';
import { getAllGeo, getArticulo } from '@/lib/geo/articles';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Blog de Omona';

export function generateStaticParams() {
  return [
    ...getNotas().map((n) => ({ slug: n.slug })),
    ...getAllGeo().articulos.map((a) => ({ slug: a.slug })),
  ];
}

export default function Image({ params }: { params: { slug: string } }) {
  const n = getNota(params.slug);
  if (n) {
    return ogCard({ eyebrow: `nota de ingeniería · ${fechaCorta(n.date)}`, title: n.title.split(':')[0], footer: 'Victor Gallo' });
  }
  const a = getArticulo(params.slug);
  return ogCard({ eyebrow: 'guía · blog de omona', title: a?.title ?? 'Blog de Omona' });
}
