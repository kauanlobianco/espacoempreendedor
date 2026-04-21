"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Download, Upload, Undo2, ClipboardCheck } from "lucide-react";

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
import { STATUS_LABEL, STATUS_TONE } from "@/features/extension-reports/status";

async function downloadBlob(url: string, filename: string) {
  const blob = await fetchReportPdf(url);
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

export default function ProfessorReportReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [returnNote, setReturnNote] = useState("");
  const [showReturn, setShowReturn] = useState(false);

  const { data: report, isLoading } = useQuery({
    queryKey: ["extension-reports", id],
    queryFn: () => extensionReportsService.getOne(id),
  });

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!report) return;
    const url =
      report.status === "SIGNED" || report.status === "COMPLETED"
        ? extensionReportsUrls.signed(report.id)
        : report.status === "DRAFT" || report.status === "RETURNED"
          ? extensionReportsUrls.preview(report.id)
          : extensionReportsUrls.generated(report.id);
    let objectUrl: string | null = null;
    fetchReportPdf(url)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(objectUrl);
      })
      .catch(() => setPdfBlobUrl(null));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [report?.id, report?.status, report?.signedPdfKey]);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["extension-reports"] });

  const claim = useMutation({
    mutationFn: () => extensionReportsService.claim(id),
    onSuccess: () => {
      toast.success("Revisão assumida");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const upload = useMutation({
    mutationFn: (file: File) => extensionReportsService.uploadSigned(id, file),
    onSuccess: () => {
      toast.success("PDF assinado enviado");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const complete = useMutation({
    mutationFn: () => extensionReportsService.complete(id),
    onSuccess: () => {
      toast.success("Relatório concluído");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const returnIt = useMutation({
    mutationFn: () => extensionReportsService.returnToStudent(id, returnNote),
    onSuccess: () => {
      toast.success("Relatório devolvido ao aluno");
      setShowReturn(false);
      setReturnNote("");
      invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading || !report) {
    return <div className="h-64 animate-pulse rounded-2xl border border-brand-line bg-white/70" />;
  }

  const remoteUrl =
    report.status === "SIGNED" || report.status === "COMPLETED"
      ? extensionReportsUrls.signed(report.id)
      : report.status === "DRAFT" || report.status === "RETURNED"
        ? extensionReportsUrls.preview(report.id)
        : extensionReportsUrls.generated(report.id);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow={report.code}
          title="Revisão de relatório"
          description={
            report.student
              ? `${report.student.fullName} • ${report.student.email}`
              : undefined
          }
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

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-brand-line bg-white p-5 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
              Dados do aluno
            </h3>
            {report.student ? (
              <dl className="mt-3 space-y-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Nome</dt>
                  <dd className="font-medium">{report.student.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">E-mail</dt>
                  <dd>{report.student.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Matrícula</dt>
                  <dd>{report.student.studentProfile?.enrollment ?? "—"}</dd>
                </div>
              </dl>
            ) : null}
          </div>

          <div className="rounded-2xl border border-brand-line bg-white p-5 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
              Consolidação
            </h3>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between">
                <dt className="text-xs text-muted-foreground">Casos</dt>
                <dd className="font-medium">{report.items.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-xs text-muted-foreground">Horas</dt>
                <dd className="font-medium">{report.totalHours.toFixed(2)}h</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-xs text-muted-foreground">Enviado em</dt>
                <dd>
                  {report.submittedAt
                    ? new Date(report.submittedAt).toLocaleString("pt-BR")
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-brand-line bg-white p-5 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
              Relato reflexivo
            </h3>
            <p className="mt-3 whitespace-pre-wrap">{report.narrative}</p>
          </div>

          <div className="rounded-2xl border border-brand-line bg-white p-5 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
              Casos vinculados
            </h3>
            <ul className="mt-3 space-y-2">
              {report.items.map((it, i) => (
                <li key={it.id} className="border-b border-dashed border-brand-line/60 pb-2">
                  <div className="flex justify-between">
                    <strong>
                      #{i + 1} {it.snapshotCategory}
                    </strong>
                    <span className="text-muted-foreground">
                      {it.snapshotHours.toFixed(2)}h
                    </span>
                  </div>
                  <p className="text-muted-foreground">{it.snapshotSummary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                downloadBlob(remoteUrl, `relatorio-${report.code}.pdf`)
              }
            >
              <Download className="size-4" /> Baixar PDF
            </Button>

            {report.status === "SUBMITTED" ? (
              <Button onClick={() => claim.mutate()} disabled={claim.isPending}>
                <ClipboardCheck className="size-4" /> Assumir revisão
              </Button>
            ) : null}

            {(report.status === "UNDER_REVIEW" || report.status === "SUBMITTED") && (
              <>
                <input
                  ref={fileInput}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload.mutate(f);
                    e.target.value = "";
                  }}
                />
                <Button
                  onClick={() => fileInput.current?.click()}
                  disabled={upload.isPending}
                >
                  <Upload className="size-4" />{" "}
                  {upload.isPending ? "Enviando..." : "Enviar PDF assinado"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReturn((s) => !s)}
                >
                  <Undo2 className="size-4" /> Devolver
                </Button>
              </>
            )}

            {report.status === "SIGNED" ? (
              <Button onClick={() => complete.mutate()} disabled={complete.isPending}>
                <CheckCircle2 className="size-4" /> Concluir
              </Button>
            ) : null}
          </div>

          {showReturn ? (
            <div className="mt-4 space-y-2 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <label className="text-sm font-medium text-rose-900">
                Observação para o aluno
              </label>
              <Textarea
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowReturn(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => returnIt.mutate()}
                  disabled={returnNote.trim().length < 5 || returnIt.isPending}
                >
                  Confirmar devolução
                </Button>
              </div>
            </div>
          ) : null}

          <div className="mt-4 overflow-hidden rounded-2xl border border-brand-line bg-white">
            {pdfBlobUrl ? (
              <iframe
                src={pdfBlobUrl}
                className="h-[720px] w-full"
                title={`PDF ${report.code}`}
              />
            ) : (
              <div className="flex h-[720px] items-center justify-center text-sm text-muted-foreground">
                Carregando PDF...
              </div>
            )}
          </div>
        </div>
      </div>

      <Button variant="ghost" onClick={() => router.push("/professor/relatorios")}>
        Voltar à fila
      </Button>
    </section>
  );
}
