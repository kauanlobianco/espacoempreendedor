"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, Clock3, ShieldX, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { SectionHeader } from "@/components/feedback/section-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Pill } from "@/components/ui/pill";
import { getErrorMessage } from "@/lib/api/client";
import { formatDateTime, maskCpf } from "@/lib/formatters";
import { usersService } from "@/services/users";

export default function ProfessorAlunosPage() {
  const queryClient = useQueryClient();
  const pendingQuery = useQuery({
    queryKey: ["users", "pending"],
    queryFn: () => usersService.listPending(),
  });
  const studentsQuery = useQuery({
    queryKey: ["users", "students"],
    queryFn: () => usersService.list("STUDENT"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      usersService.setActive(id, active),
    onSuccess: () => {
      toast.success("Cadastro atualizado.");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Nao foi possivel atualizar o cadastro."));
    },
  });

  const pending = pendingQuery.data ?? [];
  const activeStudents = (studentsQuery.data ?? []).filter((student) => student.active);

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Equipe"
        title="Alunos do projeto"
        description="Aprove novos cadastros e acompanhe o historico operacional de cada aluno em um perfil individual."
      />

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeader
            eyebrow="Cadastros pendentes"
            title="Aprovacao de novos alunos"
            description="Libere o primeiro acesso quando os dados estiverem corretos."
          />
          <Pill tone={pending.length > 0 ? "orange" : "neutral"} withDot={pending.length > 0}>
            {pending.length} aguardando
          </Pill>
        </div>

        {pendingQuery.isLoading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="h-56 animate-pulse rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/70" />
            <div className="h-56 animate-pulse rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/70" />
          </div>
        ) : !pending.length ? (
          <EmptyState
            title="Sem cadastros pendentes"
            description="Quando novos alunos se cadastrarem, eles aparecem aqui."
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {pending.map((student) => (
              <div
                key={student.id}
                className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar name={student.fullName} size="lg" tone="orange" />
                    <div className="space-y-1.5">
                      <Eyebrow tone="mute">Aguardando aprovacao</Eyebrow>
                      <h3 className="font-display text-[22px] leading-tight tracking-tight text-[var(--brand-ink)]">
                        {student.fullName}
                      </h3>
                      <p className="text-[13px] text-[var(--brand-mute)]">{student.email}</p>
                    </div>
                  </div>
                  <Pill tone="amber" withDot icon={<Clock3 className="size-3" />}>
                    Novo
                  </Pill>
                </div>

                <dl className="mt-5 grid gap-2.5 rounded-2xl bg-[var(--brand-paper-deep)]/55 p-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--brand-mute)]">Matricula UFF</dt>
                    <dd className="font-semibold text-[var(--brand-ink)]">
                      {student.studentProfile?.enrollment || "Nao informada"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--brand-mute)]">CPF</dt>
                    <dd className="font-mono text-[var(--brand-ink)]">
                      {maskCpf(student.studentProfile?.cpf)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--brand-mute)]">Cadastro enviado em</dt>
                    <dd className="text-[var(--brand-night)]">{formatDateTime(student.createdAt)}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    className="flex-1 gap-2"
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: student.id, active: true })}
                  >
                    <Check className="size-4" />
                    Aprovar cadastro
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ id: student.id, active: false })}
                  >
                    <ShieldX className="size-4" />
                    Manter pendente
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeader
            eyebrow="Acompanhamento"
            title="Perfis dos alunos"
            description="Abra o perfil para ver casos concluidos, carga dedicada e historico de atendimentos."
          />
          <Pill tone="ghost" icon={<UserRoundPlus className="size-3" />}>
            {activeStudents.length} ativos
          </Pill>
        </div>

        {studentsQuery.isLoading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="h-44 animate-pulse rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/70" />
            <div className="h-44 animate-pulse rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white/70" />
          </div>
        ) : !activeStudents.length ? (
          <EmptyState
            title="Sem alunos ativos"
            description="Depois da aprovacao, os alunos aparecem aqui para acompanhamento."
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {activeStudents.map((student) => (
              <Link
                key={student.id}
                href={`/professor/alunos/${student.id}`}
                className="group block rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar name={student.fullName} size="lg" tone="orange" />
                    <div className="space-y-1.5">
                      <Eyebrow tone="mute">Aluno ativo</Eyebrow>
                      <h3 className="font-display text-[22px] leading-tight tracking-tight text-[var(--brand-ink)]">
                        {student.fullName}
                      </h3>
                      <p className="text-[13px] text-[var(--brand-mute)]">{student.email}</p>
                    </div>
                  </div>
                  <Pill tone="green" withDot>
                    Ativo
                  </Pill>
                </div>

                <div className="mt-5 grid gap-2 rounded-2xl bg-[var(--brand-paper-deep)]/55 p-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[var(--brand-mute)]">Matricula</span>
                    <span className="font-semibold text-[var(--brand-ink)]">
                      {student.studentProfile?.enrollment || "Nao informada"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[var(--brand-mute)]">CPF</span>
                    <span className="font-mono text-[var(--brand-ink)]">
                      {maskCpf(student.studentProfile?.cpf)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[var(--brand-orange-deep)]">
                  <span>Ver perfil do aluno</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
