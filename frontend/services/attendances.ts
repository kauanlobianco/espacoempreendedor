import { api } from "@/lib/api/client";
import type { Attendance, CreateAttendancePayload } from "@/types/api";

export const attendancesService = {
  async listByCase(caseId: string) {
    const { data } = await api.get<Attendance[]>(`/cases/${caseId}/attendances`);
    return data;
  },
  async create(caseId: string, payload: CreateAttendancePayload) {
    const { data } = await api.post<Attendance>(`/cases/${caseId}/attendances`, payload);
    return data;
  },
};
