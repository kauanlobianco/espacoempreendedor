"use client";

import { useDeferredValue, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { CaseCard } from "@/components/data-display/case-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { casesService } from "@/services/cases";

export default function MyCasesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const casesQuery = useQuery({
    queryKey: ["cases", "mine", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => casesService.list({ assigneeId: user!.id, pageSize: 50 }),
  });

  const items =
    casesQuery.data?.items.filter((item) => {
      if (!deferredSearch) return true;
      return (
        item.code.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        item.request.fullName.toLowerCase().includes(deferredSearch.toLowerCase())
      );
    }) ?? [];

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Rotina do aluno"
        title="Meus casos"
        description="Acompanhe os casos que já estão com você e avance com atendimento, observações e status."
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

      {casesQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-52 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          <div className="h-52 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhum caso assumido"
          description="Assuma um caso na fila para começar a operar sua carteira."
          primaryHref="/aluno/fila"
          primaryLabel="Ver fila"
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <CaseCard key={item.id} item={item} href={`/aluno/casos/${item.id}`} />
          ))}
        </div>
      )}
    </section>
  );
}
