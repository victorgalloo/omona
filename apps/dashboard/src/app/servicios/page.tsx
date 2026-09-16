import type { Metadata } from "next";
import { BlogIndex } from "@/components/geo/geo-views";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Servicios | Delivery técnico de Claude para consultoras",
  description:
    "Auditoría de production readiness, sprint de piloto a producción, construcción de workflows Claude, delivery white-label y rescate de automatizaciones que fallan.",
  alternates: { canonical: "https://omona.tech/servicios" },
};

export default function Page() {
  return <BlogIndex kind="servicio" />;
}
