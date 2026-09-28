import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { fieldErrors, loginSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { SESSION_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/auth";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";

/** POST /api/auth/login — verifica credenciales y crea la cookie de sesión httpOnly. */
export async function POST(req: Request) {
  const limit = rateLimit(`login:${clientIp(req)}`, { limit: 8, windowMs: 10 * 60_000 });
  if (!limit.ok) return tooMany(limit.retryAfter);

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body ?? {});
  if (!parsed.success) return Response.json({ message: "Revisa los campos marcados.", errors: fieldErrors(parsed.error) }, { status: 422 });

  const user = await db.user.findUnique({ where: { correo: parsed.data.correo } });
  const ok = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) {
    // Mismo mensaje para correo o contraseña incorrectos: no revela qué cuentas existen.
    return Response.json({ message: "El correo o la contraseña no coinciden. Verifica e intenta de nuevo." }, { status: 401 });
  }

  const token = await createSessionToken({ userId: user.id, clientId: user.clientId, correo: user.correo, nombre: user.nombre });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
  return Response.json({ message: "Sesión iniciada." }, { status: 200 });
}
