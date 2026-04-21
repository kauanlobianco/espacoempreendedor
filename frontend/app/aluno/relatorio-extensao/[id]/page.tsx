"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, FileSignature, Pencil, RefreshCw } from "lucide-react";

import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api/client";
import {
  extensionReportsService,
  extensionReportsUrls,
  fetchReportPdf,
} from "@/services/extension-reports";
import { STATUS_LABEL, STATUS_TONE, MIN_NARRATIVE_CHARS } from "@/features/extension-reports/status";

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
    return <div className="h-64 animate-pulse rounded-2xl border border-brand-line bg-white/70" />;
  }

  const isEditable = report.status === "DRAFT" || report.status === "RETURNED";
  const isSigned = report.status === "SIGNED" || report.status === "COMPLETED";

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow={report.code}
          title="Relatório de extensão"
          description={`Criado em ${formatDate(report.createdAt)}`}
        />
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            STATUS_TONE[report.status],
          )}
        >
          {STATUS_LABEL[report.status]}
        </span>
      </div>

      {report.status === "RETURNED" && report.reviewerNote ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <p className="font-semibold">Devolvido para correção</p>
          <p className="mt-1">{report.reviewerNote}</p>
        </div>
      ) : null}

      {isSigned ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-900">
            Seu documento foi assinado e está pronto para download.
          </p>
          <p className="mt-1 text-sm text-emerald-900/80">
            Baixe o PDF e entregue à secretaria acadêmica quando necessário.
          </p>
          <Button
            className="mt-3 gap-2"
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
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <dt className="text-xs text-muted-foreground">Casos</dt>
          <dd className="mt-1 text-2xl font-semibold">{report.items.length}</dd>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <dt className="text-xs text-muted-foreground">Total de horas</dt>
          <dd className="mt-1 text-2xl font-semibold">{report.totalHours.toFixed(2)}h</dd>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <dt className="text-xs text-muted-foreground">Período</dt>
          <dd className="mt-1 text-sm">
            {report.periodStart && report.periodEnd
              ? `${new Date(report.periodStart).toLocaleDateString("pt-BR")} – ${new Date(report.periodEnd).toLocaleDateString("pt-BR")}`
              : "—"}
          </dd>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-orange">
            Relato reflexivo
          </h3>
          {isEditable && !editingNarrative ? (
            <Button
              variant="outline"
              size="sm"
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
          <div className="mt-3 space-y-2">
            <Textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={12}
            />
            <div className="flex items-center justify-between text-xs">
              <span
                className={
                  narrative.trim().length >= MIN_NARRATIVE_CHARS
                    ? "text-emerald-700"
                    : "text-muted-foreground"
                }
              >
                {narrative.trim().length} / {MIN_NARRATIVE_CHARS} caracteres
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingNarrative(false)}>
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
          <p className="mt-3 whitespace-pre-wrap text-sm text-brand-ink">
            {report.narrative || "(não preenchida)"}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-brand-line bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-orange">
          Casos incluídos
        </h3>
        <ul className="mt-3 divide-y divide-dashed divide-brand-line/60 text-sm">
          {report.items.map((it, i) => (
            <li key={it.id} className="py-3">
              <div className="flex items-center justify-between">
                <strong>#{i + 1} • {it.snapshotCategory}</strong>
                <span className="text-muted-foreground">
                  {new Date(it.snapshotDate).toLocaleDateString("pt-BR")} •{" "}
                  {it.snapshotHours.toFixed(2)}h
                </span>
              </div>
              <p className="mt-1 text-muted-foreground">{it.snapshotSummary}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {isEditable ? (
          <>
            <Button
              variant="outline"
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
        <Button variant="ghost" onClick={() => router.push("/aluno/relatorio-extensao")}>
          Voltar
        </Button>
      </div>
    </section>
  );
}
