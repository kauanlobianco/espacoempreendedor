import { Check, X } from "lucide-react";

import { ValidationStatusBadge } from "@/components/data-display/case-status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime, formatHours } from "@/lib/formatters";
import type { PendingValidation } from "@/types/api";

export function ValidationCard({
  item,
  onApprove,
  onReject,
  busy,
}: {
  item: PendingValidation;
  onApprove: () => void;
  onReject: () => void;
  busy?: boolean;
}) {
  const isAttendance = item.target === "ATTENDANCE";
  const studentName = isAttendance
    ? item.attendance?.student.fullName
    : item.extensionHours?.student.fullName;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-brand-line/60 bg-white/80 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
            {isAttendance ? "Atendimento" : "Horas extensionistas"}
          </p>
          <h3 className="mt-0.5 text-base font-semibold text-brand-ink">{studentName}</h3>
        </div>
        <ValidationStatusBadge status={item.status} />
      </div>

      <dl className="grid gap-2 rounded-xl bg-brand-paper/60 px-4 py-3 text-sm leading-6">
        {isAttendance ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-brand-night/65">Caso</dt>
              <dd className="font-mono font-semibold text-brand-ink">{item.attendance?.case.code}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-brand-night/65">Quando</dt>
              <dd className="text-brand-night">{formatDateTime(item.attendance?.occurredAt)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-brand-night/65">Duração</dt>
              <dd className="text-brand-night">{item.attendance?.durationMin} min</dd>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-brand-night/65">Data</dt>
              <dd className="text-brand-night">{formatDate(item.extensionHours?.referenceDate)}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-brand-night/65">Carga</dt>
              <dd className="font-semibold text-brand-ink">{formatHours(item.extensionHours?.hours)}</dd>
            </div>
          </>
        )}
      </dl>

      {isAttendance && item.attendance?.summary ? (
        <p className="text-sm leading-5 text-brand-night/80">{item.attendance.summary}</p>
      ) : null}
      {!isAttendance && item.extensionHours?.activity ? (
        <p className="text-sm leading-5 text-brand-night/80">{item.extensionHours.activity}</p>
      ) : null}

      <div className="flex gap-2 pt-1">
        <Button
          onClick={onApprove}
          disabled={busy}
          size="sm"
          className="flex-1 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Check className="size-3.5" />
          Aprovar
        </Button>
        <Button
          onClick={onReject}
          disabled={busy}
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50"
        >
          <X className="size-3.5" />
          Reprovar
        </Button>
      </div>
    </div>
  );
}
