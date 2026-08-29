import { getAllGeo } from "@/lib/geo/articles";
import { BlogIndex } from "@/components/geo/geo-views";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Comparativas",
  description:
    "Omona frente a Cliengo, ManyChat, Wati y Respond.io: comparativas técnicas honestas.",
  alternates: { canonical: "https://omona.tech/comparativas/" },
};

export default function ComparativasPage() {
  return <BlogIndex kind="comparativa" />;
}
