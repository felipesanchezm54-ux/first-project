/**
 * Datos globales de NEXO. Los valores de contacto son de ejemplo para la
 * propuesta académica: cámbialos aquí y se actualizan en todo el sitio
 * (header, footer, contacto, JSON-LD, llms.txt).
 */
export const site = {
  name: "NEXO",
  legalName: "NEXO Agencia de Marketing Digital",
  tagline: "Agencia de marketing digital",
  // En Netlify, si no se define NEXT_PUBLIC_SITE_URL, se usa la URL del sitio que Netlify entrega al compilar (URL).
  url: (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "https://nexo.example").replace(/\/$/, ""),
  description:
    "Agencia de marketing digital en Medellín enfocada en resultados medibles: estrategia, contenido, pauta y un panel donde ves qué se hizo, cuánto costó y qué produjo.",
  locale: "es_CO",
  email: "hola@nexo.example",
  phoneDisplay: "+57 300 000 0000",
  phoneE164: "+573000000000",
  whatsapp: "573000000000",
  whatsappMessage: "Hola NEXO, quiero una asesoría para mi marca.",
  address: {
    street: "Cra. 43A # 1-50, El Poblado",
    city: "Medellín",
    region: "Antioquia",
    country: "CO",
    postalCode: "050021",
  },
  geo: { lat: 6.2086, lng: -75.5695 },
  hours: "Lunes a viernes, 8:00 a. m. – 6:00 p. m.",
  socials: {
    instagram: "https://www.instagram.com/nexo.example",
    facebook: "https://www.facebook.com/nexo.example",
    tiktok: "https://www.tiktok.com/@nexo.example",
    linkedin: "https://www.linkedin.com/company/nexo-example",
  },
  foundingYear: 2024,
} as const;

export function whatsappUrl(message: string = site.whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Ley de Hick: 7 ítems en el menú principal. */
export const mainNav = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/planes", label: "Planes" },
  { href: "/blog", label: "Blog" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const legalNav = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/cookies", label: "Cookies" },
] as const;
