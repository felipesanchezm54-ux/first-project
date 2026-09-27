import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: { absolute: "Página no encontrada | NEXO" },
  description: "La página que buscas no existe o cambió de dirección. Te dejamos los caminos más útiles del sitio de NEXO.",
  robots: { index: false, follow: true },
};

const exits = [
  { href: "/servicios", title: "Servicios", body: "Qué hacemos, qué entregamos y qué medimos." },
  { href: "/portafolio/tienda-optica", title: "Caso Tienda Óptica", body: "La estrategia completa, con cifras." },
  { href: "/planes", title: "Planes", body: "Starter, Growth y Full Brand." },
  { href: "/blog", title: "Blog", body: "Respuestas concretas a preguntas de marketing." },
];

export default function NotFound() {
  return (
    <section className="grain relative overflow-hidden pb-24 pt-[calc(var(--header-h)+4rem)]">
      <div className="container-nexo">
        <p className="eyebrow">Error 404 · Página no encontrada</p>
        <h1 className="mt-4 max-w-3xl text-h1 font-bold">
          Este enlace no llevó a ningún lado. <span className="text-gradient">Nuestros reportes sí.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lead text-muted">
          Puede que la dirección tenga un error de escritura o que la página haya cambiado de lugar. Estos son los caminos que más usan
          nuestros visitantes:
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exits.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="card group flex h-full flex-col p-6 transition-transform hover:-translate-y-1">
                <span className="font-display text-xl font-semibold group-hover:text-accent">{e.title}</span>
                <span className="mt-2 text-muted">{e.body}</span>
                <ArrowRight aria-hidden className="mt-auto h-5 w-5 pt-4 text-accent" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            Volver al inicio
          </ButtonLink>
          <ButtonLink href="/contacto" variant="secondary" size="lg">
            Escríbenos
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
