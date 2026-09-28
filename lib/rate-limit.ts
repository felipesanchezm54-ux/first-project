/**
 * Rate limiting simple en memoria (ventana deslizante por IP).
 * Suficiente para la demo en un solo servidor; en producción con varias
 * instancias se reemplaza por Redis/Upstash con la misma interfaz.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear();
  return { ok: true, retryAfter: 0 };
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

export function tooMany(retryAfter: number) {
  return Response.json(
    { message: `Recibimos demasiadas solicitudes seguidas. Intenta de nuevo en ${retryAfter} segundos.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
