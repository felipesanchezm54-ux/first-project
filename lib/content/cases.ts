/**
 * Caso de éxito y portafolio. Tienda Óptica es un cliente de referencia de la
 * propuesta académica: los entregables son reales (se hicieron en el curso) y
 * las cifras de resultados son simuladas, por eso llevan la marca `illustrative`.
 */

export type Metric = { value: number; prefix?: string; suffix?: string; label: string; context: string };

export type CaseStudy = {
  slug: string;
  brand: string;
  sector: string;
  city: string;
  summary: string;
  problem: string;
  strategy: string;
  result: string;
  services: string[];
  metrics: Metric[];
  author: { name: string; role: string };
  publishedAt: string;
  updatedAt: string;
  illustrative: true;
};

export const tiendaOptica: CaseStudy = {
  slug: "tienda-optica",
  brand: "Tienda Óptica",
  sector: "Salud visual y retail",
  city: "Medellín",
  summary:
    "Óptica familiar con 10 años y 2 sedes que pasó de publicar sin rumbo a un embudo medible con captura de datos, email automatizado y lead scoring.",
  problem:
    "Tenía clientela fiel en tienda, pero sus canales digitales no generaban citas: publicaba catálogo sin estrategia, no guardaba datos de contacto y no sabía qué canal traía ventas.",
  strategy:
    "Posicionamiento como el experto que educa (arquetipo El Sabio), embudo Atracción → Interacción → Conversión → Fidelización, captura de datos con consentimiento, 5 flujos de email y lead scoring en 5 bandas.",
  result:
    "Meta de +20 % de conversión digital en 6 meses. En la simulación del panel, el mes 5 cierra en +17,9 % con 1.130 leads captados y el costo por lead bajando de $14.200 a $9.500.",
  services: ["estrategia-de-marketing", "marketing-digital", "redes-sociales", "creacion-de-contenido", "publicidad-digital", "analisis-y-medicion"],
  metrics: [
    { value: 17.9, prefix: "+", suffix: " %", label: "conversión digital", context: "vs. línea base, mes 5 de 6 (meta: +20 %)" },
    { value: 1130, label: "leads captados", context: "en 5 meses, con consentimiento Habeas Data" },
    { value: 46, suffix: " %", label: "tasa de apertura de email", context: "promedio de los 5 flujos" },
    { value: 33, prefix: "−", suffix: " %", label: "costo por lead", context: "de $14.200 a $9.500 COP entre el mes 1 y el 5" },
  ],
  author: { name: "Felipe", role: "Content Curator" },
  publishedAt: "2026-06-12",
  updatedAt: "2026-09-20",
  illustrative: true,
};

export const cases: CaseStudy[] = [tiendaOptica];

/** Grilla del portafolio: piezas del proyecto, filtrables por servicio. */
export type PortfolioItem = {
  title: string;
  brand: string;
  service: string;
  serviceLabel: string;
  description: string;
  stat: string;
  href: string;
  art: "branding" | "benchmark" | "journey" | "data" | "email" | "content" | "funnel" | "landing";
};

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Branding El Sabio",
    brand: "Tienda Óptica",
    service: "estrategia-de-marketing",
    serviceLabel: "Estrategia",
    description: "Arquetipo, paleta, tipografía y buyer persona para una óptica que enseña antes de vender.",
    stat: "1 frase de marca que guía todo el contenido",
    href: "/portafolio/tienda-optica#reto",
    art: "branding",
  },
  {
    title: "Benchmark de 5 ópticas",
    brand: "Tienda Óptica",
    service: "estrategia-de-marketing",
    serviceLabel: "Estrategia",
    description: "Ópticas GMO, HD Ópticas, Gafas & Gafas, Clínica Sandiego/MasVision y Lentesplus, comparadas en 8 criterios.",
    stat: "0 de 5 ocupaban el territorio del “experto que acompaña”",
    href: "/portafolio/tienda-optica#diagnostico",
    art: "benchmark",
  },
  {
    title: "DOFA y customer journey",
    brand: "Tienda Óptica",
    service: "estrategia-de-marketing",
    serviceLabel: "Estrategia",
    description: "Mapa del recorrido del cliente desde la búsqueda hasta la renovación de fórmula.",
    stat: "Punto de dolor n.º 1: el parqueo en el centro comercial",
    href: "/portafolio/tienda-optica#diagnostico",
    art: "journey",
  },
  {
    title: "Captura de datos con consentimiento",
    brand: "Tienda Óptica",
    service: "marketing-digital",
    serviceLabel: "Marketing digital",
    description: "Quiz de estilo visual, Club Tienda Óptica con QR en tienda, registro de garantía y guía descargable.",
    stat: "4 puntos de captura, todos con Habeas Data",
    href: "/portafolio/tienda-optica#estrategia",
    art: "data",
  },
  {
    title: "Flujos de email en Mailchimp",
    brand: "Tienda Óptica",
    service: "marketing-digital",
    serviceLabel: "Marketing digital",
    description: "Bienvenida, posventa, carrito abandonado, mantenimiento a 6 meses y renovación de fórmula a 12 meses.",
    stat: "5 flujos automáticos",
    href: "/portafolio/tienda-optica#estrategia",
    art: "email",
  },
  {
    title: "Parrilla de diciembre",
    brand: "Tienda Óptica",
    service: "redes-sociales",
    serviceLabel: "Redes sociales",
    description: "Parrilla con objetivo doble: atracción de compradores de regalos y fidelización de clientes con fórmula vigente.",
    stat: "2 objetivos por pieza, medidos por separado",
    href: "/portafolio/tienda-optica#estrategia",
    art: "content",
  },
  {
    title: "Pilar motivacional",
    brand: "Tienda Óptica",
    service: "creacion-de-contenido",
    serviceLabel: "Contenido",
    description: "Reel, post, historia y carrusel sobre la frase “Formamos la mirada con la que ves el mundo”.",
    stat: "4 formatos del mismo mensaje",
    href: "/portafolio/tienda-optica#estrategia",
    art: "content",
  },
  {
    title: "Embudo con lead scoring",
    brand: "Tienda Óptica",
    service: "analisis-y-medicion",
    serviceLabel: "Medición",
    description: "Cada contacto suma puntos por acción y cae en una de 5 bandas, de frío a cliente fidelizado.",
    stat: "5 bandas: 0–15 · 16–30 · 31–55 · 56–85 · 86+",
    href: "/portafolio/tienda-optica#estrategia",
    art: "funnel",
  },
  {
    title: "Landing de una sola página",
    brand: "Tienda Óptica",
    service: "publicidad-digital",
    serviceLabel: "Publicidad",
    description: "Catálogo más botón de WhatsApp, sin carrito: la página a la que llega toda la pauta.",
    stat: "1 acción principal: escribir por WhatsApp",
    href: "/portafolio/tienda-optica#estrategia",
    art: "landing",
  },
];

export type Testimonial = { quote: string; name: string; role: string; illustrative: true };

export const testimonials: Testimonial[] = [
  {
    quote: "Por primera vez sé cuántas citas salen de Instagram y cuántas de WhatsApp. Entro al panel y está ahí.",
    name: "Gerente comercial",
    role: "Tienda Óptica · Medellín",
    illustrative: true,
  },
  {
    quote: "El flujo de renovación de fórmula nos trajo de vuelta clientes que llevaban más de un año sin venir.",
    name: "Coordinadora de sede",
    role: "Tienda Óptica · CC Santafé",
    illustrative: true,
  },
  {
    quote: "Nos dijeron qué no hacer primero. Antes de pautar, ordenamos el mensaje, y eso cambió los resultados.",
    name: "Socio fundador",
    role: "Tienda Óptica",
    illustrative: true,
  },
];
