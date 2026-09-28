import Link from "next/link";
import { Check, Info, Minus } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { Pricing } from "@/components/sections/pricing";
import { comparison, plans } from "@/lib/content/plans";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Planes de marketing digital y precios en Colombia | NEXO",
  description:
    "Planes de marketing digital con precios de referencia en Colombia: Starter, Growth y Full Brand, sin permanencia. Compáralos y agenda tu asesoría.",
  path: "/planes",
  keywords: ["planes de marketing digital precios Colombia", "cuánto cuesta una agencia de marketing"],
});

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <>
        <Check aria-hidden className="mx-auto h-5 w-5 text-accent" />
        <span className="sr-only">Incluido</span>
      </>
    );
  if (value === false)
    return (
      <>
        <Minus aria-hidden className="mx-auto h-5 w-5 text-muted" />
        <span className="sr-only">No incluido</span>
      </>
    );
  return <span>{value}</span>;
}

export default function PlanesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Planes", path: "/planes" }]}
        eyebrow="Planes y precios"
        title={
          <>
            Planes de marketing digital con <span className="text-gradient">precios claros</span>
          </>
        }
        lead={
          <p>
            ¿Cómo elegir? Si estás empezando a ordenar tus redes, <strong className="text-fg">Starter</strong>. Si ya vendes y quieres crecer con
            pauta y datos, <strong className="text-fg">Growth</strong>. Si necesitas marca, sitio web y un equipo completo,{" "}
            <strong className="text-fg">Full Brand</strong>. Todos incluyen acceso al{" "}
            <Link href="/panel" className="link">
              panel de resultados
            </Link>
            .
          </p>
        }
      />

      <Section tone="light" labelledBy="planes-title" className="pt-16">
        <h2 id="planes-title" className="sr-only">
          Los tres planes de NEXO
        </h2>
        <Pricing />
        <p className="mx-auto mt-12 flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-surface p-5 text-sm text-muted">
          <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <span>
            <strong className="text-fg">Los precios son de referencia y se ajustan según la necesidad de cada marca</strong>: número de redes, volumen
            de contenido y sedes. No incluyen la inversión en pauta, que pagas directamente a Meta o Google. Valores en pesos colombianos, antes de
            IVA.
          </span>
        </p>
      </Section>

      <Section labelledBy="comparativa">
        <SectionHeading
          id="comparativa"
          eyebrow="Comparativa"
          title="¿Qué incluye cada plan de marketing digital?"
          answer="La diferencia principal está en la profundidad de la estrategia, el número de piezas al mes y el tipo de pauta. El panel de resultados está en los tres."
        />
        <div className="relative mt-12 overflow-x-auto rounded-[var(--r-card)] border border-border" tabIndex={0} role="region" aria-label="Tabla comparativa de planes (desplazable)">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Comparación de funcionalidades entre los planes Starter, Growth y Full Brand</caption>
            <thead className="bg-surface-2">
              <tr>
                <th scope="col" className="p-4 font-display font-semibold">
                  Funcionalidad
                </th>
                {plans.map((p) => (
                  <th key={p.id} scope="col" className={`p-4 text-center font-display font-semibold ${p.highlighted ? "text-accent" : ""}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-t border-border">
                  <th scope="row" className="p-4 font-normal text-muted">
                    {row.feature}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-4 text-center">
                      <Cell value={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <CtaBand
        id="cta-planes"
        title="¿No sabes cuál elegir?"
        body="En 30 minutos revisamos tu marca y te recomendamos el plan que tiene sentido hoy, aunque sea el más pequeño."
        cta="Agenda una asesoría gratuita"
        href="/contacto?plan=growth"
      />
    </>
  );
}
