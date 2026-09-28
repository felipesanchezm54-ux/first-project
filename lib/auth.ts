// Solo los módulos de firma y verificación (evita cargar el código de cifrado JWE, no compatible con Edge).
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

/** Sesión del panel: JWT firmado (HS256) en una cookie httpOnly. Funciona en Node y en el middleware (Edge). */
export const SESSION_COOKIE = "nexo_session";
const MAX_AGE = 60 * 60 * 8; // 8 horas

export type Session = { userId: string; clientId: string; correo: string; nombre: string };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET debe tener al menos 32 caracteres.");
    return new TextEncoder().encode("solo-desarrollo-no-usar-en-produccion-0000");
  }
  return new TextEncoder().encode(value);
}

export async function createSessionToken(session: Session) {
  return new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${MAX_AGE}s`).sign(secret());
}

export async function verifySessionToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return { userId: String(payload.userId), clientId: String(payload.clientId), correo: String(payload.correo), nombre: String(payload.nombre) };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
