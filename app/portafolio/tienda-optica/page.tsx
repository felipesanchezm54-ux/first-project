import Link from "next/link";
import { CalendarDays, Car, CheckCircle2, Mail, QrCode, RefreshCw, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { MetricGrid } from "@/components/sections/metric-grid";
import { Testimonials } from "@/components/sections/testimonials";
import { Reveal } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { tiendaOptica } from "@/lib/content/cases";
import { chartColors } from "@/lib/chart-palette";
import { articleJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Estrategia de marketing para ópticas | Caso NEXO",
  description:
    "Estrategia de marketing para ópticas paso a paso: benchmark, DOFA, embudo, lead scoring y email en el caso Tienda Óptica de Medellín. Mira el caso.",
  path: "/portafolio/tienda-optica",
  keywords: ["estrategia de marketing para ópticas", "marketing para ópticas Medellín", "caso de éxito óptica"],
  type: "article",
  publishedTime: tiendaOptica.publishedAt,
  modifiedTime: tiendaOptica.updatedAt,
  authors: [tiendaOptica.author.name],
});

const competitors = ["Ópticas GMO", "HD Ópticas", "Gafas & Gafas", "Clínica Sandiego / MasVision", "Lentesplus"];
const criteria = ["Propuesta de valor", "Tono de comunicación", "Contenido educativo", "Redes sociales", "Experiencia web", "Canales de contacto", "Precios visibles", "Programa de fidelización"];

const dofa = [
  { t: "Fortalezas", items: ["10 años de trayectoria y clientes fieles", "Optómetras con trato cercano", "Dos sedes en centros comerciales"] },
  { t: "Oportunidades", items: ["Nadie ocupa el rol de experto que educa", "Búsquedas locales de examen visual", "Brigadas visuales para empresas"] },
  { t: "Debilidades", items: ["Sin base de datos de clientes", "Redes sin estrategia ni medición", "Sin sitio web propio"] },
  { t: "Amenazas", items: ["Cadenas con gran presupuesto de pauta", "Venta de lentes en línea con envío", "Guerra de precios en monturas"] },
];

const journey = [
  { stage: "Descubre", does: "Busca «examen de la vista cerca» o ve un reel", pain: "No distingue una óptica de otra" },
  { stage: "Considera", does: "Revisa Instagram y pregunta precios por WhatsApp", pain: "Respuestas lentas y sin catálogo" },
  { stage: "Visita", does: "Va al centro comercial para el examen", pain: "El parqueo: costo y tiempo buscando lugar", main: true },
  { stage: "Compra", does: "Elige montura y lentes con el optómetra", pain: "Muchas opciones, poca guía" },
  { stage: "Usa y vuelve", does: "Usa sus gafas; necesita ajuste o renovación", pain: "Nadie le recuerda cuándo volver" },
];

const funnel = [
  { stage: "Atracción", action: "Contenido educativo del pilar El Sabio y pauta de alcance local", kpi: "Alcance, visitas nuevas" },
  { stage: "Interacción", action: "Quiz de estilo visual y guía descargable «Cómo leer tu fórmula»", kpi: "Leads con autorización" },
  { stage: "Conversión", action: "Landing con catálogo y WhatsApp; remarketing con parqueo gratis al agendar", kpi: "Citas agendadas, costo por lead" },
  { stage: "Fidelización", action: "Club Tienda Óptica con QR en caja y flujos de email", kpi: "Recompra, apertura de email" },
];

const bands = [
  { name: "Frío", range: "0–15" },
  { name: "Tibio", range: "16–30" },
  { name: "Interesado", range: "31–55" },
  { name: "Caliente", range: "56–85" },
  { name: "Fidelizado", range: "86+" },
];

const flows = [
  { name: "Bienvenida", when: "Al registrarse", goal: "Presentar la marca y entregar la guía" },
  { name: "Posventa", when: "3 días después de comprar", goal: "Cuidados de las gafas y encuesta" },
  { name: "Carrito abandonado", when: "24 h después de cotizar sin agendar", goal: "Resolver dudas y ofrecer cita" },
  { name: "Mantenimiento", when: "A los 6 meses", goal: "Ajuste y limpieza gratis en tienda" },
  { name: "Renovación de fórmula", when: "A los 12 meses", goal: "Agendar nuevo examen visual" },
];

// Avance mensual de la conversión digital vs. línea base (simulación del panel).
const monthly = [
  { m: "Mes 1", v: 4.7 },
  { m: "Mes 2", v: 7.8 },
  { m: "Mes 3", v: 11.0 },
  { m: "Mes 4", v: 14.4 },
  { m: "Mes 5", v: 17.9 },
];
const GOAL = 20;

export default function TiendaOpticaCase() {
  const c = tiendaOptica;
  return (
    <>
      <article>
        <header className="grain pb-16 pt-[calc(var(--header-h)+2rem)]">
          <div className="container-nexo">
            <Breadcrumbs
              items={[
                { name: "Portafolio", path: "/portafolio" },
                { name: "Tienda Óptica", path: "/portafolio/tienda-optica" },
              ]}
            />
            <p className="eyebrow mt-10">Caso de éxito · Salud visual · Medellín</p>
            <h1 className="mt-4 max-w-4xl text-h1 font-bold">
              Estrategia de marketing para ópticas: <span className="text-gradient">el caso Tienda Óptica</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lead text-muted">
              ¿Cómo hace una óptica familiar para competir con cadenas que invierten mucho más en pauta? Enseñando. Esta es la estrategia que NEXO
              diseñó para Tienda Óptica: posicionarla como la experta que educa y acompaña, capturar datos con consentimiento y medir cada etapa del
              embudo contra una meta de +20 % de conversión digital en 6 meses.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <p>
                Por <span className="font-semibold text-fg">{c.author.name}</span>, {c.author.role} en NEXO
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarDays aria-hidden className="h-4 w-4" /> Publicado el <time dateTime={c.publishedAt}>{formatDate(c.publishedAt)}</time>
              </p>
              <p className="flex items-center gap-1.5">
                <RefreshCw aria-hidden className="h-4 w-4" /> Actualizado el <time dateTime={c.updatedAt}>{formatDate(c.updatedAt)}</time>
              </p>
            </div>
            <nav aria-label="Partes del caso" className="mt-10">
              <ol className="flex flex-wrap gap-2">
                {[
                  ["reto", "1. Reto"],
                  ["diagnostico", "2. Diagnóstico"],
                  ["estrategia", "3. Estrategia"],
                  ["resultados", "4. Resultados"],
                ].map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-semibold hover:border-accent hover:text-accent">
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </header>

        {/* 1. Reto */}
        <Section tone="light" id="reto" labelledBy="reto-title">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">1 · El reto</p>
              <h2 id="reto-title" className="mt-3 text-h2 font-bold">
                ¿Cuál era el problema de Tienda Óptica?
              </h2>
              <p className="mt-5 text-lead text-muted">{c.problem}</p>
              <p className="mt-5 text-muted">
                Tienda Óptica es una óptica familiar con 10 años de trayectoria y dos sedes en Medellín (CC Santafé y Mall del Este). Ofrece examen de
                optometría, lentes de contacto, monturas y lentes, reparación, gafas de sol y brigadas visuales para empresas.
              </p>
            </div>
            <div className="space-y-5">
              <div className="card p-7">
                <Target aria-hidden className="h-7 w-7 text-accent" />
                <h3 className="mt-4 text-xl font-semibold">Objetivo estratégico</h3>
                <p className="mt-2 text-muted">
                  Aumentar <strong className="text-fg">20 % la conversión en canales digitales en 6 meses</strong> con marketing relacional.
                </p>
              </div>
              <div className="card p-7">
                <Sparkles aria-hidden className="h-7 w-7 text-accent-2" />
                <h3 className="mt-4 text-xl font-semibold">Branding: arquetipo El Sabio</h3>
                <p className="mt-2 text-muted">
                  Se definieron arquetipo, paleta, tipografía y buyer persona. La frase de marca guía todo el contenido:
                </p>
                <blockquote className="mt-4 border-l-4 border-accent pl-4 font-display text-xl font-semibold">
                  “No vendemos gafas. Formamos la mirada con la que ves el mundo.”
                </blockquote>
              </div>
            </div>
          </div>
        </Section>

        {/* 2. Diagnóstico */}
        <Section id="diagnostico" labelledBy="diagnostico-title">
          <p className="eyebrow">2 · Diagnóstico</p>
          <h2 id="diagnostico-title" className="mt-3 max-w-3xl text-h2 font-bold">
            ¿Qué mostró el diagnóstico?
          </h2>
          <p className="mt-5 max-w-3xl text-lead text-muted">
            Tres herramientas: benchmark de 5 competidores, DOFA y customer journey map. El hallazgo central fue que ninguna de las ópticas analizadas
            ocupaba el territorio del experto que educa y acompaña, y que el mayor punto de dolor del cliente no era el precio sino el parqueo.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal className="card p-7">
              <h3 className="text-h3 font-semibold">Benchmark de 5 competidores</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {competitors.map((x) => (
                  <li key={x} className="rounded-full border border-border px-3 py-1 text-sm">
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-semibold">8 criterios comparados:</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-muted">
                {criteria.map((x) => (
                  <li key={x} className="flex gap-2">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl bg-surface-2 p-4">
                <strong>Hallazgo:</strong> 0 de 5 ocupaban el territorio del “experto que educa y acompaña”. Ese espacio vacío se convirtió en el
                posicionamiento de Tienda Óptica.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="card p-7">
              <h3 className="text-h3 font-semibold">DOFA</h3>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {dofa.map((q) => (
                  <div key={q.t} className="rounded-2xl bg-surface-2 p-4">
                    <dt className="font-display font-semibold text-accent">{q.t}</dt>
                    {q.items.map((i) => (
                      <dd key={i} className="mt-1.5 text-sm text-muted">
                        {i}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal className="card mt-5 p-7">
            <h3 className="text-h3 font-semibold">Customer journey map</h3>
            <ol className="mt-6 grid gap-3 md:grid-cols-5">
              {journey.map((j, i) => (
                <li key={j.stage} className={`rounded-2xl p-4 ${j.main ? "border-2 border-accent bg-surface-2" : "bg-surface-2"}`}>
                  <p className="font-display text-sm text-muted">Paso {i + 1}</p>
                  <p className="font-display text-lg font-semibold">{j.stage}</p>
                  <p className="mt-2 text-sm">{j.does}</p>
                  <p className="mt-3 flex gap-1.5 text-sm text-muted">
                    {j.main ? <Car aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> : null}
                    <span>
                      <span className="font-semibold text-fg">Dolor: </span>
                      {j.pain}
                    </span>
                  </p>
                  {j.main ? <p className="mt-2 text-xs font-bold uppercase tracking-wider text-accent">Punto de dolor principal</p> : null}
                </li>
              ))}
            </ol>
          </Reveal>
        </Section>

        {/* 3. Estrategia */}
        <Section tone="light" id="estrategia" labelledBy="estrategia-title">
          <p className="eyebrow">3 · Estrategia</p>
          <h2 id="estrategia-title" className="mt-3 max-w-3xl text-h2 font-bold">
            ¿Qué estrategia de marketing se aplicó?
          </h2>
          <p className="mt-5 max-w-3xl text-lead text-muted">
            Un embudo de cuatro etapas con una acción y un indicador en cada una, un sistema de lead scoring para priorizar contactos, cuatro puntos de
            captura de datos con Habeas Data, cinco flujos de email y un plan de contenido con objetivo doble.
          </p>

          <h3 className="mt-14 text-h3 font-semibold">Embudo: atracción → interacción → conversión → fidelización</h3>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {funnel.map((f, i) => (
              <li key={f.stage} className="card relative p-6" style={{ borderTop: `4px solid ${chartColors.ordinal[i + 1]}` }}>
                <p className="font-display text-sm text-muted">Etapa {i + 1}</p>
                <p className="font-display text-xl font-semibold">{f.stage}</p>
                <p className="mt-3 text-sm">{f.action}</p>
                <p className="mt-3 text-sm text-muted">
                  <span className="font-semibold text-fg">KPI: </span>
                  {f.kpi}
                </p>
              </li>
            ))}
          </ol>

          <h3 className="mt-14 text-h3 font-semibold">Lead scoring en 5 bandas</h3>
          <p className="mt-3 max-w-3xl text-muted">
            Cada contacto suma puntos por lo que hace: abrir un correo suma poco, hacer clic en WhatsApp suma mucho. Así el equipo de la óptica sabe a
            quién llamar primero.
          </p>
          <ol className="mt-6 flex flex-col overflow-hidden rounded-2xl sm:flex-row" aria-label="Bandas de lead scoring de frío a fidelizado">
            {bands.map((b, i) => (
              <li key={b.name} className="flex-1 border-b-2 border-[var(--c-bg)] p-3 last:border-0 sm:border-b-0 sm:border-r-2 md:p-4" style={{ background: chartColors.ordinal[i], color: i < 2 ? "#06231c" : "#ffffff" }}>
                <p className="font-display text-sm font-semibold md:text-base">{b.name}</p>
                <p className="text-xs md:text-sm">{b.range} pts</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <div className="card p-7">
              <h3 className="flex items-center gap-2 text-h3 font-semibold">
                <QrCode aria-hidden className="h-6 w-6 text-accent" /> Captura de datos
              </h3>
              <ul className="mt-5 space-y-3">
                {[
                  ["Quiz de estilo visual", "qué montura va con tu rostro y tu rutina"],
                  ["Club Tienda Óptica", "QR en caja para registrarse al pagar"],
                  ["Registro de garantía", "garantía digital de monturas y lentes"],
                  ["Guía descargable", "«Cómo leer tu fórmula» a cambio del correo"],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span>
                      <strong>{t}:</strong> <span className="text-muted">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex gap-3 rounded-2xl bg-surface-2 p-4 text-sm">
                <ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-accent" />
                <span>
                  Todos con autorización previa, expresa e informada según la Ley 1581 de 2012. La fórmula óptica se trató como dato sensible.{" "}
                  <Link href="/blog/habeas-data-para-pymes-ley-1581" className="link">
                    Cómo lo hicimos
                  </Link>
                  .
                </span>
              </p>
            </div>

            <div className="card p-7">
              <h3 className="flex items-center gap-2 text-h3 font-semibold">
                <Mail aria-hidden className="h-6 w-6 text-accent" /> Email marketing en Mailchimp
              </h3>
              <div className="relative mt-5 overflow-x-auto" tabIndex={0} role="region" aria-label="Flujos de email (tabla desplazable)">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Flujos de email automatizados de Tienda Óptica</caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="py-2 pr-3 font-semibold">
                        Flujo
                      </th>
                      <th scope="col" className="py-2 pr-3 font-semibold">
                        Cuándo
                      </th>
                      <th scope="col" className="py-2 font-semibold">
                        Objetivo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {flows.map((f) => (
                      <tr key={f.name} className="border-b border-border last:border-0">
                        <th scope="row" className="py-2.5 pr-3 font-semibold">
                          {f.name}
                        </th>
                        <td className="py-2.5 pr-3 text-muted">{f.when}</td>
                        <td className="py-2.5 text-muted">{f.goal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="card p-7">
              <h3 className="text-h3 font-semibold">Contenido: pilar motivacional</h3>
              <p className="mt-3 text-muted">
                Un mismo mensaje, «formamos la mirada con la que ves el mundo», contado en cuatro formatos: reel, post, historia y carrusel. La parrilla
                de diciembre tuvo objetivo doble: atraer compradores de regalos y fidelizar a quienes tenían fórmula vigente.
              </p>
            </div>
            <div className="card p-7">
              <h3 className="text-h3 font-semibold">Landing de una sola página</h3>
              <p className="mt-3 text-muted">
                Catálogo más botón de WhatsApp, sin carrito: el cliente de óptica quiere probarse la montura. Toda la pauta llega aquí y el mensaje
                prellenado de WhatsApp identifica de qué campaña viene cada conversación.
              </p>
            </div>
          </div>
        </Section>

        {/* 4. Resultados */}
        <Section id="resultados" labelledBy="resultados-title">
          <p className="eyebrow">4 · Resultados</p>
          <h2 id="resultados-title" className="mt-3 max-w-3xl text-h2 font-bold">
            ¿Qué resultados se obtuvieron?
          </h2>
          <p className="mt-5 max-w-3xl text-lead text-muted">{c.result}</p>
          <p className="mt-3 inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted">
            Datos ilustrativos: simulación del panel con fines académicos
          </p>

          <div className="mt-10">
            <MetricGrid metrics={c.metrics} />
          </div>

          <figure data-tone="light" className="mt-8 rounded-[var(--r-card)] border border-border bg-surface p-6 md:p-8">
            <figcaption>
              <p className="font-display text-lg font-semibold">Conversión digital vs. línea base, por mes</p>
              <p className="text-sm text-muted">Meta: +20 % al mes 6</p>
            </figcaption>
            <div className="relative mt-8 h-56" role="img" aria-label="Barras mensuales de aumento de conversión: mes 1 +4,7 %, mes 2 +7,8 %, mes 3 +11 %, mes 4 +14,4 %, mes 5 +17,9 %. Meta +20 %.">
              <div className="absolute inset-x-0 border-t-2 border-dashed" style={{ bottom: `${(GOAL / 22) * 100}%`, borderColor: chartColors.goal }}>
                <span className="absolute -top-6 right-0 text-xs font-semibold text-fg">Meta +20 %</span>
              </div>
              <div className="flex h-full items-end gap-3 border-b md:gap-6" style={{ borderColor: chartColors.grid }}>
                {monthly.map((d) => (
                  <div key={d.m} className="flex h-full flex-1 flex-col items-center justify-end">
                    <span className="mb-1 text-xs font-semibold text-fg md:text-sm">+{d.v.toLocaleString("es-CO")} %</span>
                    <div className="w-full max-w-6 rounded-t-[4px]" style={{ height: `${(d.v / 22) * 100}%`, background: chartColors.single }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 flex gap-3 md:gap-6">
              {monthly.map((d) => (
                <span key={d.m} className="flex-1 text-center text-xs text-muted">
                  {d.m}
                </span>
              ))}
            </div>
          </figure>

          <p className="mt-8 max-w-3xl text-muted">
            ¿Cómo se sigue esto día a día? En el{" "}
            <Link href="/panel" className="link">
              panel de clientes
            </Link>{" "}
            (usuario demo: demo@tiendaoptica.co · contraseña: nexo2026) puedes ver estos mismos datos filtrados por fecha y canal.
          </p>

          <div className="mt-16">
            <h3 className="text-h3 font-semibold">Lo que dice el equipo de la óptica</h3>
            <div className="mt-6">
              <Testimonials />
            </div>
          </div>
        </Section>
      </article>

      <CtaBand
        id="cta-caso"
        title="¿Tienes una óptica o un negocio local?"
        body="La misma metodología funciona para clínicas, tiendas y servicios con sede física. Te mostramos cómo adaptarla a tu marca."
        cta="Solicita una asesoría"
        href="/contacto?servicio=estrategia-de-marketing"
        secondary={{ label: "Ver servicios", href: "/servicios" }}
      />

      <JsonLd
        data={articleJsonLd({
          title: "Estrategia de marketing para ópticas: el caso Tienda Óptica",
          description: c.summary,
          path: "/portafolio/tienda-optica",
          author: c.author.name,
          authorRole: c.author.role,
          publishedAt: c.publishedAt,
          updatedAt: c.updatedAt,
          section: "Casos de éxito",
        })}
      />
    </>
  );
}
