"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MessageSquareMore, X } from "lucide-react";
import { toast } from "sonner";

import { MetricCard } from "@/components/data-display/metric-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { formatDate, formatDateTime, formatHours } from "@/lib/formatters";
import { validationsService } from "@/services/validations";
import { getErrorMessage } from "@/lib/api/client";
import type { PendingValidation, ValidationTarget, ValidationStatus } from "@/types/api";

type FilterKey = "ALL" | ValidationTarget;

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "ALL", label: "Tudo" },
  { key: "ATTENDANCE", label: "Atendimentos" },
  { key: "EXTENSION_HOURS", label: "Horas" },
];

export default function ProfessorValidacoesPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const [comments, setComments] = useState<Record<string, string>>({});

  const validationsQuery = useQuery({
    queryKey: ["validations", "pending", filter],
    queryFn: () =>
      validationsService.listPending(filter === "ALL" ? undefined : filter),
  });

  const decisionMutation = useMutation({
    mutationFn: ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: Extract<ValidationStatus, "APPROVED" | "REJECTED">;
      comment?: string;
    }) => validationsService.decide(id, { status, comment }),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "APPROVED" ? "Validacao aprovada." : "Validacao rejeitada.",
      );
      setComments((current) => ({ ...current, [variables.id]: "" }));
      void queryClient.invalidateQueries({ queryKey: ["validations"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Nao foi possivel concluir essa validacao."));
    },
  });

  const items = validationsQuery.data ?? [];
  const attendanceItems = items.filter((item) => item.target === "ATTENDANCE");
  const hoursItems = items.filter((item) => item.target === "EXTENSION_HOURS");
  const oldestItem = useMemo(
    () =>
      items
        .slice()
        .sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )[0] ?? null,
    [items],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Validacoes"
        title="Fila de revisao"
        description="Confirme atendimentos e horas extensionistas com mais contexto, menos atrito e uma leitura mais clara do que esta pendente."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Pendencias totais"
          value={String(items.length)}
          help="Itens aguardando uma decisao sua."
          tone={items.length > 0 ? "accent" : "default"}
        />
        <MetricCard
          label="Atendimentos"
          value={String(attendanceItems.length)}
          help="Registros de atendimento esperando aprovacao."
        />
        <MetricCard
          label="Horas"
          value={String(hoursItems.length)}
          help="Lancamentos de horas extensionistas pendentes."
        />
        <MetricCard
          label="Mais antigo"
          value={oldestItem ? formatDate(oldestItem.createdAt).slice(0, 6) : "—"}
          help={oldestItem ? `Criado em ${formatDateTime(oldestItem.createdAt)}` : "Sem pendencia antiga."}
          tone="muted"
        />
      </div>

      <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/88 p-4 shadow-soft md:p-5">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => {
            const count =
              item.key === "ALL"
                ? items.length
                : item.key === "ATTENDANCE"
                  ? attendanceItems.length
                  : hoursItems.length;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className="transition-transform hover:-translate-y-0.5"
              >
                <Pill tone={filter === item.key ? "orange" : "neutral"} size="lg">
                  {item.label} · {count}
                </Pill>
              </button>
            );
          })}
        </div>
      </div>

      {validationsQuery.isLoading ? (
        <div className="space-y-4">
          <div className="h-56 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
          <div className="h-56 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
        </div>
      ) : !items.length ? (
        <EmptyState
          title="Nada aguardando revisao"
          description="Quando alunos registrarem atendimentos ou horas, as pendencias vao aparecer aqui."
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <ValidationQueueCard
              key={item.id}
              item={item}
              comment={comments[item.id] ?? ""}
              busy={decisionMutation.isPending}
              onCommentChange={(value) =>
                setComments((current) => ({ ...current, [item.id]: value }))
              }
              onApprove={() =>
                decisionMutation.mutate({
                  id: item.id,
                  status: "APPROVED",
                  comment: comments[item.id] || undefined,
                })
              }
              onReject={() =>
                decisionMutation.mutate({
                  id: item.id,
                  status: "REJECTED",
                  comment: comments[item.id] || undefined,
                })
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ValidationQueueCard({
  item,
  comment,
  busy,
  onCommentChange,
  onApprove,
  onReject,
}: {
  item: PendingValidation;
  comment: string;
  busy?: boolean;
  onCommentChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isAttendance = item.target === "ATTENDANCE";
  const studentName = isAttendance
    ? item.attendance?.student.fullName
    : item.extensionHours?.student.fullName;

  return (
    <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/92 p-5 shadow-soft md:p-6">
      <div className="grid gap-6 xl:grid-cols-[0.3fr_0.52fr_0.18fr]">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="font-eyebrow text-[var(--brand-orange-deep)]">
              {isAttendance ? "Atendimento" : "Horas extensionistas"}
            </p>
            <h2 className="text-lg font-semibold text-[var(--brand-ink)]">{studentName}</h2>
            <p className="text-xs text-[var(--brand-mute)]">
              Criado em {formatDateTime(item.createdAt)}
            </p>
          </div>

          <div className="space-y-2 rounded-2xl bg-[var(--brand-paper-deep)]/55 p-4 text-sm">
            {isAttendance ? (
              <>
                <InfoRow label="Caso" value={item.attendance?.case.code ?? "—"} mono />
                <InfoRow
                  label="Categoria"
                  value={item.attendance?.case.category ?? "—"}
                />
                <InfoRow
                  label="Quando"
                  value={formatDateTime(item.attendance?.occurredAt)}
                />
                <InfoRow
                  label="Carga"
                  value={`${item.attendance?.durationMin ?? 0} min`}
                />
              </>
            ) : (
              <>
                <InfoRow label="Referencia" value={formatDate(item.extensionHours?.referenceDate)} />
                <InfoRow label="Carga" value={formatHours(item.extensionHours?.hours)} />
                <InfoRow label="Status" value={item.extensionHours?.status ?? "—"} />
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <DetailBlock
            title={isAttendance ? "Resumo do atendimento" : "Atividade registrada"}
            content={
              isAttendance
                ? item.attendance?.summary ?? "Sem resumo registrado."
                : item.extensionHours?.activity ?? "Sem descricao registrada."
            }
          />

          {isAttendance ? (
            <DetailBlock
              title="Proximo passo"
              content={item.attendance?.nextStep ?? "Sem proximo passo informado."}
            />
          ) : null}

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[12.5px] font-semibold text-[var(--brand-night)]">
              <MessageSquareMore className="size-4 text-[var(--brand-orange-deep)]" />
              Observacao da revisao
            </label>
            <Input
              value={comment}
              onChange={(event) => onCommentChange(event.target.value)}
              placeholder="Comente se precisar orientar o aluno."
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2">
          <Button className="w-full justify-center gap-2" disabled={busy} onClick={onApprove}>
            <Check className="size-4" />
            Aprovar
          </Button>
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-rose-200 text-rose-700 hover:bg-rose-50"
            disabled={busy}
            onClick={onReject}
          >
            <X className="size-4" />
            Rejeitar
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--brand-mute)]">{label}</span>
      <span className={mono ? "font-mono font-semibold text-[var(--brand-ink)]" : "font-medium text-[var(--brand-ink)]"}>
        {value}
      </span>
    </div>
  );
}

function DetailBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-2xl bg-[var(--brand-paper-deep)]/35 p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-mute)]">
        {title}
      </p>
      <p className="text-sm leading-6 text-[var(--brand-night)]/85">{content}</p>
    </div>
  );
}
