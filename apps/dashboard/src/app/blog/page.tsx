import { getAllGeo } from "@/lib/geo/articles";
import { BlogIndex } from "@/components/geo/geo-views";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guías de IA para ventas B2B por WhatsApp, actualizadas y con fuentes.",
  alternates: { canonical: "https://omona.tech/blog/" },
};

export default function BlogPage() {
  return <BlogIndex kind="articulo" />;
}
