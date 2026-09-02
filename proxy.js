import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

// Paths reachable without a session.
const PUBLIC_PAGES = ["/login", "/setup"];
const PUBLIC_API_PREFIXES = ["/api/auth/login", "/api/auth/setup", "/api/auth/logout"];

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  const isPublicPage = PUBLIC_PAGES.includes(pathname);
  const isPublicApi = PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p));
  if (isPublicPage || isPublicApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Tizimga kirish talab qilinadi" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
