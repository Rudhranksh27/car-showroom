import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./app/lib/auth";

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login" || req.nextUrl.pathname === "/admin/signup") {
    return NextResponse.next();
  }

  const session = await verifySession(req);

  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", `${req.nextUrl.pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", `${req.nextUrl.pathname}${req.nextUrl.search}`);
    loginUrl.searchParams.set("reason", "admin-required");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
