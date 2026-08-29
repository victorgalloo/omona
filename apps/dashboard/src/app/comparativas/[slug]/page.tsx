import { getAllGeo, getComparativa } from "@/lib/geo/articles";
import { ComparativaPage, geoMetadata, articleJsonLd } from "@/components/geo/geo-views";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllGeo().comparativas.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const c = getComparativa(params.slug);
  return c ? geoMetadata(c) : { title: "Comparativas | Omona" };
}

export default function Page({ params }: { params: { slug: string } }) {
  const c = getComparativa(params.slug);
  if (!c) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd(c) }}
      />
      <ComparativaPage slug={params.slug} />
    </>
  );
}
