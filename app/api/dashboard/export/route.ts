import { getSession } from "@/lib/session";
import { getExportRows } from "@/lib/dashboard";
import { metricsQuerySchema } from "@/lib/schemas";

const LABELS: Record<string, string> = {
  alcance: "Alcance / visitas",
  interacciones: "Interacciones",
  leads: "Leads",
  conversiones: "Conversiones",
  inversion: "Inversión (COP)",
  seguidores_nuevos: "Seguidores nuevos",
  clics_whatsapp: "Clics a WhatsApp",
  enviados: "Correos enviados",
  aperturas: "Aperturas",
  recompras: "Recompras",
  banda_frio: "Leads banda frío",
  banda_tibio: "Leads banda tibio",
  banda_interesado: "Leads banda interesado",
  banda_caliente: "Leads banda caliente",
  banda_fidelizado: "Leads banda fidelizado",
};

const cell = (v: string | number) => {
  const s = typeof v === "number" ? v.toLocaleString("es-CO", { maximumFractionDigits: 2, useGrouping: false }) : v;
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * GET /api/dashboard/export?format=csv&from=&to=&channel= — protegido.
 * CSV con separador ";" y coma decimal (lo abre bien Excel en español) y BOM UTF-8 para las tildes.
 */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ message: "Tu sesión expiró. Ingresa de nuevo al panel." }, { status: 401 });

  const params = Object.fromEntries(new URL(req.url).searchParams);
  if ((params.format ?? "csv") !== "csv") return Response.json({ message: "Formato no soportado. Usa format=csv." }, { status: 400 });
  const parsed = metricsQuerySchema.safeParse({ from: params.from || undefined, to: params.to || undefined, channel: params.channel || undefined });
  if (!parsed.success) return Response.json({ message: "Filtros inválidos." }, { status: 400 });

  const { range, rows } = await getExportRows(session.clientId, parsed.data);
  const lines = [
    ["Fecha", "Canal", "Métrica", "Valor", "Meta"].join(";"),
    ...rows.map((r) =>
      [new Date(r.fecha.getTime() - 5 * 3_600_000).toISOString().slice(0, 10), r.canal, LABELS[r.nombre] ?? r.nombre, cell(r.valor), r.meta === null ? "" : cell(r.meta)].join(";"),
    ),
    "",
    "Datos de demostración (simulados con fines académicos) · NEXO",
  ];
  const filename = `nexo-tienda-optica_${range.from}_${range.to}_${parsed.data.channel}.csv`;
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
