"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Funnel, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { StudentCaseRow } from "@/components/data-display/student-case-row";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { casesService } from "@/services/cases";

type FilterKey = "ALL" | "NEW" | "TRIAGED";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "ALL", label: "Todos" },
  { key: "NEW", label: "Novos" },
  { key: "TRIAGED", label: "Triados" },
];

export default function StudentQueuePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterKey>("ALL");

  const queueQuery = useQuery({
    queryKey: ["cases", "queue"],
    queryFn: () => casesService.list({ pageSize: 50 }),
  });

  const assignMutation = useMutation({
    mutationFn: (caseId: string) => casesService.assign(caseId, user!.id),
    onSuccess: () => {
      toast.success("Caso assumido com sucesso.");
      void queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Nao foi possivel assumir esse caso."));
    },
  });

  const queueItems = useMemo(
    () =>
      (queueQuery.data?.items ?? []).filter(
        (item) => item.status === "NEW" || item.status === "TRIAGED",
      ),
    [queueQuery.data?.items],
  );

  const newCount = queueItems.filter((item) => item.status === "NEW").length;
  const triagedCount = queueItems.filter((item) => item.status === "TRIAGED").length;

  const filteredItems = useMemo(() => {
    return queueItems.filter((item) => {
      if (filter === "ALL") return true;
      if (filter === "NEW") return item.status === "NEW";
      return item.status === "TRIAGED";
    });
  }, [filter, queueItems]);

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Quem pode atender"
        title={`${queueItems.length} pedidos aguardando atendimento`}
        description="Escolha um caso compativel com sua carga e avance a fila com clareza de acompanhamento."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2">
              <Funnel className="size-3.5" />
              Filtros
            </Button>
            <Link
              href="/aluno/meus-casos"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Minha fila
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const count =
            item.key === "ALL"
              ? queueItems.length
              : item.key === "NEW"
                  ? newCount
                  : triagedCount;

          return (
            <button key={item.key} type="button" onClick={() => setFilter(item.key)}>
              <Pill
                tone={filter === item.key ? "orange" : "neutral"}
                size="lg"
                withDot={item.key === "NEW"}
              >
                {item.label} · {count}
              </Pill>
            </button>
          );
        })}
      </div>

      {queueQuery.isLoading ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-[24px] border border-brand-line bg-white/70" />
          <div className="h-24 animate-pulse rounded-[24px] border border-brand-line bg-white/70" />
          <div className="h-24 animate-pulse rounded-[24px] border border-brand-line bg-white/70" />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="Nada disponivel na fila"
          description="Quando novos pedidos entrarem ou a triagem liberar mais casos, eles aparecem aqui."
        />
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            return (
              <StudentCaseRow
                key={item.id}
                item={item}
                href={`/aluno/casos/${item.id}`}
                action={
                  <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end">
                    <Link
                      href={`/aluno/casos/${item.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "min-w-[104px] justify-between",
                      )}
                    >
                      Abrir
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="min-w-[104px] justify-between"
                      onClick={() => assignMutation.mutate(item.id)}
                      disabled={assignMutation.isPending}
                    >
                      Assumir
                      <Sparkles className="size-3.5" />
                    </Button>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
