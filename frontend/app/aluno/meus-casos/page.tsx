"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { StudentCaseRow } from "@/components/data-display/student-case-row";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { casesService } from "@/services/cases";

type FilterKey = "OPEN" | "ACTION" | "FOLLOW_UP" | "DONE";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "OPEN", label: "Em aberto" },
  { key: "ACTION", label: "Precisa de acao" },
  { key: "FOLLOW_UP", label: "Aguardando retorno" },
  { key: "DONE", label: "Fechados" },
];

function averageDays(items: Array<{ createdAt: string; closedAt: string | null; updatedAt: string }>) {
  const concluded = items.filter((item) => item.closedAt || item.updatedAt);
  if (concluded.length === 0) return "—";

  const total = concluded.reduce((sum, item) => {
    const end = new Date(item.closedAt ?? item.updatedAt).getTime();
    const start = new Date(item.createdAt).getTime();
    return sum + (end - start);
  }, 0);

  const days = total / concluded.length / (1000 * 60 * 60 * 24);
  return `${days.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}d`;
}

export default function MyCasesPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterKey>("OPEN");

  const casesQuery = useQuery({
    queryKey: ["cases", "mine", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => casesService.list({ assigneeId: user!.id, pageSize: 50 }),
  });

  const items = casesQuery.data?.items ?? [];
  const openCases = items.filter((item) => !["CLOSED", "CANCELLED", "RESOLVED"].includes(item.status));
  const waitingCases = items.filter((item) =>
    ["WAITING_USER", "WAITING_SUPERVISION"].includes(item.status),
  );
  const actionCases = items.filter((item) =>
    ["ASSIGNED", "IN_PROGRESS", "TRIAGED"].includes(item.status),
  );
  const doneCases = items.filter((item) =>
    ["RESOLVED", "CLOSED", "CANCELLED"].includes(item.status),
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const concludedThisMonth = doneCases.filter((item) => {
    const date = new Date(item.closedAt ?? item.updatedAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter === "OPEN") return !["RESOLVED", "CLOSED", "CANCELLED"].includes(item.status);
      if (filter === "ACTION") return ["ASSIGNED", "IN_PROGRESS", "TRIAGED"].includes(item.status);
      if (filter === "FOLLOW_UP") return ["WAITING_USER", "WAITING_SUPERVISION"].includes(item.status);
      return ["RESOLVED", "CLOSED", "CANCELLED"].includes(item.status);
    });
  }, [filter, items]);

  return (
    <section className="space-y-5">
      <PageHeader
        eyebrow="Area do aluno"
        title="Meus casos"
        description="Organize sua carteira, identifique retornos pendentes e avance cada caso com clareza operacional."
        actions={
          <Link
            href="/aluno/fila"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Nova acao
          </Link>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <CompactMetric
          label="Em aberto"
          value={String(openCases.length)}
          detail={actionCases.length > 0 ? `+${actionCases.length} pedem acao` : "Carteira sob controle"}
          detailTone={actionCases.length > 0 ? "orange" : "neutral"}
        />
        <CompactMetric
          label="Aguardando retorno"
          value={String(waitingCases.length)}
          detail={waitingCases.length > 0 ? "Casos em pausa externa" : "Sem fila de retorno"}
        />
        <CompactMetric
          label="Encerrados no mes"
          value={String(concludedThisMonth)}
          detail={`${doneCases.length} no historico`}
        />
        <CompactMetric
          label="Tempo medio"
          value={averageDays(doneCases)}
          detail="Entre abertura e fechamento"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[2rem] leading-none tracking-[-0.03em] text-[var(--brand-ink)]">
            Casos sob sua responsabilidade
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => {
            const count =
              item.key === "OPEN"
                ? openCases.length
                : item.key === "ACTION"
                  ? actionCases.length
                  : item.key === "FOLLOW_UP"
                    ? waitingCases.length
                    : doneCases.length;

            return (
              <button key={item.key} type="button" onClick={() => setFilter(item.key)}>
                <Pill
                  tone={filter === item.key ? "orange" : "neutral"}
                  size="lg"
                  withDot={item.key === "ACTION"}
                >
                  {item.label} · {count}
                </Pill>
              </button>
            );
          })}
        </div>
      </div>

      {casesQuery.isLoading ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-[24px] border border-brand-line bg-white/70" />
          <div className="h-24 animate-pulse rounded-[24px] border border-brand-line bg-white/70" />
          <div className="h-24 animate-pulse rounded-[24px] border border-brand-line bg-white/70" />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="Nenhum caso encontrado"
          description="Assuma um caso na fila ou ajuste os filtros para revisar sua carteira."
          primaryHref="/aluno/fila"
          primaryLabel="Ver fila"
        />
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <StudentCaseRow
              key={item.id}
              item={item}
              href={`/aluno/casos/${item.id}`}
              extraMeta="Voce"
              highlight={["WAITING_USER", "IN_PROGRESS"].includes(item.status)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CompactMetric({
  label,
  value,
  detail,
  detailTone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  detailTone?: "neutral" | "orange";
}) {
  return (
    <div className="rounded-[20px] border border-[color:var(--brand-soft-line)] bg-white px-5 py-4 shadow-soft">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-mute)]">
        {label}
      </p>
      <div className="mt-3 flex items-end gap-2">
        <p className="font-display text-[2.35rem] leading-none tracking-[-0.04em] text-[var(--brand-ink)]">
          {value}
        </p>
        <Pill tone={detailTone === "orange" ? "orange" : "neutral"} size="sm">
          {detail}
        </Pill>
      </div>
    </div>
  );
}
