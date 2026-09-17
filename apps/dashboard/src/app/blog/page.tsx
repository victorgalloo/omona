import { getAllGeo } from "@/lib/geo/articles";
import { BlogIndex } from "@/components/geo/geo-views";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ingeniería de agentes para equipos comerciales: autonomía, evaluaciones, arquitectura, costos y medición. Más el corpus de automatización de ventas B2B por WhatsApp.",
  alternates: { canonical: "https://omona.tech/blog" },
};

export default function BlogPage() {
  return <BlogIndex kind="articulo" />;
}
