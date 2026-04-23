"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  FileSignature,
  Pencil,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { SectionHeader } from "@/components/feedback/section-header";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Pill } from "@/components/ui/pill";
import { Textarea } from "@/components/ui/textarea";
import {
  MIN_NARRATIVE_CHARS,
  STATUS_LABEL,
  STATUS_PILL_TONE,
} from "@/features/extension-reports/status";
import { getErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  extensionReportsService,
  extensionReportsUrls,
  fetchReportPdf,
} from "@/services/extension-reports";

async function downloadBlob(url: string, filename: string) {
  const blob = await fetchReportPdf(url);
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR");
}

export default function StudentReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();
  const [editingNarrative, setEditingNarrative] = useState(false);
  const [narrative, setNarrative] = useState("");

  const { data: report, isLoading } = useQuery({
    queryKey: ["extension-reports", id],
    queryFn: () => extensionReportsService.getOne(id),
  });

  const updateMutation = useMutation({
    mutationFn: () => extensionReportsService.update(id, { narrative }),
    onSuccess: () => {
      toast.success("Narrativa atualizada");
      setEditingNarrative(false);
      qc.invalidateQueries({ queryKey: ["extension-reports", id] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const resubmitMutation = useMutation({
    mutationFn: () => extensionReportsService.submit(id),
    onSuccess: () => {
      toast.success("Relatório reenviado");
      qc.invalidateQueries({ queryKey: ["extension-reports", id] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading || !report) {
    return (
      <div className="h-64 animate-pulse rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white/70" />
    );
  }

  const isEditable = report.status === "DRAFT" || report.status === "RETURNED";
  const isSigned = report.status === "SIGNED" || report.status === "COMPLETED";

  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/aluno/relatorio-extensao")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-mute)] hover:text-[var(--brand-ink)]"
      >
        <ArrowLeft className="size-4" /> Voltar aos relatórios
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow={report.code}
          title="Relatório de extensão"
          description={`Criado em ${formatDate(report.createdAt)}`}
        />
        <Pill tone={STATUS_PILL_TONE[report.status]} withDot size="lg">
          {STATUS_LABEL[report.status]}
        </Pill>
      </div>

      {report.status === "RETURNED" && report.reviewerNote ? (
        <Callout tone="warning" title="Devolvido para correção">
          {report.reviewerNote}
        </Callout>
      ) : null}

      {isSigned ? (
        <div className="rounded-[24px] border border-[color:rgba(47,125,91,0.24)] bg-[color:rgba(47,125,91,0.08)] p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[color:rgba(47,125,91,0.14)] text-[var(--brand-green)]">
              <ShieldCheck className="size-5" />
            </span>
            <div className="flex-1 space-y-2">
              <h3 className="font-display text-[22px] leading-tight tracking-tight text-[var(--brand-ink)]">
                Documento assinado e pronto para download.
              </h3>
              <p className="text-sm leading-6 text-[var(--brand-night)]">
                Baixe o PDF e entregue à secretaria acadêmica quando necessário.
              </p>
              <Button
                className="mt-2 gap-2"
                onClick={() =>
                  downloadBlob(
                    extensionReportsUrls.signed(report.id),
                    `relatorio-assinado-${report.code}.pdf`,
                  )
                }
              >
                <Download className="size-4" /> Baixar PDF assinado
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatTile label="Casos" value={String(report.items.length)} />
        <StatTile label="Total de horas" value={`${report.totalHours.toFixed(2)}h`} accent />
        <StatTile
          label="Período"
          value={
            report.periodStart && report.periodEnd
              ? `${new Date(report.periodStart).toLocaleDateString("pt-BR")} – ${new Date(
                  report.periodEnd,
                ).toLocaleDateString("pt-BR")}`
              : "—"
          }
          small
        />
      </div>

      <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Eyebrow>Relato reflexivo</Eyebrow>
            <h3 className="mt-2 font-display text-[24px] leading-tight tracking-tight text-[var(--brand-ink)]">
              Sua vivência como extensionista
            </h3>
          </div>
          {isEditable && !editingNarrative ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setNarrative(report.narrative);
                setEditingNarrative(true);
              }}
            >
              <Pencil className="size-4" /> Editar
            </Button>
          ) : null}
        </div>

        {editingNarrative ? (
          <div className="mt-4 space-y-2">
            <Textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={12}
            />
            <div className="flex items-center justify-between pt-1 text-xs">
              <span
                className={cn(
                  "font-semibold",
                  narrative.trim().length >= MIN_NARRATIVE_CHARS
                    ? "text-[var(--brand-green)]"
                    : "text-[var(--brand-mute)]",
                )}
              >
                {narrative.trim().length} / {MIN_NARRATIVE_CHARS} caracteres
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingNarrative(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  disabled={narrative.trim().length < MIN_NARRATIVE_CHARS}
                  onClick={() => updateMutation.mutate()}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 whitespace-pre-wrap text-[14.5px] leading-relaxed text-[var(--brand-night)]">
            {report.narrative || "(não preenchida)"}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <SectionHeader eyebrow="Anexos" title="Casos incluídos" />

        {!report.items.length ? (
          <EmptyState
            title="Sem casos no relatório"
            description="Este relatório ainda não tem casos vinculados."
          />
        ) : (
          <div className="rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-2 shadow-soft">
            <ul className="divide-y divide-[color:var(--brand-soft-line)]">
              {report.items.map((it, i) => (
                <li key={it.id} className="px-4 py-3.5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-ink)]">
                        <span className="text-[var(--brand-mute)]">#{i + 1}</span>
                        <span>{it.snapshotCategory}</span>
                      </div>
                      <p className="mt-1 text-[13.5px] leading-6 text-[var(--brand-mute)]">
                        {it.snapshotSummary}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-[12.5px] text-[var(--brand-mute)]">
                      <p className="font-semibold text-[var(--brand-ink)]">
                        {it.snapshotHours.toFixed(2)}h
                      </p>
                      <p>{new Date(it.snapshotDate).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {isEditable ? (
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() =>
                downloadBlob(
                  extensionReportsUrls.preview(report.id),
                  `preview-${report.code}.pdf`,
                )
              }
            >
              <Download className="size-4" /> Baixar prévia
            </Button>
            <Button
              className="gap-2"
              onClick={() => resubmitMutation.mutate()}
              disabled={resubmitMutation.isPending}
            >
              <RefreshCw className="size-4" />{" "}
              {resubmitMutation.isPending ? "Enviando..." : "Enviar para análise"}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              downloadBlob(
                extensionReportsUrls.generated(report.id),
                `relatorio-${report.code}.pdf`,
              )
            }
          >
            <FileSignature className="size-4" /> Baixar PDF gerado
          </Button>
        )}
      </div>
    </section>
  );
}

function StatTile({
  label,
  value,
  accent = false,
  small = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        accent
          ? "border-[color:rgba(232,93,31,0.24)] bg-[var(--brand-orange-ghost)]"
          : "border-[color:var(--brand-soft-line)] bg-white shadow-soft",
      )}
    >
      <p className="font-eyebrow text-[var(--brand-mute)]">{label}</p>
      <p
        className={cn(
          "mt-2 font-display leading-none tracking-tight text-[var(--brand-ink)]",
          small ? "text-[15px]" : "text-[26px]",
        )}
      >
        {value}
      </p>
    </div>
  );
}
