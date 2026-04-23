"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import {
  STATUS_LABEL,
  STATUS_PILL_TONE,
} from "@/features/extension-reports/status";
import { cn } from "@/lib/utils";
import { extensionReportsService } from "@/services/extension-reports";
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

      <div className="flex flex-wrap gap-2 rounded-[20px] border border-[color:var(--brand-soft-line)] bg-white p-1.5 shadow-soft">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-xl px-4 py-2 text-[13px] font-semibold transition-colors",
                isActive
                  ? "bg-[var(--brand-ink)] text-white"
                  : "text-[var(--brand-mute)] hover:bg-[var(--brand-paper-deep)] hover:text-[var(--brand-ink)]",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white/70" />
          <div className="h-24 animate-pulse rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white/70" />
        </div>
      ) : !data?.length ? (
        <EmptyState
          title="Nada por aqui"
          description="Não há relatórios neste filtro no momento."
        />
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft md:p-6"
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <Avatar name={r.student.fullName} size="md" tone="orange" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[13px] font-semibold text-[var(--brand-ink)]">
                      {r.code}
                    </span>
                    <Pill tone={STATUS_PILL_TONE[r.status]} withDot>
                      {STATUS_LABEL[r.status]}
                    </Pill>
                  </div>
                  <p className="text-[14px] font-semibold text-[var(--brand-ink)]">
                    {r.student.fullName}{" "}
                    <span className="font-normal text-[var(--brand-mute)]">
                      · {r.student.email}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--brand-mute)]">
                    {r._count.items} caso(s) · {r.totalHours.toFixed(2)}h ·{" "}
                    {r.submittedAt
                      ? `Enviado em ${new Date(r.submittedAt).toLocaleDateString("pt-BR")}`
                      : "Rascunho"}
                  </p>
                </div>
              </div>
              <Link
                href={`/professor/relatorios/${r.id}`}
                className={cn(buttonVariants(), "gap-2")}
              >
                Abrir revisão
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
