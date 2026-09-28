import { getSession } from "@/lib/session";
import { getDashboard } from "@/lib/dashboard";
import { fieldErrors, metricsQuerySchema } from "@/lib/schemas";

/** GET /api/dashboard/metrics?from=AAAA-MM-DD&to=AAAA-MM-DD&channel=web — protegido por sesión. */
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ message: "Tu sesión expiró. Ingresa de nuevo al panel." }, { status: 401 });

  const params = Object.fromEntries(new URL(req.url).searchParams);
  const parsed = metricsQuerySchema.safeParse({ from: params.from || undefined, to: params.to || undefined, channel: params.channel || undefined });
  if (!parsed.success) return Response.json({ message: "Filtros inválidos.", errors: fieldErrors(parsed.error) }, { status: 400 });

  // El cliente sale del token de sesión, nunca de la URL: nadie puede ver datos de otra marca.
  const data = await getDashboard(session.clientId, parsed.data);
  if (!data) return Response.json({ message: "Tu sesión ya no es válida. Ingresa de nuevo al panel." }, { status: 401 });
  return Response.json(data, { headers: { "Cache-Control": "private, no-store" } });
}
