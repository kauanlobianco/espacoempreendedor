import { api } from "@/lib/api/client";
import type {
  PendingValidation,
  ValidationDecisionPayload,
  ValidationTarget,
} from "@/types/api";

export const validationsService = {
  async listPending(target?: ValidationTarget) {
    const { data } = await api.get<PendingValidation[]>("/validations/pending", {
      params: target ? { target } : undefined,
    });
    return data;
  },
  async decide(id: string, payload: ValidationDecisionPayload) {
    const { data } = await api.patch(`/validations/${id}/decision`, payload);
    return data;
  },
};
