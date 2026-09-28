import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/content/services";

/** Ley de Semejanza: todas las tarjetas de servicio tienen ícono → título → frase → enlace. */
export function ServiceCard({ service, headingLevel = "h3" }: { service: Service; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Link
      href={`/servicios#${service.slug}`}
      className="card group flex h-full flex-col p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-lift"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-accent">
        <service.icon aria-hidden className="h-6 w-6" />
      </span>
      <H className="mt-6 text-h3 font-semibold">{service.title}</H>
      <p className="mt-3 text-muted">{service.short}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-link">
        Qué incluye {service.title.toLowerCase()}
        <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
