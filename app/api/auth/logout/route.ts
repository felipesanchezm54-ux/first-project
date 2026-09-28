import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

/** POST /api/auth/logout — borra la cookie de sesión. */
export async function POST() {
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ message: "Sesión cerrada." }, { status: 200 });
}

/** GET /api/auth/logout?next=/panel/ingresar — usado cuando la sesión apunta a un cliente que ya no existe. */
export async function GET(req: Request) {
  (await cookies()).delete(SESSION_COOKIE);
  const next = new URL(req.url).searchParams.get("next");
  return Response.redirect(new URL(next?.startsWith("/panel") ? next : "/panel/ingresar", req.url), 303);
}
