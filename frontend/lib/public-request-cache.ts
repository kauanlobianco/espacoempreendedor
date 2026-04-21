import type { CaseCategory } from "@/types/api";

const PUBLIC_REQUEST_CACHE_KEY = "espaco-empreendedor:last-public-request";

export interface CachedPublicRequest {
  fullName: string;
  phone: string;
  email?: string;
  category: CaseCategory;
  requestId?: string;
  submittedAt: string;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveCachedPublicRequest(payload: CachedPublicRequest) {
  if (!isBrowser()) return;
  window.localStorage.setItem(PUBLIC_REQUEST_CACHE_KEY, JSON.stringify(payload));
}

export function getCachedPublicRequest(): CachedPublicRequest | null {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(PUBLIC_REQUEST_CACHE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CachedPublicRequest;
  } catch {
    window.localStorage.removeItem(PUBLIC_REQUEST_CACHE_KEY);
    return null;
  }
}

export function clearCachedPublicRequest() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(PUBLIC_REQUEST_CACHE_KEY);
}
