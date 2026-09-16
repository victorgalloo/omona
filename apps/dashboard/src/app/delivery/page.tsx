import type { Metadata } from "next";
import { BlogIndex } from "@/components/geo/geo-views";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Delivery | Llevar automatizaciones Claude a producción",
  description:
    "Arquitectura, permisos, evaluaciones, human-in-the-loop, observabilidad y transferencia operativa. Lo que separa un piloto de IA de un sistema que el cliente puede operar.",
  alternates: { canonical: "https://omona.tech/delivery" },
};

export default function Page() {
  return <BlogIndex kind="delivery" />;
}
