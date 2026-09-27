import { ChartLine, Compass, Globe, Megaphone, PenTool, Share2, type LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  /** Frase de tarjeta (Ley de Semejanza: todas las tarjetas tienen la misma estructura). */
  short: string;
  /** Respuesta directa de 40–60 palabras (AEO) que abre la sección. */
  answer: string;
  includes: string[];
  deliverables: string[];
  kpis: string[];
  example: { title: string; body: string };
};

export const services: Service[] = [
  {
    slug: "estrategia-de-marketing",
    title: "Estrategia de marketing",
    icon: Compass,
    short: "Diagnóstico, objetivos medibles y un plan que dice qué hacer primero y por qué.",
    answer:
      "La estrategia de marketing define a quién le hablas, qué le prometes y por cuál canal, antes de invertir un peso en pauta. En NEXO arranca con benchmark, DOFA y customer journey, y termina en un plan con metas numéricas, responsables y fechas que se revisan cada mes.",
    includes: [
      "Benchmark de hasta 5 competidores directos",
      "Análisis DOFA y definición de arquetipo de marca",
      "Buyer persona y customer journey map",
      "Embudo con metas por etapa y modelo de lead scoring",
    ],
    deliverables: ["Documento de estrategia", "Mapa del embudo con metas", "Hoja de ruta de 6 meses"],
    kpis: ["Tasa de conversión por etapa", "Costo por adquisición (CAC)", "Avance vs. meta semestral"],
    example: {
      title: "Tienda Óptica",
      body: "El benchmark de 5 ópticas mostró que nadie ocupaba el territorio del “experto que educa y acompaña”. Sobre ese hueco se definió el arquetipo El Sabio y la meta: +20 % de conversión digital en 6 meses.",
    },
  },
  {
    slug: "marketing-digital",
    title: "Marketing digital",
    icon: Globe,
    short: "Sitio web, captura de datos y email conectados para que cada visita tenga un siguiente paso.",
    answer:
      "El marketing digital convierte visitas en relaciones. Construimos el sitio o la landing, instalamos puntos de captura de datos con consentimiento (Ley 1581 de 2012) y automatizamos correos que acompañan al cliente antes y después de la compra, sin depender de que alguien se acuerde de escribir.",
    includes: [
      "Landing o sitio web optimizado para SEO y conversión",
      "Puntos de captura: quiz, guía descargable, registro de garantía, QR en tienda",
      "Flujos de email marketing en Mailchimp",
      "Política de tratamiento de datos (Habeas Data)",
    ],
    deliverables: ["Landing publicada", "Formularios con consentimiento", "5 flujos automáticos de email"],
    kpis: ["Leads captados por mes", "Tasa de apertura y clic de email", "Conversión de la landing"],
    example: {
      title: "Tienda Óptica",
      body: "Se diseñó una landing de una sola página con catálogo y botón de WhatsApp (sin carrito) y un flujo de bienvenida, posventa, carrito abandonado, mantenimiento a 6 meses y renovación de fórmula a 12 meses.",
    },
  },
  {
    slug: "redes-sociales",
    title: "Redes sociales",
    icon: Share2,
    short: "Gestión de Instagram, Facebook y TikTok con parrilla mensual y respuesta a la comunidad.",
    answer:
      "Gestionar redes sociales es publicar con propósito y responder a tiempo. Planeamos una parrilla mensual por objetivo (atracción, interacción o fidelización), publicamos en Instagram, Facebook y TikTok, respondemos mensajes y medimos qué formato mueve a la gente hacia WhatsApp o el sitio.",
    includes: [
      "Parrilla mensual con objetivo por pieza",
      "Publicación y programación en 3 redes",
      "Gestión de comunidad y mensajes directos",
      "Informe mensual de rendimiento por formato",
    ],
    deliverables: ["Parrilla aprobada", "Publicaciones programadas", "Informe mensual"],
    kpis: ["Seguidores nuevos", "Tasa de interacción", "Clics a WhatsApp y al sitio"],
    example: {
      title: "Tienda Óptica",
      body: "La parrilla de diciembre se armó con objetivo doble: atraer compradores de regalos y fidelizar a los clientes que ya tenían fórmula vigente, con un pilar motivacional en reel, post, historia y carrusel.",
    },
  },
  {
    slug: "creacion-de-contenido",
    title: "Creación de contenido",
    icon: PenTool,
    short: "Copys, reels, carruseles y artículos escritos para la pregunta real de tu cliente.",
    answer:
      "Creamos contenido que responde preguntas concretas de tus clientes, no contenido para llenar el calendario. Cada pieza nace de un pilar (educativo, motivacional, comercial o de comunidad), tiene un objetivo del embudo y un llamado a la acción que se puede medir.",
    includes: [
      "Pilares de contenido y tono de voz",
      "Copywriting para redes, email y web",
      "Guiones y edición de reels",
      "Artículos de blog con enfoque SEO y AEO",
    ],
    deliverables: ["Guía de tono y pilares", "Piezas listas para publicar", "Artículos optimizados"],
    kpis: ["Alcance por pilar", "Guardados y compartidos", "Tráfico orgánico al blog"],
    example: {
      title: "Tienda Óptica",
      body: "Con el arquetipo El Sabio se escribió contenido que enseña: cómo leer una fórmula, cada cuánto cambiar lentes, qué montura va con cada rostro. La frase guía: “No vendemos gafas. Formamos la mirada con la que ves el mundo.”",
    },
  },
  {
    slug: "publicidad-digital",
    title: "Publicidad digital",
    icon: Megaphone,
    short: "Pauta en Meta y Google con presupuesto controlado y reporte de costo por resultado.",
    answer:
      "La publicidad digital acelera lo que la estrategia ya validó. Configuramos campañas en Meta Ads y Google Ads con públicos basados en tu buyer persona, conversiones medidas en el sitio y en WhatsApp, y un tope de presupuesto. Cada semana ves cuánto se invirtió y cuánto costó cada lead.",
    includes: [
      "Configuración de píxel y conversiones",
      "Campañas en Meta Ads y Google Ads",
      "Pruebas A/B de anuncios y públicos",
      "Remarketing a visitantes y leads tibios",
    ],
    deliverables: ["Estructura de campañas", "Anuncios aprobados", "Reporte semanal de inversión"],
    kpis: ["Costo por lead (CPL)", "Retorno de la inversión publicitaria (ROAS)", "Tasa de clics (CTR)"],
    example: {
      title: "Tienda Óptica",
      body: "El remarketing se dirigió a quienes hicieron el quiz de estilo visual y no agendaron examen. El mensaje resolvía el punto de dolor del journey: parqueo gratis en el centro comercial al presentar la cita.",
    },
  },
  {
    slug: "analisis-y-medicion",
    title: "Análisis y medición",
    icon: ChartLine,
    short: "Un panel con tus números en tiempo real y una lectura clara de qué hacer después.",
    answer:
      "Medir es saber qué funcionó y qué no, con cifras. Conectamos sitio, redes, WhatsApp, email y tienda física a un panel de resultados. Ahí ves conversiones contra la meta, leads por banda de lead scoring y costo por canal, con una lectura automática de Vera, nuestra agente de IA.",
    includes: [
      "Plan de medición y etiquetado (UTM, eventos)",
      "Panel de resultados con acceso para el cliente",
      "Lead scoring por bandas",
      "Insights mensuales con recomendaciones",
    ],
    deliverables: ["Plan de medición", "Acceso al panel de clientes", "Reunión mensual de resultados"],
    kpis: ["Avance vs. meta", "Leads por banda de scoring", "Rendimiento por canal"],
    example: {
      title: "Tienda Óptica",
      body: "El lead scoring clasifica a cada contacto en 5 bandas: frío (0–15), tibio (16–30), interesado (31–55), caliente (56–85) y cliente fidelizado (86+). Así el equipo de la óptica sabe a quién llamar primero.",
    },
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
