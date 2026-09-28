import Link from "next/link";
import { ArrowRight, Bot, Compass, Gauge, LineChart, Target, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { HeroVisual } from "@/components/sections/hero-visual";
import { Section, SectionHeading } from "@/components/sections/section";
import { ServiceCard } from "@/components/sections/service-card";
import { Testimonials } from "@/components/sections/testimonials";
import { DashboardPreview } from "@/components/sections/dashboard-preview";
import { QuickLeadForm } from "@/components/forms/quick-lead-form";
import { TiendaOpticaMark } from "@/components/sections/tienda-optica-mark";
import { services } from "@/lib/content/services";
import { differentiators } from "@/lib/content/company";
import { tiendaOptica } from "@/lib/content/cases";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Agencia de marketing digital en Medellín | NEXO",
  description:
    "Agencia de marketing digital en Medellín: estrategia, redes, contenido y pauta con un panel donde ves cada resultado. Agenda tu asesoría gratuita.",
  path: "/",
  keywords: ["agencia de marketing digital en Medellín", "marketing digital Medellín", "agencia de marketing Colombia"],
});

const pillars = [
  { icon: Target, title: "Metas con número", body: "Cada plan arranca con una meta medible y un plazo, como +20 % de conversión en 6 meses." },
  { icon: Users, title: "Especialistas, no generalistas", body: "SEO, copy, redes y curaduría a cargo de una persona distinta, con nombre propio." },
  { icon: LineChart, title: "Resultados a la vista", body: "Un panel con tus cifras por canal, actualizado, para que nunca tengas que preguntar cómo vamos." },
];

const diffIcons = { gauge: Gauge, bot: Bot, compass: Compass, users: Users } as const;

export default function HomePage() {
  const headline = tiendaOptica.metrics[0];
  return (
    <>
      {/* 1.1 Hero */}
      <section className="grain relative overflow-hidden pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pb-24 md:pt-[calc(var(--header-h)+4rem)]">
        <div className="container-nexo grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 className="font-bold">
              <span className="eyebrow block">Agencia de marketing digital en Medellín</span>
              <span className="mt-5 block text-display leading-[0.98]">
                Marketing que <span className="text-gradient">se mide.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lead text-muted">
              Estrategia, contenido y pauta para marcas y pymes de Colombia, con una promesa simple: siempre puedes ver qué se hizo, cuánto
              costó y qué produjo.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic>
                <ButtonLink href="/contacto" size="lg" className="w-full sm:w-auto">
                  Potencia tu marca
                  <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="/portafolio/tienda-optica" variant="secondary" size="lg">
                Ver resultados reales
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-muted">Asesoría inicial gratuita · Respuesta en menos de 24 horas hábiles</p>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* 1.2 Propuesta de valor */}
      <Section tone="light" labelledBy="valor">
        <SectionHeading
          id="valor"
          eyebrow="Propuesta de valor"
          title="¿Qué significa marketing que se mide?"
          answer="Significa que cada acción tiene una meta numérica, un responsable y un lugar donde revisar el resultado. En NEXO no entregamos informes con capturas bonitas: te damos acceso a un panel con tus leads, conversiones y costo por canal, y te explicamos qué hacer con esos datos."
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="card p-7">
              <p.icon aria-hidden className="h-8 w-8 text-accent" />
              <h3 className="mt-5 text-h3 font-semibold">{p.title}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 1.3 Servicios destacados */}
      <Section labelledBy="servicios-destacados">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="servicios-destacados"
            eyebrow="Servicios"
            title="Seis servicios de marketing digital, un mismo tablero"
            answer="Puedes contratar uno o combinarlos. Todos reportan en el mismo panel, así ves cómo se afectan entre sí."
          />
          <Link href="/servicios" className="link shrink-0 font-semibold">
            Ver entregables y KPI de cada servicio
          </Link>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 0.08}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 1.4 ¿Por qué NEXO? */}
      <Section tone="light" labelledBy="por-que">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            id="por-que"
            eyebrow="¿Por qué NEXO?"
            title="Cuatro diferencias que se notan desde el primer mes"
            answer="Muchas agencias publican y pautan. Nosotros definimos primero qué medir, lo conectamos a un panel y asignamos un especialista por frente. Por eso sabes en todo momento cómo va tu inversión."
          />
          <ul className="grid gap-5 sm:grid-cols-2">
            {differentiators.map((d, i) => {
              const Icon = diffIcons[d.icon];
              return (
                <Reveal as="li" key={d.title} delay={i * 0.06} className="card p-6">
                  <Icon aria-hidden className="h-7 w-7 text-accent-2" />
                  <h3 className="mt-4 text-xl font-semibold">{d.title}</h3>
                  <p className="mt-2 text-muted">{d.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* 1.5 Prueba social */}
      <Section labelledBy="prueba-social">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Caso de éxito · Tienda Óptica</p>
            <h2 id="prueba-social" className="mt-3 text-h2 font-bold">
              Una óptica de barrio que ahora sabe qué canal le trae citas
            </h2>
            <div className="mt-8 flex items-end gap-4">
              <CountUp value={headline.value} prefix={headline.prefix} suffix={headline.suffix} className="font-sans text-[clamp(3.5rem,2.5rem+4vw,6rem)] font-semibold leading-none text-accent" />
            </div>
            <p className="mt-3 text-lg font-semibold">{headline.label}</p>
            <p className="text-muted">{headline.context}. Dato ilustrativo de la simulación del panel.</p>
            <div className="mt-8 flex items-center gap-4">
              <TiendaOpticaMark />
              <Link href="/portafolio/tienda-optica" className="link font-semibold">
                Leer el caso completo de Tienda Óptica
              </Link>
            </div>
          </div>
          <Testimonials layout="stack" />
        </div>
      </Section>

      {/* 1.6 Vista previa del panel */}
      <Section tone="light" labelledBy="panel-preview">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="panel-preview"
              eyebrow="Panel de clientes"
              title="Tus números, siempre a la vista"
              answer="Cada cliente de NEXO entra con usuario y contraseña a un panel con sus KPIs, el embudo, los leads por banda de lead scoring y el estado de las campañas. Puedes filtrar por fechas y canal, y exportar todo a CSV."
            />
            <ButtonLink href="/panel" size="lg" className="mt-8">
              Conoce el panel
              <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <p className="mt-3 text-sm text-muted">Usuario demo: demo@tiendaoptica.co · contraseña: nexo2026</p>
          </div>
          <Reveal>
            <DashboardPreview />
          </Reveal>
        </div>
      </Section>

      {/* 1.7 CTA final */}
      <section aria-labelledby="cta-final" className="py-20 md:py-24">
        <div className="container-nexo">
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,var(--brand-green)_0%,#0b5d4b_45%,#3d3794_100%)] px-6 py-14 md:px-16 md:py-20">
            <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-purple/40 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <h2 id="cta-final" className="text-h2 font-bold text-white">
                  Cuéntanos qué quieres lograr. Te decimos cómo medirlo.
                </h2>
                <p className="mt-4 text-lead text-[#d8ece4]">
                  Déjanos tu correo y el servicio que te interesa. En menos de 24 horas hábiles te escribimos para agendar una asesoría
                  gratuita de 30 minutos.
                </p>
              </div>
              <QuickLeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
