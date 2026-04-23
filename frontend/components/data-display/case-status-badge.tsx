import { Pill } from "@/components/ui/pill";
import {
  STATUS_LABEL,
  STATUS_TONE,
  VALIDATION_LABEL,
  VALIDATION_TONE,
} from "@/lib/constants/domain";
import type { CaseStatus, ValidationStatus } from "@/types/api";

const PULSE_STATUS: ReadonlySet<CaseStatus> = new Set(["NEW", "WAITING_USER"]);

export function CaseStatusBadge({
  status,
  size = "md",
}: {
  status: CaseStatus;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Pill
      tone={STATUS_TONE[status]}
      size={size}
      withDot
      pulse={PULSE_STATUS.has(status)}
    >
      {STATUS_LABEL[status]}
    </Pill>
  );
}

export function ValidationStatusBadge({
  status,
  size = "md",
}: {
  status: ValidationStatus;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Pill
      tone={VALIDATION_TONE[status]}
      size={size}
      withDot
      pulse={status === "PENDING"}
    >
      {VALIDATION_LABEL[status]}
    </Pill>
  );
}
