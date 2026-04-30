import { NextResponse } from "next/server";

import {
  SITE_ACCESS_COOKIE,
  SITE_ACCESS_MAX_AGE,
  SITE_ACCESS_PASSWORD,
  SITE_ACCESS_TOKEN,
} from "@/lib/site-access";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password?.trim();

  if (password !== SITE_ACCESS_PASSWORD) {
    return NextResponse.json({ message: "Credencial invalida." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SITE_ACCESS_COOKIE, SITE_ACCESS_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SITE_ACCESS_MAX_AGE,
  });

  return response;
}
