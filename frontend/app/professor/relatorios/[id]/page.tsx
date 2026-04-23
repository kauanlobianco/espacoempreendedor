"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Undo2,
  Upload,
} from "lucide-react";

import { PageHeader } from "@/components/feedback/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Pill } from "@/components/ui/pill";
import { Textarea } from "@/components/ui/textarea";
import {
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

  const invalidate = () => qc.invalidateQueries({ queryKey: ["extension-reports"] });

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
    return (
      <div className="h-64 animate-pulse rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white/70" />
    );
  }

  const remoteUrl =
    report.status === "SIGNED" || report.status === "COMPLETED"
      ? extensionReportsUrls.signed(report.id)
      : report.status === "DRAFT" || report.status === "RETURNED"
        ? extensionReportsUrls.preview(report.id)
        : extensionReportsUrls.generated(report.id);

  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={() => router.push("/professor/relatorios")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-mute)] hover:text-[var(--brand-ink)]"
      >
        <ArrowLeft className="size-4" /> Voltar à fila
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow={report.code}
          title="Revisão de relatório"
          description={
            report.student
              ? `${report.student.fullName} · ${report.student.email}`
              : undefined
          }
        />
        <Pill tone={STATUS_PILL_TONE[report.status]} withDot size="lg">
          {STATUS_LABEL[report.status]}
        </Pill>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {report.student ? (
            <div className="rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft">
              <Eyebrow>Dados do aluno</Eyebrow>
              <div className="mt-4 flex items-start gap-3">
                <Avatar name={report.student.fullName} size="md" tone="orange" />
                <div className="min-w-0 space-y-1.5 text-sm">
                  <p className="font-semibold text-[var(--brand-ink)]">
                    {report.student.fullName}
                  </p>
                  <p className="text-[var(--brand-mute)]">{report.student.email}</p>
                  <p className="text-[var(--brand-mute)]">
                    Matrícula:{" "}
                    <span className="font-mono text-[var(--brand-night)]">
                      {report.student.studentProfile?.enrollment ?? "—"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft">
            <Eyebrow>Consolidação</Eyebrow>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[var(--brand-mute)]">Casos</dt>
                <dd className="font-semibold text-[var(--brand-ink)]">
                  {report.items.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[var(--brand-mute)]">Horas</dt>
                <dd className="font-semibold text-[var(--brand-ink)]">
                  {report.totalHours.toFixed(2)}h
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-[var(--brand-mute)]">Enviado em</dt>
                <dd className="text-[var(--brand-night)]">
                  {report.submittedAt
                    ? new Date(report.submittedAt).toLocaleString("pt-BR")
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft">
            <Eyebrow>Relato reflexivo</Eyebrow>
            <p className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-[var(--brand-night)]">
              {report.narrative}
            </p>
          </div>

          <div className="rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft">
            <Eyebrow>Casos vinculados</Eyebrow>
            <ul className="mt-3 divide-y divide-[color:var(--brand-soft-line)]">
              {report.items.map((it, i) => (
                <li key={it.id} className="py-2.5 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="min-w-0 truncate font-semibold text-[var(--brand-ink)]">
                      <span className="text-[var(--brand-mute)]">#{i + 1}</span>{" "}
                      {it.snapshotCategory}
                    </p>
                    <span className="shrink-0 text-[12.5px] text-[var(--brand-mute)]">
                      {it.snapshotHours.toFixed(2)}h
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-6 text-[var(--brand-mute)]">
                    {it.snapshotSummary}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => downloadBlob(remoteUrl, `relatorio-${report.code}.pdf`)}
            >
              <Download className="size-4" /> Baixar PDF
            </Button>

            {report.status === "SUBMITTED" ? (
              <Button
                className="gap-2"
                onClick={() => claim.mutate()}
                disabled={claim.isPending}
              >
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
                  className="gap-2"
                  onClick={() => fileInput.current?.click()}
                  disabled={upload.isPending}
                >
                  <Upload className="size-4" />{" "}
                  {upload.isPending ? "Enviando..." : "Enviar PDF assinado"}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowReturn((s) => !s)}
                >
                  <Undo2 className="size-4" /> Devolver
                </Button>
              </>
            )}

            {report.status === "SIGNED" ? (
              <Button
                className="gap-2"
                onClick={() => complete.mutate()}
                disabled={complete.isPending}
              >
                <CheckCircle2 className="size-4" /> Concluir
              </Button>
            ) : null}
          </div>

          {showReturn ? (
            <div className="mt-4 space-y-3 rounded-[20px] border border-[color:rgba(168,42,31,0.22)] bg-[color:rgba(168,42,31,0.06)] p-5">
              <div>
                <Eyebrow tone="mute">Devolução ao aluno</Eyebrow>
                <p className="mt-1 text-sm leading-6 text-[var(--brand-night)]">
                  Explique ao aluno o que precisa ser ajustado antes de reenviar.
                </p>
              </div>
              <Textarea
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                rows={4}
                placeholder="Observação para o aluno"
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

          <div
            className={cn(
              "mt-4 overflow-hidden rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white shadow-soft",
            )}
          >
            {pdfBlobUrl ? (
              <iframe
                src={pdfBlobUrl}
                className="h-[720px] w-full"
                title={`PDF ${report.code}`}
              />
            ) : (
              <div className="flex h-[720px] items-center justify-center text-sm text-[var(--brand-mute)]">
                Carregando PDF...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
