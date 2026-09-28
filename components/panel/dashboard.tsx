"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Bot, CalendarClock, CircleCheck, CirclePause, Download, LoaderCircle, LogOut, Minus, Target } from "lucide-react";
import type { ChannelFilter, DashboardData, Kpi } from "@/lib/dashboard";
import { chartColors } from "@/lib/chart-palette";
import { cn } from "@/lib/utils";

const CHANNEL_OPTIONS: { value: ChannelFilter; label: string }[] = [
  { value: "todos", label: "Todos los canales" },
  { value: "web", label: "Sitio web" },
  { value: "instagram", label: "Redes sociales" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "tienda", label: "Tienda física" },
];

const PRESETS = [
  { value: "7", label: "Últimos 7 días" },
  { value: "28", label: "Últimos 28 días" },
  { value: "90", label: "Últimos 90 días" },
  { value: "todo", label: "Todo el proyecto" },
  { value: "custom", label: "Personalizado" },
];

// Paleta categórica de 2 series (validada): teal de marca y morado profundo.
const SERIES = { a: "#1f9e75", b: "#5047bf" };

const nf = (v: number, d = 0) => v.toLocaleString("es-CO", { maximumFractionDigits: d, minimumFractionDigits: d });
const cop = (v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);
const compact = (v: number) => new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 1 }).format(v);
const shortDate = (s: string) => new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${s}T00:00:00Z`));

function formatKpi(k: Kpi) {
  if (k.format === "pct") return `${nf(k.value * 100, 1)} %`;
  if (k.format === "cop") return cop(k.value);
  return nf(k.value);
}

function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <details className="mt-4 text-sm">
      <summary className="inline-flex min-h-10 cursor-pointer items-center font-semibold text-link underline underline-offset-4">Ver datos en tabla</summary>
      <div className="relative mt-2 overflow-x-auto" tabIndex={0} role="region" aria-label={`${caption} (tabla desplazable)`}>
        <table className="w-full text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-border">
              {head.map((h) => (
                <th key={h} scope="col" className="py-2 pr-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                {r.map((c, j) => (
                  <td key={j} className="py-2 pr-4 tabular-nums text-muted">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function ChartTooltip({ active, payload, label, fmt }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string; fmt?: (l: string) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-lift">
      <p className="font-semibold">{fmt && label ? fmt(label) : label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-muted">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-fg">{nf(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

const statusStyle: Record<string, { icon: typeof CircleCheck; cls: string }> = {
  activa: { icon: CircleCheck, cls: "text-success" },
  programada: { icon: CalendarClock, cls: "text-accent-2" },
  "en preparación": { icon: CirclePause, cls: "text-muted" },
};

export function Dashboard({ initial, userName }: { initial: DashboardData; userName: string }) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [channel, setChannel] = useState<ChannelFilter>(initial.channel);
  const [preset, setPreset] = useState("28");
  const [from, setFrom] = useState(initial.range.from);
  const [to, setTo] = useState(initial.range.to);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const first = useRef(true);

  const { minDate, maxDate } = initial.range;

  const query = useMemo(() => new URLSearchParams({ from, to, channel }).toString(), [from, to, channel]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/dashboard/metrics?${query}`, { cache: "no-store" });
      if (res.status === 401) {
        router.push("/panel/ingresar");
        return;
      }
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message ?? "No pudimos cargar los datos.");
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos cargar los datos.");
    } finally {
      setLoading(false);
    }
  }, [query, router]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    load();
  }, [load]);

  const applyPreset = (value: string) => {
    setPreset(value);
    if (value === "custom") return;
    if (value === "todo") {
      setFrom(minDate);
      setTo(maxDate);
    } else {
      setTo(maxDate);
      setFrom(addDays(maxDate, -(Number(value) - 1)));
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/panel/ingresar");
    router.refresh();
  };

  const funnelMax = Math.max(...data.funnel.map((f) => f.value), 1);
  const bandTotal = data.bands.reduce((a, b) => a + b.value, 0);

  return (
    <div className="pb-24 pt-[calc(var(--header-h)+2rem)]">
      <div className="container-nexo">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Panel de resultados</p>
            <h1 className="mt-2 text-h2 font-bold">{data.client.nombre}</h1>
            <p className="mt-1 text-muted">
              {data.client.sector} · Sesión de {userName}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-accent-2 px-3 py-1.5 text-sm font-semibold text-accent-2">Datos de demostración</span>
            <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:border-accent">
              <LogOut aria-hidden className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </div>

        {/* Filtros: en una fila, encima de las gráficas */}
        <form
          aria-label="Filtros del panel"
          className="card mt-8 grid gap-4 p-4 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-end md:p-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Período
            <select value={preset} onChange={(e) => applyPreset(e.target.value)} className="min-h-11 rounded-xl border border-border bg-surface px-3 font-normal">
              {PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Desde
            <input type="date" value={from} min={minDate} max={to} onChange={(e) => (setPreset("custom"), setFrom(e.target.value))} className="min-h-11 rounded-xl border border-border bg-surface px-3 font-normal" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Hasta
            <input type="date" value={to} min={from} max={maxDate} onChange={(e) => (setPreset("custom"), setTo(e.target.value))} className="min-h-11 rounded-xl border border-border bg-surface px-3 font-normal" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Canal
            <select value={channel} onChange={(e) => setChannel(e.target.value as ChannelFilter)} className="min-h-11 rounded-xl border border-border bg-surface px-3 font-normal">
              {CHANNEL_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <a href={`/api/dashboard/export?format=csv&${query}`} download className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cta px-5 text-sm font-semibold text-cta-fg">
            <Download aria-hidden className="h-4 w-4" /> Exportar CSV
          </a>
        </form>
        <div aria-live="polite" className="mt-3 flex min-h-6 items-center gap-2 text-sm text-muted">
          {loading ? (
            <>
              <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> Actualizando datos…
            </>
          ) : error ? (
            <span className="font-medium text-danger">{error}</span>
          ) : (
            <span>
              Mostrando del {shortDate(data.range.from)} al {shortDate(data.range.to)} ({data.range.days} días) · {CHANNEL_OPTIONS.find((c) => c.value === data.channel)?.label}
            </span>
          )}
        </div>

        <div className={cn("transition-opacity", loading && "opacity-60")}>
          {/* Meta + insight de Vera */}
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <section aria-labelledby="meta-title" className="card p-6 md:p-8">
              <h2 id="meta-title" className="flex items-center gap-2 text-lg font-semibold">
                <Target aria-hidden className="h-5 w-5 text-accent" /> {data.goal.label}
              </h2>
              {data.goal.current !== null ? (
                <>
                  <p className="mt-4 font-sans text-[clamp(3rem,2.4rem+2.5vw,4.5rem)] font-semibold leading-none">
                    {data.goal.current >= 0 ? "+" : "−"}
                    {nf(Math.abs(data.goal.current * 100), 1)} %
                  </p>
                  <p className="mt-2 text-muted">Meta: +{nf(data.goal.target * 100)} % en 6 meses frente a las 8 semanas previas a NEXO.</p>
                  {/* Ley de Zeigarnik: avance visible hacia la meta. */}
                  <div className="mt-5">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Avance hacia la meta</span>
                      <span>{nf((data.goal.progress ?? 0) * 100)} %</span>
                    </div>
                    <div
                      className="mt-2 h-3 overflow-hidden rounded-full"
                      style={{ background: "#d7ece4" }}
                      role="progressbar"
                      aria-label="Avance hacia la meta de conversión"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round((data.goal.progress ?? 0) * 100)}
                    >
                      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${(data.goal.progress ?? 0) * 100}%`, background: chartColors.single }} />
                    </div>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-muted">El email marketing empezó con NEXO, así que no tiene línea base. Revisa su costo por lead y las conversiones que aporta.</p>
              )}
            </section>

            <section aria-labelledby="vera-title" className="card border-accent-2/40 bg-[linear-gradient(160deg,rgba(127,119,220,0.10),transparent_60%)] p-6 md:p-8">
              <h2 id="vera-title" className="flex items-center gap-2 text-lg font-semibold">
                <Bot aria-hidden className="h-5 w-5 text-accent-2" /> Insight de Vera
              </h2>
              <ul className="mt-4 space-y-3">
                {data.insight.map((t) => (
                  <li key={t} className="flex gap-2 text-sm leading-relaxed">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted">Lectura automática de los datos del período seleccionado.</p>
            </section>
          </div>

          {/* KPIs */}
          <section aria-labelledby="kpis-title" className="mt-5">
            <h2 id="kpis-title" className="sr-only">
              Indicadores clave
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {data.kpis.map((k) => {
                const good = k.delta === null ? null : k.goodWhenUp ? k.delta >= 0 : k.delta <= 0;
                const Icon = k.delta === null || Math.abs(k.delta) < 0.005 ? Minus : k.delta > 0 ? ArrowUpRight : ArrowDownRight;
                return (
                  <li key={k.id} className="card flex flex-col p-5">
                    <p className="text-sm text-muted">{k.label}</p>
                    {k.notApplicable ? (
                      <>
                        <p className="mt-2 font-sans text-2xl font-semibold text-muted">—</p>
                        <p className="mt-2 text-xs text-muted">No aplica a este canal</p>
                      </>
                    ) : (
                      <>
                        <p className="mt-2 font-sans text-2xl font-semibold tabular-nums">{formatKpi(k)}</p>
                        <p className="mt-2 flex items-center gap-1 whitespace-nowrap text-xs font-semibold">
                          <Icon aria-hidden className={cn("h-4 w-4 shrink-0", good === null ? "text-muted" : good ? "text-success" : "text-danger")} />
                          {k.delta === null ? "Sin período anterior" : `${k.delta >= 0 ? "+" : "−"}${nf(Math.abs(k.delta * 100), 1)} %`}
                        </p>
                        {k.delta !== null ? <p className="text-xs text-muted">vs. período anterior</p> : null}
                      </>
                    )}
                    <p className="mt-auto pt-3 text-xs text-muted">{k.hint}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Tendencia */}
          <section aria-labelledby="trend-title" className="card mt-5 p-6 md:p-8">
            <h2 id="trend-title" className="text-lg font-semibold">
              Conversiones digitales por semana vs. trayectoria de la meta
            </h2>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trend} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
                  <CartesianGrid vertical={false} stroke={chartColors.grid} />
                  <XAxis dataKey="week" tickFormatter={shortDate} tick={{ fill: chartColors.axis, fontSize: 12 }} axisLine={{ stroke: chartColors.grid }} tickLine={false} minTickGap={24} />
                  <YAxis tick={{ fill: chartColors.axis, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} domain={[(min: number) => Math.max(0, Math.floor(min * 0.8)), "auto"]} />
                  <Tooltip content={<ChartTooltip fmt={(l) => `Semana del ${shortDate(l)}`} />} />
                  <Legend verticalAlign="top" align="right" height={32} iconType="plainline" wrapperStyle={{ fontSize: 13, color: chartColors.ink }} />
                  <Line type="monotone" dataKey="conversiones" name="Conversiones" stroke={SERIES.a} strokeWidth={2} dot={{ r: 4, fill: SERIES.a, stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="meta" name="Meta" stroke={SERIES.b} strokeWidth={2} strokeDasharray="6 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <DataTable caption="Conversiones semanales y meta" head={["Semana", "Conversiones", "Meta"]} rows={data.trend.map((t) => [shortDate(t.week), t.conversiones, t.meta])} />
          </section>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* Embudo */}
            <section aria-labelledby="funnel-title" className="card p-6 md:p-8">
              <h2 id="funnel-title" className="text-lg font-semibold">
                Embudo: atracción → fidelización
              </h2>
              <ol className="mt-6 space-y-4">
                {data.funnel.map((f, i) => {
                  const prev = data.funnel[i - 1];
                  const rate = prev && prev.value ? f.value / prev.value : null;
                  const width = Math.max(4, (Math.log10(f.value + 1) / Math.log10(funnelMax + 1)) * 100);
                  return (
                    <li key={f.stage}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-semibold">{f.stage}</span>
                        <span className="tabular-nums">
                          <span className="font-semibold">{nf(f.value)}</span>
                          {rate !== null ? <span className="ml-2 text-muted">({nf(rate * 100, 1)} % de la etapa anterior)</span> : null}
                        </span>
                      </div>
                      <div className="mt-1.5 h-6 rounded-[4px] bg-surface-2">
                        <div className="h-full rounded-[4px]" style={{ width: `${width}%`, background: chartColors.ordinal[i + 1] }} />
                      </div>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-xs text-muted">Barras en escala logarítmica para que las etapas pequeñas sean visibles. Atracción = alcance y visitas; interacción incluye clics a WhatsApp.</p>
            </section>

            {/* Lead scoring */}
            <section aria-labelledby="bands-title" className="card p-6 md:p-8">
              <h2 id="bands-title" className="text-lg font-semibold">
                Leads por banda de lead scoring
              </h2>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.bands} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 8 }} barCategoryGap={8}>
                    <CartesianGrid horizontal={false} stroke={chartColors.grid} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="label" width={88} tick={{ fill: chartColors.ink, fontSize: 13 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(6,35,28,0.04)" }} content={<ChartTooltip />} />
                    <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]} maxBarSize={24}>
                      {data.bands.map((b, i) => (
                        <Cell key={b.label} fill={chartColors.ordinal[i]} />
                      ))}
                      <LabelList dataKey="value" position="right" fill={chartColors.ink} fontSize={13} formatter={(v: unknown) => nf(Number(v))} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted">Frío 0–15 · Tibio 16–30 · Interesado 31–55 · Caliente 56–85 · Fidelizado 86+ puntos.</p>
              <DataTable
                caption="Leads por banda de lead scoring"
                head={["Banda", "Puntos", "Leads", "% del total"]}
                rows={data.bands.map((b) => [b.label, b.range, b.value, bandTotal ? `${nf((b.value / bandTotal) * 100, 1)} %` : "—"])}
              />
            </section>
          </div>

          {/* Canales */}
          <section aria-labelledby="channels-title" className="card mt-5 p-6 md:p-8">
            <h2 id="channels-title" className="text-lg font-semibold">
              Rendimiento por canal
            </h2>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.channels} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 8 }} barGap={2} barCategoryGap={10}>
                    <CartesianGrid horizontal={false} stroke={chartColors.grid} />
                    <XAxis type="number" tick={{ fill: chartColors.axis, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="label" width={104} tick={{ fill: chartColors.ink, fontSize: 13 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "rgba(6,35,28,0.04)" }} content={<ChartTooltip />} />
                    <Legend verticalAlign="top" align="right" height={32} iconType="circle" wrapperStyle={{ fontSize: 13, color: chartColors.ink }} />
                    <Bar dataKey="leads" name="Leads" fill={SERIES.a} radius={[0, 4, 4, 0]} maxBarSize={14}>
                      <LabelList dataKey="leads" position="right" fill={chartColors.ink} fontSize={12} formatter={(v: unknown) => nf(Number(v))} />
                    </Bar>
                    <Bar dataKey="conversiones" name="Conversiones" fill={SERIES.b} radius={[0, 4, 4, 0]} maxBarSize={14}>
                      <LabelList dataKey="conversiones" position="right" fill={chartColors.ink} fontSize={12} formatter={(v: unknown) => nf(Number(v))} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Rendimiento por canal (tabla desplazable)">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Leads, conversiones, inversión y costo por lead por canal</caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="py-2 pr-3 font-semibold">
                        Canal
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-semibold">
                        Leads
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-semibold">
                        Conv.
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-semibold">
                        Inversión
                      </th>
                      <th scope="col" className="py-2 text-right font-semibold">
                        CPL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.channels.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0">
                        <th scope="row" className="py-2.5 pr-3 font-normal">
                          {c.label}
                        </th>
                        <td className="py-2.5 pr-3 text-right tabular-nums">{nf(c.leads)}</td>
                        <td className="py-2.5 pr-3 text-right tabular-nums">{nf(c.conversiones)}</td>
                        <td className="py-2.5 pr-3 text-right tabular-nums">{c.inversion ? compact(c.inversion) : "—"}</td>
                        <td className="py-2.5 text-right tabular-nums">{c.cpl ? cop(c.cpl) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-muted">CPL = costo por lead (inversión ÷ leads). WhatsApp no tiene inversión directa.</p>
              </div>
            </div>
          </section>

          {/* Campañas */}
          <section aria-labelledby="campaigns-title" className="card mt-5 p-6 md:p-8">
            <h2 id="campaigns-title" className="text-lg font-semibold">
              Estado de campañas
            </h2>
            {data.campaigns.length === 0 ? (
              <p className="mt-4 text-muted">Este canal no tiene campañas registradas.</p>
            ) : (
              <div className="relative mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Estado de campañas (tabla desplazable)">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <caption className="sr-only">Campañas de Tienda Óptica con estado, inversión y resultados</caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="py-2 pr-3 font-semibold">
                        Campaña
                      </th>
                      <th scope="col" className="py-2 pr-3 font-semibold">
                        Canal
                      </th>
                      <th scope="col" className="py-2 pr-3 font-semibold">
                        Estado
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-semibold">
                        Inversión
                      </th>
                      <th scope="col" className="py-2 font-semibold">
                        Resultados
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.campaigns.map((c) => {
                      const s = statusStyle[c.estado] ?? statusStyle["en preparación"];
                      const r = c.resultados;
                      const summary =
                        "aperturaPct" in r
                          ? r.enviados
                            ? `${nf(r.enviados)} enviados · ${nf(r.aperturaPct, 1)} % apertura · ${nf(r.conversiones)} conversiones`
                            : "Arranca cuando los primeros clientes cumplan 6 meses"
                          : "leads" in r
                            ? `${nf(r.leads)} leads · ${nf(r.conversiones)} conversiones`
                            : "piezas" in r
                              ? `${nf(r.piezas)} piezas en producción`
                              : "—";
                      return (
                        <tr key={c.nombre} className="border-b border-border last:border-0">
                          <th scope="row" className="py-3 pr-3 font-semibold">
                            {c.nombre}
                          </th>
                          <td className="py-3 pr-3 capitalize text-muted">{c.canal}</td>
                          <td className="py-3 pr-3">
                            <span className="inline-flex items-center gap-1.5">
                              <s.icon aria-hidden className={cn("h-4 w-4", s.cls)} />
                              <span className="inline-block first-letter:uppercase">{c.estado}</span>
                            </span>
                          </td>
                          <td className="py-3 pr-3 text-right tabular-nums">{c.inversion ? cop(c.inversion) : "—"}</td>
                          <td className="py-3 text-muted">{summary}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="mt-8 text-center text-sm text-muted">
            Todos los números de este panel son datos de demostración, simulados con fines académicos para la propuesta de NEXO.
          </p>
        </div>
      </div>
    </div>
  );
}
