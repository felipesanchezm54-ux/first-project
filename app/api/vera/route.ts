import { veraReply } from "@/lib/vera";
import { veraSchema } from "@/lib/schemas";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";

/** POST /api/vera — responde el chat de Vera (Claude si hay ANTHROPIC_API_KEY; si no, respuestas por intención). */
export async function POST(req: Request) {
  const limit = rateLimit(`vera:${clientIp(req)}`, { limit: 20, windowMs: 5 * 60_000 });
  if (!limit.ok) return tooMany(limit.retryAfter);

  const body = await req.json().catch(() => null);
  const parsed = veraSchema.safeParse(body ?? {});
  if (!parsed.success) return Response.json({ message: "Escribe una pregunta de hasta 1.000 caracteres." }, { status: 400 });
  if (parsed.data.messages[0].role !== "user") return Response.json({ message: "La conversación debe empezar con un mensaje del usuario." }, { status: 400 });

  const result = await veraReply(parsed.data.messages);
  return Response.json(result);
}
