"use client";

import { useContext } from "react";

import { SessionContext } from "@/features/auth/session-provider";

export function useAuth() {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useAuth precisa ser usado dentro de SessionProvider");
  }

  return value;
}
