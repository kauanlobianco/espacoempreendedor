import type { SessionUser, UserRole } from "@/types/api";

export const AUTH_STORAGE_KEY = "ee.session";
export const AUTH_TOKEN_COOKIE = "ee_auth_token";
export const AUTH_ROLE_COOKIE = "ee_auth_role";
export const AUTH_EXPIRED_EVENT = "ee-auth-expired";

export interface StoredSession {
  accessToken: string;
  user: SessionUser;
}

export function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const found = document.cookie.split("; ").find((chunk) => chunk.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
}

export function setCookie(name: string, value: string, days = 1) {
  if (typeof document === "undefined") return;

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`;
}

export function clearCookie(name: string) {
  if (typeof document === "undefined") return;

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; samesite=lax`;
}

export function persistSession(session: StoredSession) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  setCookie(AUTH_TOKEN_COOKIE, session.accessToken);
  setCookie(AUTH_ROLE_COOKIE, session.user.role);
}

export function hydrateSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  clearCookie(AUTH_TOKEN_COOKIE);
  clearCookie(AUTH_ROLE_COOKIE);
}

export function getStoredToken() {
  return getCookie(AUTH_TOKEN_COOKIE) ?? hydrateSession()?.accessToken ?? null;
}

export function getStoredRole(): UserRole | null {
  const role = getCookie(AUTH_ROLE_COOKIE) ?? hydrateSession()?.user.role ?? null;
  return role as UserRole | null;
}

export function notifyAuthExpired() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

export function getDefaultRouteForRole(role?: UserRole | null) {
  if (role === "STUDENT") return "/aluno/fila";
  if (role === "PROFESSOR" || role === "ADMIN") return "/professor/dashboard";
  return "/";
}
