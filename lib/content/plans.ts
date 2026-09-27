export type Plan = {
  id: "starter" | "growth" | "full-brand";
  name: string;
  forWho: string;
  /** Precio mensual de referencia en COP. Se ajusta según la necesidad de cada marca. */
  monthly: number;
  highlighted?: boolean;
  includes: string[];
};

/** Descuento aplicado al pagar el trimestre completo. */
export const QUARTERLY_DISCOUNT = 0.1;

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    forWho: "Para marcas que están empezando a ordenar su presencia digital.",
    monthly: 1_800_000,
    includes: [
      "Diagnóstico inicial y benchmark de 3 competidores",
      "Gestión de 2 redes sociales",
      "12 publicaciones al mes",
      "1 flujo de email de bienvenida",
      "Panel de resultados con KPIs básicos",
      "Reporte mensual",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    forWho: "Para pymes que ya venden y quieren crecer con datos y pauta.",
    monthly: 3_500_000,
    highlighted: true,
    includes: [
      "Estrategia completa: benchmark, DOFA y customer journey",
      "Gestión de 3 redes sociales",
      "20 publicaciones al mes, incluidos 4 reels",
      "Pauta en Meta Ads (inversión aparte)",
      "4 flujos de email automatizados",
      "Panel completo con lead scoring e insights de Vera",
      "Reunión quincenal de resultados",
    ],
  },
  {
    id: "full-brand",
    name: "Full Brand",
    forWho: "Para marcas que necesitan un equipo de marketing completo.",
    monthly: 6_200_000,
    includes: [
      "Todo lo de Growth",
      "Branding: arquetipo, paleta y tipografía",
      "Landing o sitio web optimizado para SEO",
      "Pauta en Meta Ads y Google Ads (inversión aparte)",
      "2 artículos de blog SEO al mes",
      "Integración omnicanal con tienda física (QR del Club)",
      "Reunión semanal y línea directa por WhatsApp",
    ],
  },
];

export function getPlan(id: string | undefined | null) {
  return plans.find((p) => p.id === id);
}

/** Tabla comparativa. `true` = incluido, `false` = no incluido, string = detalle. */
export const comparison: { feature: string; values: [boolean | string, boolean | string, boolean | string] }[] = [
  { feature: "Diagnóstico y benchmark", values: ["3 competidores", "5 competidores", "5 competidores"] },
  { feature: "DOFA y customer journey", values: [false, true, true] },
  { feature: "Redes sociales gestionadas", values: ["2", "3", "3"] },
  { feature: "Publicaciones al mes", values: ["12", "20", "28"] },
  { feature: "Reels al mes", values: [false, "4", "8"] },
  { feature: "Flujos de email automatizados", values: ["1", "4", "5"] },
  { feature: "Pauta digital", values: [false, "Meta Ads", "Meta + Google Ads"] },
  { feature: "Panel de resultados", values: ["KPIs básicos", "Completo", "Completo"] },
  { feature: "Lead scoring e insights de Vera", values: [false, true, true] },
  { feature: "Branding", values: [false, false, true] },
  { feature: "Landing o sitio web", values: [false, false, true] },
  { feature: "Artículos de blog SEO", values: [false, false, "2 al mes"] },
  { feature: "Reuniones de resultados", values: ["Mensual", "Quincenal", "Semanal"] },
];
