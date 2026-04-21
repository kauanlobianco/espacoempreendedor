"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  AUTH_EXPIRED_EVENT,
  clearSession,
  getDefaultRouteForRole,
  hydrateSession,
  persistSession,
  type StoredSession,
} from "@/lib/auth/session";
import { authService } from "@/services/auth";
import type { SessionUser } from "@/types/api";

interface SessionContextValue {
  ready: boolean;
  user: SessionUser | null;
  token: string | null;
  login: (session: StoredSession) => void;
  refresh: () => Promise<void>;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<StoredSession | null>(null);

  const login = useCallback((nextSession: StoredSession) => {
    persistSession(nextSession);
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    router.push("/login");
  }, [router]);

  const refresh = useCallback(async () => {
    const current = hydrateSession();
    if (!current) {
      setSession(null);
      return;
    }

    try {
      const user = await authService.me();
      const nextSession = { accessToken: current.accessToken, user };
      persistSession(nextSession);
      setSession(nextSession);
    } catch {
      clearSession();
      setSession(null);
    }
  }, []);

  useEffect(() => {
    const current = hydrateSession();
    const hydrationId = window.setTimeout(() => {
      if (current) {
        setSession(current);
        void refresh();
      }

      setReady(true);
    }, 0);

    const onExpired = () => {
      clearSession();
      setSession(null);
      router.push("/session-expired");
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired as EventListener);
    return () => {
      window.clearTimeout(hydrationId);
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired as EventListener);
    };
  }, [refresh, router]);

  const value = useMemo<SessionContextValue>(
    () => ({
      ready,
      user: session?.user ?? null,
      token: session?.accessToken ?? null,
      login,
      refresh,
      logout,
    }),
    [login, logout, ready, refresh, session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function redirectAfterLogin(role: SessionUser["role"]) {
  return getDefaultRouteForRole(role);
}
