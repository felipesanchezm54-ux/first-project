import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/** Protege el panel y su API: sin sesión válida, redirige al login (o responde 401 en la API). */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/panel/ingresar") return NextResponse.next();

  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "Tu sesión expiró. Ingresa de nuevo al panel." }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/panel/ingresar";
  url.search = pathname === "/panel" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = { runtime: "nodejs", matcher: ["/panel/:path*", "/api/dashboard/:path*"] };
