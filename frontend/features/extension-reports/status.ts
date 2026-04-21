import type { ExtensionReportStatus } from "@/types/api";

export const STATUS_LABEL: Record<ExtensionReportStatus, string> = {
  DRAFT: "Rascunho",
  SUBMITTED: "Enviado para análise",
  UNDER_REVIEW: "Em análise",
  SIGNED: "Assinado",
  COMPLETED: "Concluído",
  RETURNED: "Devolvido para correção",
};

export const STATUS_TONE: Record<ExtensionReportStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-amber-100 text-amber-800",
  UNDER_REVIEW: "bg-amber-100 text-amber-800",
  SIGNED: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  RETURNED: "bg-rose-100 text-rose-800",
};

export const MIN_NARRATIVE_CHARS = 200;
