import axios from "axios";

import { API_URL } from "@/lib/constants/domain";
import {
  clearSession,
  getStoredToken,
  notifyAuthExpired,
} from "@/lib/auth/session";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearSession();
      notifyAuthExpired();
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(
  error: unknown,
  fallback = "Nao foi possivel concluir a acao.",
) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return fallback;
    }

    const apiMessage = error.response?.data?.message;

    if (Array.isArray(apiMessage)) {
      return apiMessage[0] ?? fallback;
    }

    if (typeof apiMessage === "string") {
      return apiMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
