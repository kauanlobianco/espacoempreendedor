import { api } from "@/lib/api/client";
import type { StudentPerformanceResponse, UserRole, UserSummary } from "@/types/api";

export const usersService = {
  async list(role?: UserRole) {
    const { data } = await api.get<UserSummary[]>("/users", {
      params: role ? { role } : undefined,
    });
    return data;
  },
  async listPending() {
    const { data } = await api.get<UserSummary[]>("/users/pending");
    return data;
  },
  async findOne(id: string) {
    const { data } = await api.get<UserSummary>(`/users/${id}`);
    return data;
  },
  async performance(id: string) {
    const { data } = await api.get<StudentPerformanceResponse>(`/users/${id}/performance`);
    return data;
  },
  async setActive(id: string, active: boolean) {
    const { data } = await api.patch<{ id: string; active: boolean }>(`/users/${id}/active`, {
      active,
    });
    return data;
  },
};
