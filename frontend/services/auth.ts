import { api } from "@/lib/api/client";
import type {
  AuthResponse,
  FirstAccessPayload,
  RegisterStudentPayload,
  SessionUser,
} from "@/types/api";

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    return data;
  },
  async registerStudent(payload: RegisterStudentPayload) {
    const { data } = await api.post<{ message: string }>("/auth/register/student", payload);
    return data;
  },
  async firstAccess(payload: FirstAccessPayload) {
    const { data } = await api.post<AuthResponse>("/auth/first-access", payload);
    return data;
  },
  async me() {
    const { data } = await api.get<SessionUser>("/auth/me");
    return data;
  },
};
