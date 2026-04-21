import { api } from "@/lib/api/client";
import type {
  CreateRequestPayload,
  RequestSubmissionResponse,
  TrackedRequestResponse,
} from "@/types/api";

export const requestsService = {
  async submit(payload: CreateRequestPayload) {
    const { data } = await api.post<RequestSubmissionResponse>("/requests", payload);
    return data;
  },
  async track(contact: string) {
    const { data } = await api.get<TrackedRequestResponse>("/requests/track", {
      params: { contact: contact.trim() },
    });
    return data;
  },
};
