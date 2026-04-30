import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SITE_ACCESS_COOKIE, SITE_ACCESS_TOKEN } from "@/lib/site-access";

const studentPrefix = "/aluno";
const professorPrefix = "/professor";
const loginPath = "/login";
const siteAccessPath = "/acesso";
const siteAccessApiPath = "/api/site-access";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("ee_auth_token")?.value;
  const role = request.cookies.get("ee_auth_role")?.value;
  const hasSiteAccess =
    request.cookies.get(SITE_ACCESS_COOKIE)?.value === SITE_ACCESS_TOKEN;
  const pathname = request.nextUrl.pathname;
  const isSiteAccessRoute = pathname === siteAccessPath;
  const isSiteAccessApiRoute = pathname === siteAccessApiPath;

  if (!hasSiteAccess && !isSiteAccessRoute && !isSiteAccessApiRoute) {
    const accessUrl = new URL(siteAccessPath, request.url);
    accessUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(accessUrl);
  }

  if (hasSiteAccess && isSiteAccessRoute) {
    const next = request.nextUrl.searchParams.get("next");
    return NextResponse.redirect(new URL(next?.startsWith("/") ? next : "/", request.url));
  }

  if (pathname.startsWith(studentPrefix)) {
    if (!token) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    if (role !== "STUDENT") {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  if (pathname.startsWith(professorPrefix)) {
    if (!token) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    if (!["PROFESSOR", "ADMIN"].includes(role ?? "")) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  if (pathname === loginPath && token) {
    if (role === "STUDENT") {
      return NextResponse.redirect(new URL("/aluno/fila", request.url));
    }

    if (role === "PROFESSOR" || role === "ADMIN") {
      return NextResponse.redirect(new URL("/professor/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
