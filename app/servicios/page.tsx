import Link from "next/link";
import { CheckCircle2, FileCheck2, Gauge, Glasses } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { ScrollSpy } from "@/components/sections/scroll-spy";
import { OmnichannelDiagram } from "@/components/sections/omnichannel-diagram";
import { JsonLd } from "@/components/seo/json-ld";
import { services } from "@/lib/content/services";
import { servicesJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Servicios de marketing digital para empresas | NEXO",
  description:
    "Servicios de marketing digital para empresas: estrategia, redes, contenido, pauta y medición, con entregables y KPI claros. Mira qué incluye cada uno.",
  path: "/servicios",
  keywords: ["servicios de marketing digital para empresas", "servicios de marketing digital Medellín"],
});

const spyItems = [...services.map((s) => ({ id: s.slug, label: s.title })), { id: "omnicanalidad", label: "Integración omnicanal" }];

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Servicios", path: "/servicios" }]}
        eyebrow="Servicios"
        title={
          <>
            Servicios de marketing digital para empresas que <span className="text-gradient">quieren ver resultados</span>
          </>
        }
        lead={
          <p>
            Seis servicios que puedes contratar por separado o combinados en un{" "}
            <Link href="/planes" className="link">
              plan mensual
            </Link>
            . En cada uno te decimos qué incluye, qué te entregamos, qué indicadores medimos y cómo lo aplicamos en un caso real.
          </p>
        }
      />

      <div data-tone="light" className="relative">
        <div className="container-nexo">
          <ScrollSpy items={spyItems} variant="tabs" />
          <div className="grid gap-12 py-16 lg:grid-cols-[15rem_1fr] lg:py-24">
            <aside>
              <ScrollSpy items={spyItems} variant="side" />
            </aside>
            <div className="space-y-24">
              {services.map((s, i) => (
                <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`} className="scroll-mt-40">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-accent">
                      <s.icon aria-hidden className="h-7 w-7" />
                    </span>
                    <span className="font-display text-sm font-semibold text-muted">0{i + 1} / 06</span>
                  </div>
                  <h2 id={`${s.slug}-title`} className="mt-5 text-h2 font-bold">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-lead text-muted">{s.answer}</p>

                  <div className="mt-10 grid gap-5 md:grid-cols-3">
                    <div className="card p-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <CheckCircle2 aria-hidden className="h-5 w-5 text-accent" /> Qué incluye
                      </h3>
                      <ul className="mt-4 space-y-2.5 text-muted">
                        {s.includes.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card p-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <FileCheck2 aria-hidden className="h-5 w-5 text-accent" /> Entregables
                      </h3>
                      <ul className="mt-4 space-y-2.5 text-muted">
                        {s.deliverables.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card p-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <Gauge aria-hidden className="h-5 w-5 text-accent" /> KPI que medimos
                      </h3>
                      <ul className="mt-4 space-y-2.5 text-muted">
                        {s.kpis.map((x) => (
                          <li key={x} className="flex gap-2">
                            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 rounded-[var(--r-card)] border border-border bg-surface-2 p-6 md:flex-row md:items-start">
                    <Glasses aria-hidden className="h-7 w-7 shrink-0 text-accent-2" />
                    <div>
                      <h3 className="font-semibold">Aplicado en {s.example.title}</h3>
                      <p className="mt-1 text-muted">{s.example.body}</p>
                      <Link href="/portafolio/tienda-optica" className="link mt-3 inline-block text-sm font-semibold">
                        Ver el caso completo de Tienda Óptica
                      </Link>
                    </div>
                  </div>

                  {/* Ley de Proximidad: CTA inmediatamente después de la descripción del servicio. */}
                  <Link
                    href={`/contacto?servicio=${s.slug}`}
                    className="mt-6 inline-flex min-h-12 items-center font-semibold text-link underline underline-offset-4"
                  >
                    Solicitar {s.title.toLowerCase()}
                  </Link>
                </section>
              ))}

              <section id="omnicanalidad" aria-labelledby="omnicanalidad-title" className="scroll-mt-40">
                <SectionHeading
                  id="omnicanalidad-title"
                  eyebrow="Integración omnicanal"
                  title="¿Cómo se conectan tus canales con el panel?"
                  answer="Cada canal tiene un trabajo distinto dentro del embudo y todos envían sus datos al mismo panel. Así sabes, por ejemplo, que un cliente vio un reel, dejó su correo en el quiz, recibió la bienvenida y terminó comprando en la tienda con el QR del Club."
                />
                <div className="mt-12">
                  <OmnichannelDiagram />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Section labelledBy="como-trabajamos">
        <SectionHeading
          id="como-trabajamos"
          eyebrow="Cómo trabajamos"
          title="De la asesoría al primer reporte en 4 semanas"
          answer="Semana 1: diagnóstico y metas. Semana 2: plan de medición y configuración del panel. Semana 3: primeras piezas y campañas. Semana 4: primer corte de resultados con lectura de Vera."
        />
      </Section>

      <CtaBand
        id="cta-servicios"
        title="Quiero potenciar mi marca"
        body="Cuéntanos qué servicio te interesa. En la asesoría gratuita te decimos qué medir y qué resultado es realista en 6 meses."
        cta="Quiero potenciar mi marca"
        href="/contacto"
        secondary={{ label: "Comparar planes", href: "/planes" }}
      />

      <JsonLd data={servicesJsonLd(services)} />
    </>
  );
}
