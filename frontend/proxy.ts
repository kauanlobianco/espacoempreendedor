import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const studentPrefix = "/aluno";
const professorPrefix = "/professor";
const loginPath = "/login";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("ee_auth_token")?.value;
  const role = request.cookies.get("ee_auth_role")?.value;
  const pathname = request.nextUrl.pathname;

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
  matcher: ["/login", "/aluno/:path*", "/professor/:path*"],
};
