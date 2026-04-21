"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/feedback/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { extensionReportsService } from "@/services/extension-reports";
import { STATUS_LABEL, STATUS_TONE } from "@/features/extension-reports/status";
import type { ExtensionReportStatus } from "@/types/api";

const TABS: Array<{ key: "QUEUE" | ExtensionReportStatus; label: string }> = [
  { key: "QUEUE", label: "Pendentes / Em análise" },
  { key: "SIGNED", label: "Assinados" },
  { key: "COMPLETED", label: "Concluídos" },
  { key: "RETURNED", label: "Devolvidos" },
];

export default function ProfessorReportsQueuePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("QUEUE");

  const { data, isLoading } = useQuery({
    queryKey: ["extension-reports", "queue", tab],
    queryFn: () =>
      extensionReportsService.queue(tab === "QUEUE" ? undefined : tab),
  });

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Extensão"
        title="Relatórios de alunos"
        description="Revise, baixe, assine e devolva relatórios institucionais enviados pelos(as) discentes."
      />

      <div className="flex flex-wrap gap-2 border-b border-brand-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-t-lg px-4 py-2 text-sm font-medium transition",
              tab === t.key
                ? "border-b-2 border-brand-orange text-brand-ink"
                : "text-muted-foreground hover:text-brand-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
      ) : !data?.length ? (
        <EmptyState
          title="Nada por aqui"
          description="Não há relatórios neste filtro no momento."
        />
      ) : (
        <ul className="space-y-3">
          {data.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-brand-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
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
                  <p className="mt-1 text-sm text-brand-ink">
                    {r.student.fullName}{" "}
                    <span className="text-muted-foreground">({r.student.email})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r._count.items} caso(s) • {r.totalHours.toFixed(2)}h •{" "}
                    {r.submittedAt
                      ? `Enviado em ${new Date(r.submittedAt).toLocaleDateString("pt-BR")}`
                      : "Rascunho"}
                  </p>
                </div>
                <Link
                  href={`/professor/relatorios/${r.id}`}
                  className={cn(buttonVariants(), "gap-2")}
                >
                  Abrir revisão
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
