import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, STATUS_TONE, VALIDATION_LABEL, VALIDATION_TONE } from "@/lib/constants/domain";
import type { CaseStatus, ValidationStatus } from "@/types/api";

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return (
    <Badge className={`border ${STATUS_TONE[status]}`} variant="outline">
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function ValidationStatusBadge({ status }: { status: ValidationStatus }) {
  return (
    <Badge className={`border ${VALIDATION_TONE[status]}`} variant="outline">
      {VALIDATION_LABEL[status]}
    </Badge>
  );
}
