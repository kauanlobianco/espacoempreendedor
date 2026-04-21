"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { CaseCard } from "@/components/data-display/case-card";
import { MetricCard } from "@/components/data-display/metric-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { SectionHeader } from "@/components/feedback/section-header";
import { buttonVariants } from "@/components/ui/button";
import { casesService } from "@/services/cases";
import { usersService } from "@/services/users";
import { cn } from "@/lib/utils";

export default function ProfessorDashboardPage() {
  const casesQuery = useQuery({
    queryKey: ["cases", "dashboard"],
    queryFn: () => casesService.list({ pageSize: 100 }),
  });
  const studentsQuery = useQuery({
    queryKey: ["users", "students"],
    queryFn: () => usersService.list("STUDENT"),
  });

  const caseItems = casesQuery.data?.items ?? [];
  const openCases = caseItems.filter((item) => !["CLOSED", "CANCELLED"].includes(item.status)).length;
  const activeStudents = studentsQuery.data?.filter((student) => student.active).length ?? 0;
  const concludedCases = caseItems.filter((item) => ["RESOLVED", "CLOSED"].includes(item.status)).length;
  const assignedCases = caseItems.filter((item) =>
    item.assignments.some((assignment) => assignment.active),
  ).length;

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Visao operacional"
        title="Resumo do professor"
        description="Acompanhe o volume de casos, quem ja esta atendendo e como os alunos estao evoluindo."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Casos abertos"
          value={String(openCases)}
          help="Total de casos ainda ativos no fluxo."
        />
        <MetricCard
          label="Com aluno responsavel"
          value={String(assignedCases)}
          help="Casos que ja contam com atendimento assumido."
          accent={assignedCases > 0}
        />
        <MetricCard
          label="Casos concluidos"
          value={String(concludedCases)}
          help="Casos ja encerrados ou resolvidos no ciclo."
        />
        <MetricCard
          label="Alunos ativos"
          value={String(activeStudents)}
          help="Perfis disponiveis para acompanhar atendimentos."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader eyebrow="Casos recentes" title="Fila operacional" />
            <Link
              href="/professor/alunos"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0 gap-1")}
            >
              Ver alunos
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {casesQuery.isLoading ? (
            <div className="h-64 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          ) : caseItems.length === 0 ? (
            <EmptyState
              title="Sem casos"
              description="Quando o backend tiver casos cadastrados, eles aparecem aqui."
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
          <SectionHeader eyebrow="Equipe" title="Alunos cadastrados" />
          <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-4">
            {studentsQuery.isLoading ? (
              <div className="h-32 animate-pulse rounded-xl bg-brand-paper/60" />
            ) : (studentsQuery.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {(studentsQuery.data ?? []).slice(0, 8).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 odd:bg-brand-paper/50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">{student.fullName}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                    {student.active ? (
                      <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                    ) : (
                      <span className="size-2 shrink-0 rounded-full bg-zinc-300" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
