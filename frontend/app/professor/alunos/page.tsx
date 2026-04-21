"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api/client";
import { formatDateTime, maskCpf } from "@/lib/formatters";
import { usersService } from "@/services/users";
import { cn } from "@/lib/utils";

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
    mutationFn: ({ id, active }: { id: string; active: boolean }) => usersService.setActive(id, active),
    onSuccess: () => {
      toast.success("Cadastro atualizado.");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Nao foi possivel atualizar o cadastro."));
    },
  });

  const activeStudents = (studentsQuery.data ?? []).filter((student) => student.active);

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Equipe"
        title="Alunos do projeto"
        description="Aprove novos cadastros e acompanhe o historico operacional de cada aluno em um perfil individual."
      />

      <div className="space-y-4">
        <PageHeader
          eyebrow="Cadastros pendentes"
          title="Aprovacao de novos alunos"
          description="Libere o primeiro acesso quando os dados estiverem corretos."
        />

        {pendingQuery.isLoading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="h-56 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
            <div className="h-56 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
          </div>
        ) : !pendingQuery.data?.length ? (
          <EmptyState
            title="Sem cadastros pendentes"
            description="Quando novos alunos se cadastrarem, eles aparecem aqui."
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {pendingQuery.data.map((student) => (
              <Card key={student.id} className="border-brand-line bg-white/90 shadow-soft">
                <CardContent className="space-y-4 p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-night/70">
                      Aguardando aprovacao
                    </p>
                    <h2 className="text-xl font-semibold text-brand-ink">{student.fullName}</h2>
                  </div>

                  <div className="grid gap-2 text-sm leading-6 text-brand-night/85">
                    <p>E-mail: {student.email}</p>
                    <p>Matricula: {student.studentProfile?.enrollment || "Nao informada"}</p>
                    <p>CPF: {maskCpf(student.studentProfile?.cpf)}</p>
                    <p>Cadastro enviado em {formatDateTime(student.createdAt)}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: student.id, active: true })}
                    >
                      Aprovar cadastro
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: student.id, active: false })}
                    >
                      Manter pendente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <PageHeader
          eyebrow="Acompanhamento"
          title="Perfis dos alunos"
          description="Abra o perfil para ver casos concluidos, carga dedicada e historico de atendimentos."
        />

        {studentsQuery.isLoading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="h-44 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
            <div className="h-44 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
          </div>
        ) : !activeStudents.length ? (
          <EmptyState
            title="Sem alunos ativos"
            description="Depois da aprovacao, os alunos aparecem aqui para acompanhamento."
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {activeStudents.map((student) => (
              <Card key={student.id} className="border-brand-line bg-white/90 shadow-soft">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-night/70">
                        Aluno ativo
                      </p>
                      <h2 className="text-xl font-semibold text-brand-ink">{student.fullName}</h2>
                    </div>
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-emerald-500" />
                  </div>

                  <div className="grid gap-2 text-sm leading-6 text-brand-night/85">
                    <p>E-mail: {student.email}</p>
                    <p>Matricula: {student.studentProfile?.enrollment || "Nao informada"}</p>
                    <p>CPF: {maskCpf(student.studentProfile?.cpf)}</p>
                  </div>

                  <Link
                    href={`/professor/alunos/${student.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "justify-between rounded-xl border border-brand-line/60")}
                  >
                    Ver perfil do aluno
                    <ArrowRight className="size-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
