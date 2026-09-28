import { db } from "@/lib/db";

/**
 * Cálculo de las métricas del panel a partir de la tabla Metric (valores diarios).
 * Lo usan la página /panel (render inicial en servidor), GET /api/dashboard/metrics
 * y GET /api/dashboard/export.
 */

export const CHANNELS = [
  { id: "web", label: "Sitio web" },
  { id: "instagram", label: "Redes sociales" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
  { id: "tienda", label: "Tienda física" },
] as const;

export type ChannelId = (typeof CHANNELS)[number]["id"];
export type ChannelFilter = ChannelId | "todos";

const DIGITAL: ChannelId[] = ["web", "instagram", "whatsapp", "email"];
const BANDS = [
  { key: "banda_frio", label: "Frío", range: "0–15" },
  { key: "banda_tibio", label: "Tibio", range: "16–30" },
  { key: "banda_interesado", label: "Interesado", range: "31–55" },
  { key: "banda_caliente", label: "Caliente", range: "56–85" },
  { key: "banda_fidelizado", label: "Fidelizado", range: "86+" },
];
const DAY = 86_400_000;

export type Kpi = { id: string; label: string; value: number; format: "int" | "pct" | "cop"; delta: number | null; goodWhenUp: boolean; hint: string; notApplicable?: boolean };

export type DashboardData = {
  client: { nombre: string; sector: string };
  range: { from: string; to: string; days: number; minDate: string; maxDate: string };
  channel: ChannelFilter;
  goal: { target: number; current: number | null; progress: number | null; label: string };
  kpis: Kpi[];
  funnel: { stage: string; value: number }[];
  bands: { label: string; range: string; value: number }[];
  channels: { id: ChannelId; label: string; leads: number; conversiones: number; inversion: number; cpl: number | null }[];
  trend: { week: string; conversiones: number; meta: number }[];
  campaigns: { nombre: string; canal: string; estado: string; inversion: number; resultados: Record<string, number> }[];
  insight: string[];
};

const iso = (d: Date) => d.toISOString().slice(0, 10);
const startOfDay = (s: string) => new Date(`${s}T00:00:00-05:00`);

type MetricRow = { canal: string; nombre: string; valor: number; meta: number | null; fecha: Date };

function sum(rows: MetricRow[], nombre: string, canales?: string[]) {
  return rows.reduce((acc, r) => (r.nombre === nombre && (!canales || canales.includes(r.canal)) ? acc + r.valor : acc), 0);
}

export async function getDateBounds(clientId: string) {
  const agg = await db.metric.aggregate({ where: { clientId }, _min: { fecha: true }, _max: { fecha: true } });
  return { min: agg._min.fecha ?? new Date(), max: agg._max.fecha ?? new Date() };
}

/** Normaliza el rango pedido: por defecto, los últimos 28 días con datos. */
export async function resolveRange(clientId: string, from?: string, to?: string) {
  const bounds = await getDateBounds(clientId);
  const maxDate = iso(new Date(bounds.max.getTime() - 5 * 3_600_000));
  const minDate = iso(new Date(bounds.min.getTime() - 5 * 3_600_000));
  let toS = to && to <= maxDate ? to : maxDate;
  let fromS = from && from >= minDate ? from : iso(new Date(startOfDay(toS).getTime() - 27 * DAY));
  if (fromS > toS) [fromS, toS] = [toS, fromS];
  return { from: fromS, to: toS, minDate, maxDate };
}

async function fetchRows(clientId: string, from: string, to: string) {
  return db.metric.findMany({
    where: { clientId, fecha: { gte: startOfDay(from), lt: new Date(startOfDay(to).getTime() + DAY) } },
    select: { canal: true, nombre: true, valor: true, meta: true, fecha: true },
  });
}

/** Devuelve null si el cliente de la sesión ya no existe (por ejemplo, después de volver a correr el seed). */
export async function getDashboard(clientId: string, opts: { from?: string; to?: string; channel?: ChannelFilter }): Promise<DashboardData | null> {
  const client = await db.client.findUnique({ where: { id: clientId } });
  if (!client) return null;
  const channel = opts.channel ?? "todos";
  const range = await resolveRange(clientId, opts.from, opts.to);
  const days = Math.round((startOfDay(range.to).getTime() - startOfDay(range.from).getTime()) / DAY) + 1;

  const prevTo = iso(new Date(startOfDay(range.from).getTime() - DAY));
  const prevFrom = iso(new Date(startOfDay(range.from).getTime() - days * DAY));
  const baselineFrom = iso(new Date(client.inicioProyecto.getTime() - 56 * DAY));
  const baselineTo = iso(new Date(client.inicioProyecto.getTime() - DAY));

  const [rows, prevRows, baseRows, campaigns] = await Promise.all([
    fetchRows(clientId, range.from, range.to),
    fetchRows(clientId, prevFrom, prevTo),
    fetchRows(clientId, baselineFrom, baselineTo),
    db.campaign.findMany({ where: { clientId, ...(channel !== "todos" ? { canal: channel } : {}) }, orderBy: { inicio: "asc" } }),
  ]);

  const sel = channel === "todos" ? undefined : [channel];
  const digitalSel = channel === "todos" ? DIGITAL : DIGITAL.filter((c) => c === channel);

  // ── Meta: aumento de conversión digital vs. línea base ──
  const baselinePerDay = sum(baseRows, "conversiones", digitalSel) / 56;
  const conv = sum(rows, "conversiones", digitalSel);
  const hasBaseline = baselinePerDay > 0 && digitalSel.length > 0;
  const uplift = hasBaseline ? conv / (baselinePerDay * days) - 1 : null;

  // ── KPIs con variación vs. el período anterior de igual duración ──
  const calc = (r: MetricRow[]) => {
    const leads = sum(r, "leads", sel);
    const inversion = sum(r, "inversion", sel);
    const enviados = sum(r, "enviados", sel);
    return {
      leads,
      apertura: enviados ? sum(r, "aperturas", sel) / enviados : 0,
      whatsapp: sum(r, "clics_whatsapp", sel),
      seguidores: sum(r, "seguidores_nuevos", sel),
      cpl: leads ? inversion / leads : 0,
      conv: sum(r, "conversiones", digitalSel),
    };
  };
  const now = calc(rows);
  const prev = calc(prevRows);
  const delta = (a: number, b: number) => (b ? a / b - 1 : null);

  const kpiList: Kpi[] = [
    { id: "conversiones", label: "Conversiones digitales", value: now.conv, format: "int", delta: delta(now.conv, prev.conv), goodWhenUp: true, hint: "Citas y ventas desde web, redes, WhatsApp y email" },
    { id: "leads", label: "Leads del período", value: now.leads, format: "int", delta: delta(now.leads, prev.leads), goodWhenUp: true, hint: "Contactos nuevos con autorización de datos" },
    { id: "apertura", label: "Apertura de email", value: now.apertura, format: "pct", delta: delta(now.apertura, prev.apertura), goodWhenUp: true, hint: "Aperturas ÷ correos enviados" },
    { id: "whatsapp", label: "Clics a WhatsApp", value: now.whatsapp, format: "int", delta: delta(now.whatsapp, prev.whatsapp), goodWhenUp: true, hint: "Desde la landing, redes y anuncios" },
    { id: "seguidores", label: "Seguidores nuevos", value: now.seguidores, format: "int", delta: delta(now.seguidores, prev.seguidores), goodWhenUp: true, hint: "Instagram, Facebook y TikTok" },
    { id: "cpl", label: "Costo por lead", value: now.cpl, format: "cop", delta: delta(now.cpl, prev.cpl), goodWhenUp: false, hint: "Inversión ÷ leads" },
  ];
  // Con un canal filtrado, un KPI sin datos en ambos períodos no aplica (ej. apertura de email en WhatsApp).
  const kpis = kpiList.map((k) => (channel !== "todos" && k.value === 0 && k.delta === null ? { ...k, delta: null, notApplicable: true } : k));

  // ── Embudo ──
  const funnel = [
    { stage: "Atracción", value: sum(rows, "alcance", sel) },
    { stage: "Interacción", value: sum(rows, "interacciones", sel) + sum(rows, "clics_whatsapp", sel) },
    { stage: "Conversión", value: sum(rows, "conversiones", sel) },
    { stage: "Fidelización", value: sum(rows, "recompras", sel) },
  ].map((f) => ({ ...f, value: Math.round(f.value) }));

  // ── Bandas de lead scoring (si hay filtro de canal, se prorratean por su proporción de leads) ──
  const totalLeads = sum(rows, "leads");
  const share = channel === "todos" || !totalLeads ? 1 : now.leads / totalLeads;
  const bandTotal = BANDS.reduce((a, b) => a + sum(rows, b.key), 0);
  const bands = BANDS.map((b) => ({
    label: b.label,
    range: b.range,
    value: bandTotal ? Math.round((sum(rows, b.key) / bandTotal) * totalLeads * share) : 0,
  }));

  // ── Rendimiento por canal ──
  const channels = CHANNELS.filter((c) => channel === "todos" || c.id === channel).map((c) => {
    const leads = sum(rows, "leads", [c.id]);
    const inversion = sum(rows, "inversion", [c.id]);
    return { id: c.id, label: c.label, leads: Math.round(leads), conversiones: Math.round(sum(rows, "conversiones", [c.id])), inversion: Math.round(inversion), cpl: leads && inversion ? inversion / leads : null };
  });

  // ── Tendencia semanal: conversiones vs. trayectoria de la meta ──
  const weeks = new Map<string, { conversiones: number; meta: number }>();
  for (const r of rows) {
    if (r.nombre !== "conversiones" || !digitalSel.includes(r.canal as ChannelId)) continue;
    const local = new Date(r.fecha.getTime() - 5 * 3_600_000);
    const monday = new Date(local.getTime() - ((local.getUTCDay() + 6) % 7) * DAY);
    const key = iso(monday);
    const w = weeks.get(key) ?? { conversiones: 0, meta: 0 };
    w.conversiones += r.valor;
    w.meta += r.meta ?? 0;
    weeks.set(key, w);
  }
  const trend = [...weeks.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, v]) => ({ week, conversiones: Math.round(v.conversiones), meta: Math.round(v.meta) }));

  const data: DashboardData = {
    client: { nombre: client.nombre, sector: client.sector },
    range: { ...range, days },
    channel,
    goal: {
      target: client.metaAumento,
      current: uplift,
      progress: uplift === null ? null : Math.max(0, Math.min(1, uplift / client.metaAumento)),
      label: hasBaseline ? "Aumento de conversión digital vs. línea base" : "Canal nuevo: sin línea base antes de NEXO",
    },
    kpis,
    funnel,
    bands,
    channels,
    trend,
    campaigns: campaigns.map((c) => ({ nombre: c.nombre, canal: c.canal, estado: c.estado, inversion: c.inversion, resultados: JSON.parse(c.resultados) })),
    insight: [],
  };
  data.insight = veraInsight(data, rows);
  return data;
}

const fmtPct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 })} %`;
const fmtCop = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

/** Lectura automática de Vera: reglas simples y explicables sobre los datos del período. */
export function veraInsight(d: DashboardData, rows: MetricRow[]): string[] {
  const out: string[] = [];
  if (d.goal.current !== null) {
    const missing = d.goal.target - d.goal.current;
    out.push(
      missing > 0
        ? `La conversión digital va en ${fmtPct(d.goal.current)} frente a la línea base: faltan ${(missing * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 })} puntos para la meta de +20 %.`
        : `La conversión digital va en ${fmtPct(d.goal.current)} frente a la línea base: la meta de +20 % ya se cumple en este período.`,
    );
  } else {
    out.push("Este canal no existía antes de NEXO, así que no tiene línea base: mídelo por su costo por lead y por las conversiones que aporta.");
  }

  const withCpl = d.channels.filter((c) => c.cpl !== null && c.leads >= 5);
  if (withCpl.length > 1) {
    const best = withCpl.reduce((a, b) => ((a.cpl ?? Infinity) < (b.cpl ?? Infinity) ? a : b));
    const worst = withCpl.reduce((a, b) => ((a.cpl ?? 0) > (b.cpl ?? 0) ? a : b));
    out.push(`${best.label} consigue leads más baratos (${fmtCop(best.cpl!)} por lead) que ${worst.label.toLowerCase()} (${fmtCop(worst.cpl!)}).`);
  }
  const topConv = [...d.channels].sort((a, b) => b.conversiones - a.conversiones)[0];
  if (topConv && topConv.conversiones > 0 && d.channel === "todos") out.push(`${topConv.label} es el canal que más conversiones cierra: ${topConv.conversiones} en el período.`);

  const hot = d.bands.find((b) => b.label === "Caliente")?.value ?? 0;
  if (hot > 0) out.push(`Hay ${hot} leads calientes (56–85 puntos). Recomendación: escríbeles por WhatsApp esta semana antes de que se enfríen.`);

  // Tendencia de leads: última mitad del período vs. primera mitad.
  const mid = new Date((new Date(`${d.range.from}T00:00:00-05:00`).getTime() + new Date(`${d.range.to}T23:59:59-05:00`).getTime()) / 2);
  const sel = d.channel === "todos" ? null : d.channel;
  const half = (after: boolean) => rows.filter((r) => r.nombre === "leads" && (!sel || r.canal === sel) && (after ? r.fecha >= mid : r.fecha < mid)).reduce((a, r) => a + r.valor, 0);
  const a = half(false);
  const b = half(true);
  if (a > 0) {
    const change = b / a - 1;
    if (Math.abs(change) >= 0.05) out.push(`Los leads ${change > 0 ? "subieron" : "bajaron"} ${fmtPct(change).replace(/^[+−]/, "")} en la segunda mitad del período.`);
  }
  return out.slice(0, 4);
}

/** Filas crudas para exportar a CSV. */
export async function getExportRows(clientId: string, opts: { from?: string; to?: string; channel?: ChannelFilter }) {
  const range = await resolveRange(clientId, opts.from, opts.to);
  const rows = await db.metric.findMany({
    where: {
      clientId,
      fecha: { gte: startOfDay(range.from), lt: new Date(startOfDay(range.to).getTime() + DAY) },
      ...(opts.channel && opts.channel !== "todos" ? { canal: opts.channel } : {}),
    },
    orderBy: [{ fecha: "asc" }, { canal: "asc" }, { nombre: "asc" }],
  });
  return { range, rows };
}
