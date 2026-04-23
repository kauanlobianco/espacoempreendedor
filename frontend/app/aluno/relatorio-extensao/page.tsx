"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, Plus } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, STATUS_PILL_TONE } from "@/features/extension-reports/status";
import { extensionReportsService } from "@/services/extension-reports";

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
      <PageHeader
        eyebrow="Extensão"
        title="Relatórios de horas extensionistas"
        description="Gere, acompanhe e baixe seus relatórios institucionais de atendimentos do Espaço Empreendedor."
        actions={
          <Link
            href="/aluno/relatorio-extensao/novo"
            className={cn(buttonVariants(), "gap-2")}
          >
            <Plus className="size-4" /> Novo relatório
          </Link>
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-28 animate-pulse rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white/70" />
          <div className="h-28 animate-pulse rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white/70" />
        </div>
      ) : !data?.length ? (
        <EmptyState
          title="Nenhum relatório ainda"
          description="Selecione casos concluídos e gere seu primeiro relatório institucional."
          primaryHref="/aluno/relatorio-extensao/novo"
          primaryLabel="Gerar relatório"
        />
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <Link
              key={r.id}
              href={`/aluno/relatorio-extensao/${r.id}`}
              className="group block rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
                      <FileText className="size-4" />
                    </span>
                    <span className="font-mono text-[13px] font-semibold tracking-tight text-[var(--brand-ink)]">
                      {r.code}
                    </span>
                    <Pill tone={STATUS_PILL_TONE[r.status]} withDot>
                      {STATUS_LABEL[r.status]}
                    </Pill>
                  </div>

                  <p className="text-[13.5px] text-[var(--brand-mute)]">
                    <span className="font-semibold text-[var(--brand-ink)]">
                      {r.totalHours.toFixed(2)}h
                    </span>
                    {"  ·  "}
                    {r.periodStart && r.periodEnd
                      ? `${formatDate(r.periodStart)} – ${formatDate(r.periodEnd)}`
                      : "Período não definido"}
                  </p>

                  {r.reviewerNote && r.status === "RETURNED" ? (
                    <div className="mt-2 rounded-xl border border-[color:rgba(168,42,31,0.22)] bg-[color:rgba(168,42,31,0.06)] px-3 py-2 text-[13px] leading-5 text-[var(--brand-red)]">
                      <strong className="font-semibold">Observação: </strong>
                      {r.reviewerNote}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-orange-deep)]">
                  Abrir
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
