import { getAllPosts } from "@/lib/blog";
import { services } from "@/lib/content/services";
import { plans } from "@/lib/content/plans";
import { tiendaOptica } from "@/lib/content/cases";
import { absoluteUrl, site } from "@/lib/site";
import { formatCOP } from "@/lib/utils";

export const dynamic = "force-static";

/** /llms.txt: resumen de NEXO para buscadores y asistentes con IA (GEO). */
export function GET() {
  const posts = getAllPosts();
  const body = `# ${site.name}

> ${site.description}

NEXO es una agencia de marketing digital con sede en ${site.address.city}, Colombia. Trabaja con marcas y pymes colombianas. Su diferencial: cada cliente tiene acceso a un panel de resultados con sus métricas por canal y a Vera, una agente de IA que interpreta esos datos. Equipo: Felipe (Content Curator), Martín (SEO), Sofía (Copywriter), María Isabel (Social Media Manager) y Vera (Estratega de Datos e Insights, IA).

Contacto: ${site.email} · ${site.phoneDisplay} · ${site.address.street}, ${site.address.city}

## Páginas principales

- [Inicio](${absoluteUrl("/")}): propuesta de valor, servicios y vista previa del panel.
- [Nosotros](${absoluteUrl("/nosotros")}): misión, visión, valores y equipo.
- [Servicios](${absoluteUrl("/servicios")}): qué incluye cada servicio, entregables, KPI e integración omnicanal.
- [Planes](${absoluteUrl("/planes")}): Starter, Growth y Full Brand con precios de referencia.
- [Portafolio](${absoluteUrl("/portafolio")}): casos de éxito con cifras.
- [Caso Tienda Óptica](${absoluteUrl(`/portafolio/${tiendaOptica.slug}`)}): estrategia de marketing para una óptica de Medellín.
- [Blog](${absoluteUrl("/blog")}): artículos que responden preguntas concretas.
- [Contacto](${absoluteUrl("/contacto")}): formulario, WhatsApp y preguntas frecuentes.

## Servicios

${services.map((s) => `- **${s.title}**: ${s.answer}`).join("\n")}

## Planes (precios de referencia en COP, sin pauta, antes de IVA)

${plans.map((p) => `- **${p.name}**: desde ${formatCOP(p.monthly)} al mes. ${p.forWho}`).join("\n")}

## Artículos del blog

${posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.description}`).join("\n")}

## Nota sobre los datos

Las cifras del caso Tienda Óptica y del panel de demostración son simulaciones con fines académicos (proyecto de CEIPA Business School) y están marcadas como ilustrativas en el sitio.
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
