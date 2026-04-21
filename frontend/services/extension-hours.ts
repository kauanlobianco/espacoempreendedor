import { api } from "@/lib/api/client";
import type {
  CreateExtensionHoursPayload,
  ExtensionHoursEntry,
  ExtensionHoursSummary,
} from "@/types/api";

export const extensionHoursService = {
  async log(payload: CreateExtensionHoursPayload) {
    const { data } = await api.post<ExtensionHoursEntry>("/extension-hours", payload);
    return data;
  },
  async mine() {
    const { data } = await api.get<ExtensionHoursEntry[]>("/extension-hours/me");
    return data;
  },
  async summary(studentId: string) {
    const { data } = await api.get<ExtensionHoursSummary>(
      `/extension-hours/students/${studentId}/summary`,
    );
    return data;
  },
};
