import { fieldErrors, newsletterSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";

/** POST /api/newsletter — guarda (o reactiva) un suscriptor. Idempotente por correo. */
export async function POST(req: Request) {
  const limit = rateLimit(`newsletter:${clientIp(req)}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limit.ok) return tooMany(limit.retryAfter);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ message: "No pudimos leer la solicitud." }, { status: 400 });
  if (typeof body.website === "string" && body.website.length > 0) return Response.json({ message: "¡Listo! Te llegará el próximo boletín." }, { status: 201 });

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return Response.json({ message: Object.values(fieldErrors(parsed.error))[0], errors: fieldErrors(parsed.error) }, { status: 422 });

  const existing = await db.subscriber.findUnique({ where: { correo: parsed.data.correo } });
  if (existing) {
    return Response.json({ message: "Ya estabas suscrito con este correo. Te seguirá llegando el boletín." }, { status: 200 });
  }
  await db.subscriber.create({ data: { correo: parsed.data.correo, consentimiento: true, origen: parsed.data.origen } });
  return Response.json({ message: "¡Listo! Te llegará el próximo boletín." }, { status: 201 });
}
