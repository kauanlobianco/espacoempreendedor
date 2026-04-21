import { CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { INTERACTION_TYPE_LABEL, PREFERRED_CHANNEL_LABEL } from "@/lib/constants/domain";
import { formatDateTime } from "@/lib/formatters";
import type { Attendance } from "@/types/api";

const INTERACTION_ACCENT: Record<string, string> = {
  SIMPLE_GUIDANCE: "bg-sky-100 text-sky-800",
  GUIDANCE_WITH_REFERRAL: "bg-violet-100 text-violet-800",
  DETAILED_SUPPORT: "bg-amber-100 text-amber-800",
  ONGOING_CASE: "bg-amber-100 text-amber-800",
};

export function CaseTimeline({ attendances }: { attendances: Attendance[] }) {
  if (attendances.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-line/60 bg-white/50 p-5 text-sm text-muted-foreground">
        Nenhum atendimento registrado ainda.
      </div>
    );
  }

  return (
    <div className="relative min-w-0 space-y-4 pl-5">
      <div className="absolute top-2 bottom-2 left-2 w-px bg-brand-line/60" />

      {attendances.map((attendance) => {
        const hasStructured = Boolean(attendance.demandDescription);
        const interactionLabel = INTERACTION_TYPE_LABEL[attendance.interactionType] ?? "Atendimento";
        const interactionAccent = INTERACTION_ACCENT[attendance.interactionType] ?? "bg-slate-100 text-slate-700";

        return (
          <article
            key={attendance.id}
            className="relative min-w-0 w-full overflow-hidden rounded-2xl border border-brand-line/60 bg-white/80 p-5 shadow-soft"
          >
            <div className="absolute -left-[1.4rem] top-5 flex size-5 items-center justify-center rounded-full border border-brand-line bg-white">
              <div className="size-2 rounded-full bg-brand-orange" />
            </div>

            {/* Header row */}
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs">
                <Clock className="size-3 shrink-0 text-brand-orange" />
                <span className="font-medium text-brand-night/70">
                  {formatDateTime(attendance.occurredAt)}
                </span>
                <span className="rounded-full bg-brand-paper px-2 py-0.5 font-medium text-brand-night/70">
                  {PREFERRED_CHANNEL_LABEL[attendance.channel]}
                </span>
                <span className={cn("rounded-full px-2 py-0.5 font-medium", interactionAccent)}>
                  {interactionLabel}
                </span>
                {attendance.needsFollowUp ? (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                    <RefreshCw className="size-2.5" /> Requer retorno
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                    <CheckCircle2 className="size-2.5" /> Resolvido
                  </span>
                )}
              </div>
              {attendance.student?.fullName ? (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {attendance.student.fullName}
                </span>
              ) : null}
            </div>

            {hasStructured ? (
              <dl className="mt-4 min-w-0 space-y-2 text-sm">
                <div className="min-w-0 overflow-hidden rounded-xl bg-brand-paper/60 px-3.5 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-night/50">
                    O que o empreendedor precisava
                  </dt>
                  <dd className="mt-1 min-w-0 break-words whitespace-pre-wrap leading-6 text-brand-ink">
                    {attendance.demandDescription}
                  </dd>
                </div>

                <div className="min-w-0 overflow-hidden rounded-xl bg-brand-paper/60 px-3.5 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-night/50">
                    O que o aluno fez
                  </dt>
                  <dd className="mt-1 min-w-0 break-words whitespace-pre-wrap leading-6 text-brand-ink">
                    {attendance.actionTaken}
                  </dd>
                </div>

                <div className="min-w-0 overflow-hidden rounded-xl bg-brand-paper/60 px-3.5 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-night/50">
                    Resultado
                  </dt>
                  <dd className="mt-1 min-w-0 break-words whitespace-pre-wrap leading-6 text-brand-ink">
                    {attendance.outcome}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 min-w-0 break-words whitespace-pre-wrap text-sm leading-6 text-brand-night/80">
                {attendance.summary}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
