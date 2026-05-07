import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  const expectedPassword = process.env.ADMIN_PASSWORD || "sinha@7004780803";
  const sessionToken = process.env.ADMIN_SESSION_TOKEN || "local-sinha-admin-session";

  if (password !== expectedPassword) {
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sinha_admin_session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
