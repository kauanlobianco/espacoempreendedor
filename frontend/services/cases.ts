import { api } from "@/lib/api/client";
import type {
  CaseCategory,
  CaseDetail,
  CaseListResponse,
  CaseStatus,
  UpdateCaseStatusPayload,
} from "@/types/api";

interface ListCasesParams {
  status?: CaseStatus;
  category?: CaseCategory;
  assigneeId?: string;
  page?: number;
  pageSize?: number;
}

export const casesService = {
  async list(params: ListCasesParams = {}) {
    const { data } = await api.get<CaseListResponse>("/cases", { params });
    return data;
  },
  async findOne(id: string) {
    const { data } = await api.get<CaseDetail>(`/cases/${id}`);
    return data;
  },
  async assign(caseId: string, studentId: string) {
    const { data } = await api.post(`/cases/${caseId}/assign`, { studentId });
    return data;
  },
  async updateStatus(caseId: string, payload: UpdateCaseStatusPayload) {
    const { data } = await api.patch(`/cases/${caseId}/status`, payload);
    return data;
  },
};
