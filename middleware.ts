import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if ((!isAdminPage && !isAdminApi) || pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get("sinha_admin_session")?.value;
  const expectedSession = process.env.ADMIN_SESSION_TOKEN || "local-sinha-admin-session";

  if (session === expectedSession) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ ok: false, error: "Admin login required." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
