"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, Plus } from "lucide-react";

import { PageHeader } from "@/components/feedback/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { extensionReportsService } from "@/services/extension-reports";
import { STATUS_LABEL, STATUS_TONE } from "@/features/extension-reports/status";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function StudentReportsListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["extension-reports", "mine"],
    queryFn: () => extensionReportsService.listMine(),
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          eyebrow="Extensão"
          title="Relatórios de horas extensionistas"
          description="Gere, acompanhe e baixe seus relatórios institucionais de atendimentos do Espaço Empreendedor."
        />
        <Link
          href="/aluno/relatorio-extensao/novo"
          className={cn(buttonVariants(), "gap-2")}
        >
          <Plus className="size-4" /> Novo relatório
        </Link>
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
      ) : !data?.length ? (
        <EmptyState
          title="Nenhum relatório ainda"
          description="Selecione casos concluídos e gere seu primeiro relatório institucional."
          primaryHref="/aluno/relatorio-extensao/novo"
          primaryLabel="Gerar relatório"
        />
      ) : (
        <ul className="space-y-3">
          {data.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-brand-line bg-white/80 p-5 transition hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-brand-orange" />
                    <span className="font-semibold text-brand-ink">{r.code}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        STATUS_TONE[r.status],
                      )}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {r.totalHours.toFixed(2)}h •{" "}
                    {r.periodStart && r.periodEnd
                      ? `${formatDate(r.periodStart)} – ${formatDate(r.periodEnd)}`
                      : "Período não definido"}
                  </p>
                  {r.reviewerNote && r.status === "RETURNED" ? (
                    <p className="text-sm text-rose-700">
                      <strong>Observação:</strong> {r.reviewerNote}
                    </p>
                  ) : null}
                </div>
                <Link
                  href={`/aluno/relatorio-extensao/${r.id}`}
                  className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
                >
                  Abrir
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
