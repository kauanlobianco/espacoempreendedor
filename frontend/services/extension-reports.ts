import { api } from "@/lib/api/client";
import { API_URL } from "@/lib/constants/domain";
import { getStoredToken } from "@/lib/auth/session";
import type {
  EligibleCase,
  ExtensionReportDetail,
  ExtensionReportQueueItem,
  ExtensionReportStatus,
  ExtensionReportSummary,
} from "@/types/api";

export const extensionReportsService = {
  async eligibleCases() {
    const { data } = await api.get<EligibleCase[]>("/extension-reports/eligible-cases");
    return data;
  },
  async listMine() {
    const { data } = await api.get<ExtensionReportSummary[]>("/extension-reports/mine");
    return data;
  },
  async createDraft(caseIds: string[]) {
    const { data } = await api.post<ExtensionReportDetail>("/extension-reports/drafts", {
      caseIds,
    });
    return data;
  },
  async update(id: string, payload: { narrative?: string; caseIds?: string[] }) {
    const { data } = await api.patch<ExtensionReportDetail>(
      `/extension-reports/${id}`,
      payload,
    );
    return data;
  },
  async submit(id: string) {
    const { data } = await api.post<ExtensionReportSummary>(
      `/extension-reports/${id}/submit`,
    );
    return data;
  },
  async getOne(id: string) {
    const { data } = await api.get<ExtensionReportDetail>(`/extension-reports/${id}`);
    return data;
  },
  async queue(status?: ExtensionReportStatus) {
    const { data } = await api.get<ExtensionReportQueueItem[]>("/extension-reports", {
      params: status ? { status } : undefined,
    });
    return data;
  },
  async claim(id: string) {
    const { data } = await api.post<ExtensionReportSummary>(
      `/extension-reports/${id}/claim`,
    );
    return data;
  },
  async uploadSigned(id: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post<ExtensionReportSummary>(
      `/extension-reports/${id}/upload-signed`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
  async complete(id: string) {
    const { data } = await api.post<ExtensionReportSummary>(
      `/extension-reports/${id}/complete`,
    );
    return data;
  },
  async returnToStudent(id: string, reviewerNote: string) {
    const { data } = await api.post<ExtensionReportSummary>(
      `/extension-reports/${id}/return`,
      { reviewerNote },
    );
    return data;
  },
};

export const extensionReportsUrls = {
  preview: (id: string) => `${API_URL}/extension-reports/${id}/preview.pdf`,
  generated: (id: string) => `${API_URL}/extension-reports/${id}/generated.pdf`,
  signed: (id: string) => `${API_URL}/extension-reports/${id}/signed.pdf`,
};

export async function fetchReportPdf(url: string): Promise<Blob> {
  const token = getStoredToken();
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error("Falha ao baixar PDF");
  return res.blob();
}
