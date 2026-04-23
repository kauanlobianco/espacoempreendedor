"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCheck, CircleAlert, Users2 } from "lucide-react";

import { CaseCard } from "@/components/data-display/case-card";
import { MetricCard } from "@/components/data-display/metric-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { SectionHeader } from "@/components/feedback/section-header";
import { buttonVariants } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";
import { casesService } from "@/services/cases";
import { usersService } from "@/services/users";
import { validationsService } from "@/services/validations";

export default function ProfessorDashboardPage() {
  const casesQuery = useQuery({
    queryKey: ["cases", "dashboard"],
    queryFn: () => casesService.list({ pageSize: 100 }),
  });
  const studentsQuery = useQuery({
    queryKey: ["users", "students"],
    queryFn: () => usersService.list("STUDENT"),
  });
  const validationsQuery = useQuery({
    queryKey: ["validations", "pending", "dashboard"],
    queryFn: () => validationsService.listPending(),
  });

  const caseItems = casesQuery.data?.items ?? [];
  const students = studentsQuery.data ?? [];
  const validations = validationsQuery.data ?? [];

  const activeStudents = students.filter((student) => student.active);
  const openCases = caseItems.filter((item) => !["CLOSED", "CANCELLED"].includes(item.status));
  const concludedCases = caseItems.filter((item) => ["RESOLVED", "CLOSED"].includes(item.status));
  const assignedCases = openCases.filter((item) => item.assignments.some((assignment) => assignment.active));
  const pendingAttendances = validations.filter((item) => item.target === "ATTENDANCE");
  const pendingHours = validations.filter((item) => item.target === "EXTENSION_HOURS");

  const topStudents = useMemo(
    () =>
      activeStudents
        .slice()
        .sort((a, b) => a.fullName.localeCompare(b.fullName))
        .slice(0, 6),
    [activeStudents],
  );

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Visao operacional"
        title="Resumo do professor"
        description="Monitore fila, validacoes e equipe em um painel mais direto para tomada de decisao no dia-a-dia."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Casos abertos"
          value={String(openCases.length)}
          help="Casos ainda ativos no fluxo de atendimento."
        />
        <MetricCard
          label="Com aluno responsavel"
          value={String(assignedCases.length)}
          help="Casos ja assumidos por alguem da equipe."
          tone={assignedCases.length > 0 ? "accent" : "default"}
        />
        <MetricCard
          label="Validacoes pendentes"
          value={String(validations.length)}
          help="Atendimentos e horas esperando decisao."
          tone={validations.length > 0 ? "accent" : "default"}
        />
        <MetricCard
          label="Alunos ativos"
          value={String(activeStudents.length)}
          help="Perfis disponiveis para acompanhar casos."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="rounded-[30px] bg-[var(--brand-ink)] p-7 text-white shadow-lift md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="font-eyebrow text-[var(--brand-orange)]">Semana atual</p>
              <h2 className="font-display text-[36px] leading-[1.02] tracking-tight md:text-[44px]">
                {validations.length > 0
                  ? `${validations.length} pendencias precisam da sua revisao.`
                  : "Fluxo sob controle nesta semana."}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-white/65">
                Priorize primeiro as validacoes pendentes e os casos novos sem responsavel para manter a operacao responsiva.
              </p>
            </div>

            <Link
              href="/professor/validacoes"
              className={cn(buttonVariants({ size: "sm" }), "gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-deep)]")}
            >
              Revisar agora
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Atendimentos</p>
              <p className="mt-2 text-2xl font-semibold text-white">{pendingAttendances.length}</p>
            </div>
            <div className="rounded-2xl bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Horas</p>
              <p className="mt-2 text-2xl font-semibold text-white">{pendingHours.length}</p>
            </div>
            <div className="rounded-2xl bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Casos abertos</p>
              <p className="mt-2 text-2xl font-semibold text-white">{openCases.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-[color:var(--brand-soft-line)] bg-white/88 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-eyebrow text-[var(--brand-mute)]">Equipe</p>
              <h2 className="mt-2 font-display text-[30px] leading-none text-[var(--brand-ink)]">
                Alunos ativos
              </h2>
            </div>
            <Link
              href="/professor/alunos"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-xl border border-[color:var(--brand-soft-line)]")}
            >
              Ver equipe
            </Link>
          </div>

          <div className="mt-5 space-y-2.5">
            {!topStudents.length ? (
              <p className="rounded-2xl bg-[var(--brand-paper-deep)]/60 px-4 py-5 text-sm text-[var(--brand-mute)]">
                Ainda nao ha alunos ativos aprovados.
              </p>
            ) : (
              topStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--brand-paper-deep)]/55 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[var(--brand-orange-deep)]">
                      {student.fullName
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--brand-ink)]">{student.fullName}</p>
                      <p className="text-xs text-[var(--brand-mute)]">{student.email}</p>
                    </div>
                  </div>
                  <Pill tone="green" size="sm">
                    Ativo
                  </Pill>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader
              eyebrow="Casos recentes"
              title="Fila operacional"
              description="Os itens mais recentes e com prioridade sob sua supervisao."
            />
            <Link
              href="/professor/alunos"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0 gap-1 rounded-xl border border-[color:var(--brand-soft-line)]")}
            >
              Ver alunos
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {casesQuery.isLoading ? (
            <div className="h-64 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
          ) : caseItems.length === 0 ? (
            <EmptyState
              title="Sem casos"
              description="Quando houver demandas registradas, elas vao aparecer aqui."
            />
          ) : (
            <div className="grid gap-3">
              {caseItems.slice(0, 4).map((item) => (
                <CaseCard key={item.id} item={item} href={`/professor/casos/${item.id}`} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <SectionHeader
            eyebrow="Pendencias"
            title="O que destravar agora"
            description="Acoes mais importantes para manter o acompanhamento em dia."
          />

          <div className="space-y-3 rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/88 p-5 shadow-soft">
            <div className="rounded-2xl bg-[var(--brand-paper-deep)]/55 p-4">
              <div className="flex items-center gap-2">
                <CircleAlert className="size-4 text-[var(--brand-orange-deep)]" />
                <p className="text-sm font-semibold text-[var(--brand-ink)]">Validacoes aguardando</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-mute)]">
                {validations.length > 0
                  ? `${validations.length} itens pendentes, sendo ${pendingAttendances.length} atendimentos e ${pendingHours.length} lancamentos de horas.`
                  : "Nao ha validacoes pendentes no momento."}
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--brand-paper-deep)]/55 p-4">
              <div className="flex items-center gap-2">
                <Users2 className="size-4 text-[var(--brand-orange-deep)]" />
                <p className="text-sm font-semibold text-[var(--brand-ink)]">Carteira atual</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-mute)]">
                {openCases.length} casos seguem ativos e {concludedCases.length} foram resolvidos ou fechados no ciclo atual.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--brand-paper-deep)]/55 p-4">
              <div className="flex items-center gap-2">
                <CheckCheck className="size-4 text-[var(--brand-orange-deep)]" />
                <p className="text-sm font-semibold text-[var(--brand-ink)]">Proxima acao sugerida</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-mute)]">
                Revise primeiro as validacoes mais antigas e depois acompanhe os casos novos ainda sem aluno responsavel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
