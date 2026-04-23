import type { PillTone } from "@/components/ui/pill";
import type { ExtensionReportStatus } from "@/types/api";

export const STATUS_LABEL: Record<ExtensionReportStatus, string> = {
  DRAFT: "Rascunho",
  SUBMITTED: "Enviado para análise",
  UNDER_REVIEW: "Em análise",
  SIGNED: "Assinado",
  COMPLETED: "Concluído",
  RETURNED: "Devolvido para correção",
};

export const STATUS_PILL_TONE: Record<ExtensionReportStatus, PillTone> = {
  DRAFT: "neutral",
  SUBMITTED: "amber",
  UNDER_REVIEW: "amber",
  SIGNED: "green",
  COMPLETED: "green",
  RETURNED: "red",
};

export const MIN_NARRATIVE_CHARS = 200;
