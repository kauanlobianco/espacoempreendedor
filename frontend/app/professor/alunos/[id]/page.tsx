"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock3, FileText, FolderKanban, Mail, Phone, UserRound } from "lucide-react";

import { CaseStatusBadge } from "@/components/data-display/case-status-badge";
import { MetricCard } from "@/components/data-display/metric-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { SectionHeader } from "@/components/feedback/section-header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      ? `Fluxo saiu de ${STATUS_LABEL[metadata.from]} para ${metadata.to ? STATUS_LABEL[metadata.to] : "um novo status"}.`
      : "O caso recebeu uma atualizacao de andamento.",
    note: metadata.note,
  };
}

function AttendanceItem({ attendance }: { attendance: StudentPerformanceAttendanceItem }) {
  return (
    <div className="rounded-2xl bg-brand-paper/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-ink">
          {PREFERRED_CHANNEL_LABEL[attendance.channel]}
        </p>
        <p className="text-xs text-muted-foreground">{formatDateTime(attendance.occurredAt)}</p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-brand-night/75">
        <span className="rounded-full bg-white px-2.5 py-1">{attendance.durationMin} min</span>
        <span className="rounded-full bg-white px-2.5 py-1">
          {attendance.nextStep || "Sem proximo passo"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-brand-night/80">{attendance.summary}</p>
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
        <div className="h-28 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-32 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          <div className="h-32 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          <div className="h-32 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          <div className="h-32 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
        </div>
        <div className="h-80 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
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

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <PageHeader
          eyebrow="Perfil do aluno"
          title={student.fullName}
          description="Veja o volume de casos, o tempo dedicado e todo o historico operacional deste aluno."
        />

        <Card className="border-brand-line bg-white/90 shadow-soft">
          <CardContent className="grid gap-3 p-6 text-sm leading-6 text-brand-night/85 sm:grid-cols-2">
            <div className="rounded-2xl bg-brand-paper/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-brand-ink">
                <Mail className="size-4 text-brand-orange" />
                <span className="font-semibold">E-mail</span>
              </div>
              <p>{student.email}</p>
            </div>
            <div className="rounded-2xl bg-brand-paper/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-brand-ink">
                <UserRound className="size-4 text-brand-orange" />
                <span className="font-semibold">Matricula UFF</span>
              </div>
              <p>{student.studentProfile?.enrollment || "Nao informada"}</p>
            </div>
            <div className="rounded-2xl bg-brand-paper/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-brand-ink">
                <FileText className="size-4 text-brand-orange" />
                <span className="font-semibold">CPF</span>
              </div>
              <p>{maskCpf(student.studentProfile?.cpf)}</p>
            </div>
            <div className="rounded-2xl bg-brand-paper/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-brand-ink">
                <Clock3 className="size-4 text-brand-orange" />
                <span className="font-semibold">Desde</span>
              </div>
              <p>{formatDate(student.createdAt)}</p>
            </div>
          </CardContent>
        </Card>
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
          accent={stats.openCases > 0}
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
              <Card key={item.id} className="border-brand-line bg-white/90 shadow-soft">
                <CardContent className="space-y-6 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-night">
                          {item.code}
                        </span>
                        <CaseStatusBadge status={item.status} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-brand-ink">
                          {CATEGORY_LABEL[item.category]}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Solicitante: {item.request.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Contato: {item.request.phone}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/professor/casos/${item.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "rounded-xl border border-brand-line/60",
                      )}
                    >
                      Abrir caso
                    </Link>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-brand-paper/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                        Inicio no aluno
                      </p>
                      <p className="mt-2 text-sm font-medium text-brand-ink">
                        {formatDateTime(item.assignedAt)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-brand-paper/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                        Fechamento
                      </p>
                      <p className="mt-2 text-sm font-medium text-brand-ink">
                        {formatDateTime(item.closedAt)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-brand-paper/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                        Atendimentos
                      </p>
                      <p className="mt-2 text-sm font-medium text-brand-ink">
                        {item.totalAttendances} registro(s)
                      </p>
                    </div>
                    <div className="rounded-2xl bg-brand-paper/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                        Tempo dedicado
                      </p>
                      <p className="mt-2 text-sm font-medium text-brand-ink">
                        {formatDurationLabel(item.totalMinutes)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="size-4 text-brand-orange" />
                        <h3 className="text-base font-semibold text-brand-ink">
                          Etapas do caso
                        </h3>
                      </div>

                      {!item.history.length ? (
                        <div className="rounded-2xl bg-brand-paper/60 p-4 text-sm text-muted-foreground">
                          Ainda nao ha etapas registradas para este caso.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {item.history.map((historyItem) => {
                            const copy = describeHistoryItem(historyItem);

                            return (
                              <div key={historyItem.id} className="rounded-2xl bg-brand-paper/70 p-4">
                                <p className="text-sm font-semibold text-brand-ink">{copy.title}</p>
                                <p className="mt-1 text-sm leading-6 text-brand-night/80">
                                  {copy.description}
                                </p>
                                {copy.note ? (
                                  <p className="mt-2 text-sm leading-6 text-brand-night/75">
                                    Observacao: {copy.note}
                                  </p>
                                ) : null}
                                <p className="mt-3 text-xs text-muted-foreground">
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
                        <Phone className="size-4 text-brand-orange" />
                        <h3 className="text-base font-semibold text-brand-ink">
                          Atendimentos realizados
                        </h3>
                      </div>

                      {!item.attendances.length ? (
                        <div className="rounded-2xl bg-brand-paper/60 p-4 text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
