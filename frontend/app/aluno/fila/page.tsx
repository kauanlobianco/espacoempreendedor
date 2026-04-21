"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search } from "lucide-react";

import { CaseCard } from "@/components/data-display/case-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { casesService } from "@/services/cases";

export default function StudentQueuePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

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
      toast.error(getErrorMessage(error, "Não foi possível assumir esse caso."));
    },
  });

  const items =
    queueQuery.data?.items.filter((item) => {
      const inQueue = item.status === "NEW" || item.status === "TRIAGED";
      const matchesSearch =
        !deferredSearch ||
        item.code.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        item.request.fullName.toLowerCase().includes(deferredSearch.toLowerCase());
      return inQueue && matchesSearch;
    }) ?? [];

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Fila de atendimento"
        title="Casos disponíveis"
        description="Visualize a fila, encontre o caso certo e assuma quando fizer sentido."
      />

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nome ou código"
          className="pl-9"
        />
      </div>

      {queueQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-52 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          <div className="h-52 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Fila vazia"
          description="Não há casos novos ou triados com esse filtro agora."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="space-y-2.5">
              <CaseCard item={item} href={`/aluno/casos/${item.id}`} actionLabel="Ver detalhes" />
              <Button
                className="w-full"
                onClick={() => assignMutation.mutate(item.id)}
                disabled={assignMutation.isPending}
              >
                Assumir este caso
              </Button>
            </div>
          ))}
        </div>
      )}

      <Callout tone="info">
        Depois de assumir, o caso aparece em{" "}
        <Link href="/aluno/meus-casos" className="font-semibold underline underline-offset-2">
          Meus casos
        </Link>
        .
      </Callout>
    </section>
  );
}
