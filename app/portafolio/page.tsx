import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { MetricGrid } from "@/components/sections/metric-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { TiendaOpticaMark } from "@/components/sections/tienda-optica-mark";
import { ButtonLink } from "@/components/ui/button";
import { portfolioItems, tiendaOptica } from "@/lib/content/cases";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Casos de éxito en marketing digital | NEXO",
  description:
    "Casos de éxito de marketing digital de NEXO contados con cifras: problema, estrategia y resultado de cada proyecto, empezando por Tienda Óptica. Míralos.",
  path: "/portafolio",
  keywords: ["casos de éxito marketing digital", "portafolio agencia de marketing Medellín"],
});

export default function PortafolioPage() {
  const c = tiendaOptica;
  return (
    <>
      <PageHero
        crumbs={[{ name: "Portafolio", path: "/portafolio" }]}
        eyebrow="Portafolio"
        title={
          <>
            Casos de éxito en marketing digital, <span className="text-gradient">siempre con la cifra al lado</span>
          </>
        }
        lead={
          <p>
            Contamos cada proyecto en cuatro partes: la marca, el problema que tenía, la estrategia que aplicamos y el resultado medido. Las cifras
            que vienen de simulaciones del panel están marcadas como ilustrativas.
          </p>
        }
      />

      {/* 6.2 Proyectos */}
      <Section tone="light" labelledBy="proyectos">
        <SectionHeading id="proyectos" eyebrow="Proyecto principal" title="Tienda Óptica: de publicar sin rumbo a un embudo medible" />
        <article className="card mt-10 overflow-hidden">
          <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <TiendaOpticaMark />
              <p className="mt-5 text-sm text-muted">
                {c.sector} · {c.city}
              </p>
              <p className="mt-3 text-lg">{c.summary}</p>
              <ButtonLink href={`/portafolio/${c.slug}`} className="mt-8">
                Leer el caso completo
                <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </div>
            <dl className="grid gap-5 sm:grid-cols-3">
              {[
                { t: "Problema", d: c.problem },
                { t: "Estrategia", d: c.strategy },
                { t: "Resultado", d: c.result },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl bg-surface-2 p-5">
                  <dt className="font-display font-semibold text-accent">{x.t}</dt>
                  <dd className="mt-2 text-sm text-muted">{x.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </article>
        <div className="mt-8">
          <MetricGrid metrics={c.metrics} />
          <p className="mt-4 text-sm text-muted">Cifras ilustrativas: simulación del panel con fines académicos.</p>
        </div>
      </Section>

      {/* 6.3 Portafolio visual */}
      <Section labelledBy="piezas">
        <SectionHeading
          id="piezas"
          eyebrow="Portafolio visual"
          title="Las piezas del proyecto, por servicio"
          answer="Cada tarjeta es un entregable real del proyecto Tienda Óptica. Filtra por servicio para ver qué hicimos en cada frente."
        />
        <div className="mt-10">
          <PortfolioGrid items={portfolioItems} />
        </div>
      </Section>

      {/* 6.4 Testimonios */}
      <Section tone="light" labelledBy="testimonios">
        <SectionHeading id="testimonios" eyebrow="Testimonios" title="Lo que dice el equipo de Tienda Óptica" />
        <div className="mt-10">
          <Testimonials />
        </div>
        <p className="mt-8">
          <Link href="/servicios" className="link font-semibold">
            Conoce los servicios que usamos en este proyecto
          </Link>
        </p>
      </Section>

      <CtaBand
        id="cta-portafolio"
        title="¿Tu marca puede ser el próximo caso?"
        body="Cuéntanos tu reto. Te proponemos una meta medible y te mostramos cómo la vamos a seguir en el panel."
        cta="Quiero una propuesta"
        href="/contacto"
      />
    </>
  );
}
