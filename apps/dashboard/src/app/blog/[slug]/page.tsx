import { getAllGeo, getArticulo } from "@/lib/geo/articles";
import { ArticuloPage, geoMetadata, articleJsonLd } from "@/components/geo/geo-views";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllGeo().articulos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const a = getArticulo(params.slug);
  return a ? geoMetadata(a) : { title: "Blog | Omona" };
}

export default function Page({ params }: { params: { slug: string } }) {
  const a = getArticulo(params.slug);
  if (!a) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd(a) }}
      />
      <ArticuloPage slug={params.slug} />
    </>
  );
}
