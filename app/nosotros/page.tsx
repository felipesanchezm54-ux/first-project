import Link from "next/link";
import { Eye, Flag } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { TeamCard } from "@/components/sections/team-card";
import { Reveal } from "@/components/motion/reveal";
import { differentiators, mission, team, values, vision } from "@/lib/content/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nosotros: equipo de marketing en Medellín | NEXO",
  description:
    "Conoce al equipo de NEXO, agencia de marketing en Medellín: especialistas en SEO, copy, redes y contenido, más Vera, nuestra agente de IA. Conócenos.",
  path: "/nosotros",
  keywords: ["agencia de marketing Medellín equipo", "equipo de marketing digital Medellín"],
});

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Nosotros", path: "/nosotros" }]}
        eyebrow="Nosotros"
        title={
          <>
            El equipo de marketing en Medellín que <span className="text-gradient">te muestra los números</span>
          </>
        }
        lead={
          <p>
            NEXO es una agencia de marketing digital de Medellín que trabaja con marcas y pymes de Colombia. Hacemos estrategia, contenido,
            redes, pauta y medición, y lo reportamos todo en un panel al que nuestros clientes entran cuando quieren.
          </p>
        }
      />

      {/* 2.1 Presentación */}
      <Section tone="light" labelledBy="quienes-somos">
        <div className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            id="quienes-somos"
            eyebrow="Quiénes somos"
            title="¿Quién está detrás de NEXO?"
            answer="Somos cuatro especialistas y una agente de IA. Nacimos en Medellín en 2024 con una idea: el cliente de una agencia no debería tener que pedir un informe para saber si su inversión funciona."
          />
          <div className="space-y-5 text-lg text-muted">
            <p>
              <strong className="text-fg">Qué hacemos:</strong> diagnosticamos tu marca frente a la competencia, definimos un embudo con metas por
              etapa y ejecutamos lo necesario para cumplirlas: contenido, redes sociales, email, pauta y sitio web.
            </p>
            <p>
              <strong className="text-fg">Para quién:</strong> marcas y pymes colombianas que ya venden, que tienen presencia digital pero no saben
              qué canal les trae clientes. Nuestro caso de referencia es{" "}
              <Link href="/portafolio/tienda-optica" className="link">
                Tienda Óptica
              </Link>
              , una óptica familiar con dos sedes en Medellín.
            </p>
            <p>
              <strong className="text-fg">Cómo:</strong> cada frente tiene un responsable con nombre propio y cada acción queda registrada en el{" "}
              <Link href="/panel" className="link">
                panel de clientes
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* 2.2 y 2.3 Misión y visión */}
      <Section labelledBy="mision-vision">
        <h2 id="mision-vision" className="sr-only">
          Misión y visión
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="card p-8 md:p-10">
            <Flag aria-hidden className="h-8 w-8 text-accent" />
            <h3 className="mt-5 text-h3 font-semibold">Misión</h3>
            <p className="mt-3 text-lg text-muted">{mission}</p>
          </Reveal>
          <Reveal delay={0.08} className="card p-8 md:p-10">
            <Eye aria-hidden className="h-8 w-8 text-accent-2" />
            <h3 className="mt-5 text-h3 font-semibold">Visión</h3>
            <p className="mt-3 text-lg text-muted">{vision}</p>
          </Reveal>
        </div>
      </Section>

      {/* 2.4 Valores */}
      <Section tone="light" labelledBy="valores">
        <SectionHeading
          id="valores"
          eyebrow="Valores"
          title="Cinco valores que se traducen en hábitos"
          answer="Un valor solo sirve si cambia cómo trabajamos. Por eso cada uno viene con la práctica concreta que lo sostiene."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 0.06} className="card p-6">
              <v.icon aria-hidden className="h-7 w-7 text-accent" />
              <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted">{v.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 2.5 Diferencial */}
      <Section labelledBy="diferencial">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            id="diferencial"
            eyebrow="Nuestro diferencial"
            title="¿Qué hace diferente a NEXO de otra agencia?"
            answer="La transparencia medible. Otras agencias entregan un PDF a fin de mes; en NEXO ves tus cifras cuando quieras, con una lectura de Vera que te dice qué cambió y qué hacer. Y no pautamos sin estrategia: la inversión en anuncios llega después del diagnóstico."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {differentiators.map((d) => (
              <li key={d.title} className="card p-6">
                <h3 className="text-lg font-semibold">{d.title}</h3>
                <p className="mt-2 text-muted">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 2.6 Equipo */}
      <Section tone="light" labelledBy="equipo">
        <SectionHeading
          id="equipo"
          eyebrow="Nuestro equipo"
          title="Quién responde por cada frente"
          answer="Cada persona lidera una especialidad. Cuando escribes, sabes quién te va a contestar."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <Reveal as="li" key={m.name} delay={(i % 3) * 0.08}>
              <TeamCard member={m} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 2.7 CTA */}
      <CtaBand
        id="cta-nosotros"
        title="¿Trabajamos juntos?"
        body="Agenda una asesoría gratuita de 30 minutos con el equipo. Revisamos tu marca y te decimos por dónde empezar."
        cta="Agenda tu asesoría"
        href="/contacto"
        secondary={{ label: "Ver servicios", href: "/servicios" }}
      />
    </>
  );
}
