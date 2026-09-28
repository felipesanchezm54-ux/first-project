import Anthropic from "@anthropic-ai/sdk";
import { services } from "@/lib/content/services";
import { plans } from "@/lib/content/plans";
import { tiendaOptica } from "@/lib/content/cases";
import { site } from "@/lib/site";
import { formatCOP } from "@/lib/utils";

/**
 * Vera, agente de IA de NEXO.
 * - Con ANTHROPIC_API_KEY: responde con Claude usando un system prompt con la información de NEXO.
 * - Sin clave (o si la API falla): responde con respuestas predefinidas por intención.
 */

export type VeraMessage = { role: "user" | "assistant"; content: string };
export type VeraReply = { reply: string; source: "claude" | "reglas"; links?: { label: string; href: string }[] };

export const SYSTEM_PROMPT = `Eres Vera, la agente de IA de NEXO, una agencia de marketing digital de Medellín (Colombia). Tu rol en el equipo es "Estratega de Datos e Insights". Hablas en español de Colombia, con tono profesional, cercano y seguro. Tutea al usuario.

Tu trabajo en el chat del sitio es orientar a visitantes: explicar servicios y planes, contar el caso de Tienda Óptica y llevar a la persona a agendar una asesoría gratuita en /contacto o por WhatsApp.

Reglas:
- Respuestas cortas: máximo 90 palabras, en texto plano (sin markdown ni viñetas con asteriscos). Si enumeras, usa frases cortas separadas por punto.
- Di cosas concretas. Nada de frases de relleno como "en el mundo digital de hoy".
- No inventes precios, cifras, clientes ni garantías. Usa solo la información de abajo. Si no sabes algo, dilo y sugiere hablar con el equipo en /contacto.
- Los precios de los planes son de referencia y se ajustan según la marca; la pauta se paga aparte.
- Las cifras del caso Tienda Óptica y del panel demo son simuladas con fines académicos: acláralo si las mencionas.
- No pidas datos personales en el chat; para eso está el formulario de /contacto (con autorización de Habeas Data).
- Si preguntan algo ajeno al marketing o a NEXO, responde en una frase que solo puedes ayudar con eso.

Información de NEXO:
Equipo: Felipe (Content Curator), Martín (SEO), Sofía (Copywriter), María Isabel (Social Media Manager) y tú, Vera.
Diferencial: cada cliente ve sus resultados en un panel (/panel) con KPIs por canal, embudo, lead scoring y campañas; estrategia antes que pauta.
Contacto: ${site.email}, WhatsApp ${site.phoneDisplay}, ${site.address.street}, ${site.address.city}. Horario: ${site.hours}.

Servicios (detalle en /servicios):
${services.map((s) => `- ${s.title}: ${s.answer}`).join("\n")}

Planes (detalle en /planes, precios mensuales de referencia en COP, sin pauta, antes de IVA; 10 % de descuento pagando el trimestre; sin permanencia):
${plans.map((p) => `- ${p.name}, desde ${formatCOP(p.monthly)}: ${p.forWho} Incluye: ${p.includes.join("; ")}.`).join("\n")}

Caso Tienda Óptica (/portafolio/tienda-optica): ${tiendaOptica.summary} Problema: ${tiendaOptica.problem} Estrategia: ${tiendaOptica.strategy} Resultado (simulado): ${tiendaOptica.result}

Panel demo: usuario demo@tiendaoptica.co, contraseña nexo2026.`;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

type Intent = { id: string; words: string[]; reply: string; links: { label: string; href: string }[] };

const intents: Intent[] = [
  {
    id: "planes",
    words: ["plan", "precio", "cuesta", "cuanto", "valor", "tarifa", "costo", "pagar", "mensual", "trimestr"],
    reply: `Tenemos tres planes con precio de referencia mensual: Starter desde ${formatCOP(plans[0].monthly)}, Growth desde ${formatCOP(plans[1].monthly)} (el más elegido) y Full Brand desde ${formatCOP(plans[2].monthly)}. No incluyen la inversión en pauta, no tienen permanencia y pagando el trimestre tienes 10 % de descuento. El valor final se ajusta a tu marca en la asesoría gratuita.`,
    links: [
      { label: "Comparar planes", href: "/planes" },
      { label: "Agendar asesoría", href: "/contacto?plan=growth" },
    ],
  },
  {
    id: "casos",
    words: ["caso", "resultado", "cliente", "optica", "portafolio", "ejemplo", "exito", "trabajos"],
    reply:
      "Nuestro caso de referencia es Tienda Óptica, una óptica familiar de Medellín con dos sedes. Hicimos benchmark de 5 competidores, DOFA, embudo con lead scoring, captura de datos con Habeas Data y 5 flujos de email, con la meta de +20 % de conversión digital en 6 meses. En la simulación del panel va en +17,9 % al mes 5 (cifras ilustrativas).",
    links: [{ label: "Ver el caso completo", href: "/portafolio/tienda-optica" }],
  },
  {
    id: "asesoria",
    words: ["asesoria", "agendar", "cita", "reunion", "contratar", "empezar", "cotiz", "propuesta", "llamada"],
    reply:
      "¡Con gusto! La asesoría es gratuita y dura 30 minutos: revisamos tu marca y te proponemos una meta medible. Déjanos tus datos en el formulario de contacto (te respondemos en menos de 24 horas hábiles) o escríbenos por WhatsApp si prefieres algo más rápido.",
    links: [
      { label: "Ir al formulario", href: "/contacto" },
      { label: "Escribir por WhatsApp", href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}` },
    ],
  },
  {
    id: "panel",
    words: ["panel", "dashboard", "reporte", "metrica", "medir", "kpi", "datos", "informe"],
    reply:
      "Cada cliente entra a un panel con sus KPIs (conversiones contra la meta, leads, apertura de email, clics a WhatsApp, costo por lead), el embudo, los leads por banda de lead scoring y el estado de sus campañas. Puedes filtrar por fechas y canal y exportar a CSV. Pruébalo con el usuario demo@tiendaoptica.co y la contraseña nexo2026.",
    links: [{ label: "Abrir el panel demo", href: "/panel" }],
  },
  {
    id: "contacto",
    words: ["contacto", "telefono", "correo", "email", "whatsapp", "direccion", "donde", "ubicad", "horario"],
    reply: `Estamos en ${site.address.street}, ${site.address.city}. Puedes escribirnos a ${site.email} o por WhatsApp al ${site.phoneDisplay}. Atendemos ${site.hours.toLowerCase()}.`,
    links: [{ label: "Página de contacto", href: "/contacto" }],
  },
  {
    id: "servicios",
    words: ["servicio", "hacen", "ofrecen", "redes", "seo", "pauta", "publicidad", "contenido", "estrategia", "marketing", "ads", "instagram", "tiktok", "web"],
    reply: `Hacemos seis cosas: ${services.map((s) => s.title.toLowerCase()).join(", ")}. Todas reportan en el mismo panel de resultados, para que veas qué se hizo, cuánto costó y qué produjo. ¿Quieres que te cuente de alguno en particular?`,
    links: [{ label: "Ver servicios", href: "/servicios" }],
  },
  {
    id: "vera",
    words: ["vera", "quien eres", "ia", "inteligencia artificial", "robot", "bot"],
    reply:
      "Soy Vera, la agente de IA de NEXO. En el panel de cada cliente leo los datos y explico en lenguaje sencillo qué subió, qué bajó y qué conviene ajustar. Aquí te ayudo con dudas sobre servicios, planes y casos. Las decisiones siempre las toma el equipo humano contigo.",
    links: [{ label: "Conocer al equipo", href: "/nosotros#equipo" }],
  },
];

export function ruleBasedReply(message: string): VeraReply {
  const text = norm(message);
  if (/^(hola|buenas|buenos|hey|que tal)\b/.test(text) && text.split(/\s+/).length <= 4) {
    return {
      reply: "¡Hola! Soy Vera, de NEXO. Puedo contarte sobre nuestros servicios, los planes, el caso de Tienda Óptica o ayudarte a agendar una asesoría gratuita. ¿Por dónde empezamos?",
      source: "reglas",
    };
  }
  let best: Intent | null = null;
  let score = 0;
  for (const intent of intents) {
    const s = intent.words.reduce((acc, w) => (text.includes(w) ? acc + 1 : acc), 0);
    if (s > score) {
      best = intent;
      score = s;
    }
  }
  if (best) return { reply: best.reply, source: "reglas", links: best.links };
  return {
    reply:
      "No tengo una respuesta precisa para eso, pero el equipo sí. Puedo contarte sobre servicios, planes, el caso de Tienda Óptica o el panel de resultados. Si prefieres, deja tu pregunta en el formulario y te respondemos en menos de 24 horas hábiles.",
    source: "reglas",
    links: [{ label: "Escribir al equipo", href: "/contacto" }],
  };
}

let client: Anthropic | null = null;

export async function veraReply(messages: VeraMessage[]): Promise<VeraReply> {
  const last = messages[messages.length - 1]?.content ?? "";
  const rules = ruleBasedReply(last);
  if (!process.env.ANTHROPIC_API_KEY) return rules;

  client ??= new Anthropic({ timeout: 20_000, maxRetries: 1 });
  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      // Chat corto y sensible a la latencia: esfuerzo bajo.
      output_config: { effort: "low" },
      // Si el modelo declina por política, la API reintenta con un modelo de respaldo en la misma llamada.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    if (response.stop_reason === "refusal") return rules;
    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    if (!text) return rules;
    return { reply: text, source: "claude", links: rules.links };
  } catch (error) {
    if (error instanceof Anthropic.APIError) console.error(`Vera: error ${error.status} de la API de Claude; se usan respuestas predefinidas.`);
    else console.error("Vera: no se pudo contactar la API de Claude; se usan respuestas predefinidas.");
    return rules;
  }
}
