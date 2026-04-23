"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock3,
  FileText,
  FolderKanban,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { CaseStatusBadge } from "@/components/data-display/case-status-badge";
import { MetricCard } from "@/components/data-display/metric-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { SectionHeader } from "@/components/feedback/section-header";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Pill } from "@/components/ui/pill";
import { CATEGORY_LABEL, PREFERRED_CHANNEL_LABEL, STATUS_LABEL } from "@/lib/constants/domain";
import { formatDate, formatDateTime, formatHours, maskCpf } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { usersService } from "@/services/users";
import type {
  CaseStatus,
  StudentPerformanceAttendanceItem,
  StudentPerformanceCaseHistoryItem,
} from "@/types/api";

function formatDurationLabel(totalMinutes: number) {
  if (!totalMinutes) return "0 min";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!hours) return `${minutes} min`;
  if (!minutes) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function describeHistoryItem(item: StudentPerformanceCaseHistoryItem) {
  if (item.action === "CASE_ASSIGNED") {
    return {
      title: "Caso assumido pelo aluno",
      description: "O atendimento passou a fazer parte da fila de trabalho deste aluno.",
    };
  }

  const metadata = (item.metadata ?? {}) as {
    from?: CaseStatus;
    to?: CaseStatus;
    note?: string;
  };

  return {
    title: metadata.to
      ? `Status alterado para ${STATUS_LABEL[metadata.to]}`
      : "Status atualizado no caso",
    description: metadata.from
      ? `Fluxo saiu de ${STATUS_LABEL[metadata.from]} para ${
          metadata.to ? STATUS_LABEL[metadata.to] : "um novo status"
        }.`
      : "O caso recebeu uma atualizacao de andamento.",
    note: metadata.note,
  };
}

function AttendanceItem({ attendance }: { attendance: StudentPerformanceAttendanceItem }) {
  return (
    <div className="rounded-2xl border border-[color:var(--brand-soft-line)] bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--brand-ink)]">
          {PREFERRED_CHANNEL_LABEL[attendance.channel]}
        </p>
        <p className="text-xs text-[var(--brand-mute)]">{formatDateTime(attendance.occurredAt)}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <Pill tone="orange" size="sm">
          {attendance.durationMin} min
        </Pill>
        <Pill tone="neutral" size="sm">
          {attendance.nextStep || "Sem proximo passo"}
        </Pill>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--brand-night)]">{attendance.summary}</p>
    </div>
  );
}

export default function ProfessorAlunoProfilePage() {
  const params = useParams<{ id: string }>();
  const studentId = Array.isArray(params.id) ? params.id[0] : params.id;

  const performanceQuery = useQuery({
    queryKey: ["users", "performance", studentId],
    queryFn: () => usersService.performance(studentId as string),
    enabled: Boolean(studentId),
  });

  if (performanceQuery.isLoading) {
    return (
      <section className="space-y-6">
        <div className="h-28 animate-pulse rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/70" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-32 animate-pulse rounded-2xl border border-[color:var(--brand-soft-line)] bg-white/70" />
          <div className="h-32 animate-pulse rounded-2xl border border-[color:var(--brand-soft-line)] bg-white/70" />
          <div className="h-32 animate-pulse rounded-2xl border border-[color:var(--brand-soft-line)] bg-white/70" />
          <div className="h-32 animate-pulse rounded-2xl border border-[color:var(--brand-soft-line)] bg-white/70" />
        </div>
        <div className="h-80 animate-pulse rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/70" />
      </section>
    );
  }

  if (performanceQuery.isError || !performanceQuery.data) {
    return (
      <section className="space-y-6">
        <Link
          href="/professor/alunos"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-fit gap-2")}
        >
          <ArrowLeft className="size-4" />
          Voltar para alunos
        </Link>
        <EmptyState
          title="Perfil indisponivel"
          description="Nao foi possivel carregar este aluno agora. Tente novamente em instantes."
        />
      </section>
    );
  }

  const { student, stats, cases } = performanceQuery.data;

  return (
    <section className="space-y-8">
      <Link
        href="/professor/alunos"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-fit gap-2")}
      >
        <ArrowLeft className="size-4" />
        Voltar para alunos
      </Link>

      <div className="rounded-[32px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
          <div className="flex items-start gap-5">
            <Avatar name={student.fullName} size="xl" tone="orange" />
            <div className="space-y-3">
              <Eyebrow>Perfil do aluno</Eyebrow>
              <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.03em] text-[var(--brand-ink)] md:text-[48px]">
                {student.fullName}
              </h1>
              <p className="max-w-xl text-[14.5px] leading-relaxed text-[var(--brand-mute)]">
                Veja o volume de casos, o tempo dedicado e todo o historico operacional deste aluno.
              </p>
              {student.active ? (
                <Pill tone="green" withDot>
                  Aluno ativo
                </Pill>
              ) : (
                <Pill tone="amber" withDot>
                  Inativo
                </Pill>
              )}
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <InfoTile icon={<Mail className="size-4" />} label="E-mail" value={student.email} />
            <InfoTile
              icon={<UserRound className="size-4" />}
              label="Matricula UFF"
              value={student.studentProfile?.enrollment || "Nao informada"}
            />
            <InfoTile
              icon={<FileText className="size-4" />}
              label="CPF"
              value={maskCpf(student.studentProfile?.cpf)}
              mono
            />
            <InfoTile
              icon={<Clock3 className="size-4" />}
              label="Desde"
              value={formatDate(student.createdAt)}
            />
          </dl>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Casos concluidos"
          value={String(stats.concludedCases)}
          help="Atendimentos encerrados ou resolvidos por este aluno."
        />
        <MetricCard
          label="Casos em andamento"
          value={String(stats.openCases)}
          help="Casos que ainda seguem ativos no fluxo."
          tone={stats.openCases > 0 ? "accent" : "default"}
        />
        <MetricCard
          label="Horas dedicadas"
          value={formatHours(stats.totalHours)}
          help={`${formatDurationLabel(stats.totalMinutes)} somados em atendimentos registrados.`}
        />
        <MetricCard
          label="Total de casos"
          value={String(stats.totalCases)}
          help="Quantidade total de casos que passaram por este perfil."
        />
      </div>

      <div className="space-y-4">
        <SectionHeader
          eyebrow="Historico de atendimento"
          title="Casos do aluno"
          description="Cada bloco mostra o andamento do caso, os atendimentos feitos e as mudancas de etapa registradas."
        />

        {!cases.length ? (
          <EmptyState
            title="Sem casos ainda"
            description="Quando este aluno assumir ou concluir atendimentos, o historico aparece aqui."
          />
        ) : (
          <div className="space-y-5">
            {cases.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-7"
              >
                <div className="space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[var(--brand-paper-deep)] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-night)]">
                          {item.code}
                        </span>
                        <CaseStatusBadge status={item.status} />
                      </div>
                      <h2 className="font-display text-[24px] leading-tight tracking-tight text-[var(--brand-ink)]">
                        {CATEGORY_LABEL[item.category]}
                      </h2>
                      <p className="text-sm text-[var(--brand-mute)]">
                        Solicitante: {item.request.fullName} · {item.request.phone}
                      </p>
                    </div>

                    <Link
                      href={`/professor/casos/${item.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      Abrir caso
                    </Link>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <StatTile label="Inicio no aluno" value={formatDateTime(item.assignedAt)} />
                    <StatTile label="Fechamento" value={formatDateTime(item.closedAt)} />
                    <StatTile
                      label="Atendimentos"
                      value={`${item.totalAttendances} registro(s)`}
                    />
                    <StatTile
                      label="Tempo dedicado"
                      value={formatDurationLabel(item.totalMinutes)}
                      accent
                    />
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="size-4 text-[var(--brand-orange-deep)]" />
                        <h3 className="font-display text-[18px] tracking-tight text-[var(--brand-ink)]">
                          Etapas do caso
                        </h3>
                      </div>

                      {!item.history.length ? (
                        <div className="rounded-2xl border border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/55 p-4 text-sm text-[var(--brand-mute)]">
                          Ainda nao ha etapas registradas para este caso.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {item.history.map((historyItem) => {
                            const copy = describeHistoryItem(historyItem);
                            return (
                              <div
                                key={historyItem.id}
                                className="rounded-2xl border border-[color:var(--brand-soft-line)] bg-white p-4 shadow-soft"
                              >
                                <p className="text-sm font-semibold text-[var(--brand-ink)]">
                                  {copy.title}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-[var(--brand-night)]">
                                  {copy.description}
                                </p>
                                {copy.note ? (
                                  <p className="mt-2 text-sm leading-6 text-[var(--brand-mute)]">
                                    Observacao: {copy.note}
                                  </p>
                                ) : null}
                                <p className="mt-3 text-xs text-[var(--brand-mute)]">
                                  {formatDateTime(historyItem.createdAt)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="size-4 text-[var(--brand-orange-deep)]" />
                        <h3 className="font-display text-[18px] tracking-tight text-[var(--brand-ink)]">
                          Atendimentos realizados
                        </h3>
                      </div>

                      {!item.attendances.length ? (
                        <div className="rounded-2xl border border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/55 p-4 text-sm text-[var(--brand-mute)]">
                          Este caso ainda nao tem atendimentos registrados por este aluno.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {item.attendances.map((attendance) => (
                            <AttendanceItem key={attendance.id} attendance={attendance} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoTile({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/45 p-4">
      <div className="flex items-center gap-2 text-[var(--brand-orange-deep)]">
        {icon}
        <p className="font-eyebrow text-[var(--brand-mute)]">{label}</p>
      </div>
      <p
        className={cn(
          "mt-2 text-sm leading-6 text-[var(--brand-ink)]",
          mono && "font-mono",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        accent
          ? "border-[color:rgba(232,93,31,0.24)] bg-[var(--brand-orange-ghost)]"
          : "border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/55",
      )}
    >
      <p className="font-eyebrow text-[var(--brand-mute)]">{label}</p>
      <p className="mt-2 font-display text-[22px] leading-none tracking-tight text-[var(--brand-ink)]">
        {value}
      </p>
    </div>
  );
}
