import { getGeo, getGeoBySlug } from "@/lib/geo/articles";
import { GeoPage, geoMetadata, articleJsonLd } from "@/components/geo/geo-views";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getGeo("delivery").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
): Promise<Metadata> {
  const a = getGeoBySlug("delivery", params.slug);
  return a ? geoMetadata(a) : { title: "Delivery | Omona" };
}

export default function Page({ params }: { params: { slug: string } }) {
  const a = getGeoBySlug("delivery", params.slug);
  if (!a) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd(a) }}
      />
      <GeoPage kind="delivery" slug={params.slug} />
    </>
  );
}
