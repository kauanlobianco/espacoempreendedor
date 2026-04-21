"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/feedback/empty-state";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api/client";
import { extensionReportsService } from "@/services/extension-reports";
import { MIN_NARRATIVE_CHARS } from "@/features/extension-reports/status";

const NARRATIVE_PLACEHOLDER = `Relate, em primeira pessoa, sua experiência no Espaço Empreendedor. Inclua:
• como você participou do projeto e apoiou os microempreendedores
• tipos de demandas que você atendeu
• aprendizados técnicos e humanos
• contribuição para sua formação acadêmica e profissional
• como suas ações ajudaram a orientar, resolver ou encaminhar casos reais`;

export default function NewReportWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [narrative, setNarrative] = useState("");
  const [search, setSearch] = useState("");

  const eligibleQuery = useQuery({
    queryKey: ["extension-reports", "eligible"],
    queryFn: () => extensionReportsService.eligibleCases(),
  });

  const cases = eligibleQuery.data ?? [];
  const filteredCases = useMemo(() => {
    if (!search) return cases;
    const q = search.toLowerCase();
    return cases.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }, [cases, search]);

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((k) => selected[k]),
    [selected],
  );
  const selectedCases = cases.filter((c) => selected[c.id]);
  const totalHours = selectedCases.reduce((a, c) => a + c.totalHours, 0);

  const narrativeOk = narrative.trim().length >= MIN_NARRATIVE_CHARS;
  const canNextFromStep1 = selectedIds.length >= 1;

  const submitMutation = useMutation({
    mutationFn: async () => {
      const draft = await extensionReportsService.createDraft(selectedIds);
      await extensionReportsService.update(draft.id, { narrative });
      return extensionReportsService.submit(draft.id);
    },
    onSuccess: (r) => {
      toast.success("Relatório enviado para análise");
      router.push(`/aluno/relatorio-extensao/${r.id}`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow={`Passo ${step} de 4`}
        title="Gerar relatório de extensão"
        description="Selecione casos concluídos, escreva sua reflexão e envie para análise do(a) professor(a)."
      />

      <div className="flex gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              n <= step ? "bg-brand-orange" : "bg-slate-200",
            )}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, categoria ou resumo"
              className="w-full rounded-xl border border-brand-line bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
          </div>
          {eligibleQuery.isLoading ? (
            <div className="h-32 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          ) : !cases.length ? (
            <EmptyState
              title="Nenhum caso elegível"
              description="Você precisa de casos concluídos (RESOLVED/CLOSED) com atendimentos registrados para compor um relatório."
              primaryHref="/aluno/meus-casos"
              primaryLabel="Ver meus casos"
            />
          ) : (
            <ul className="space-y-2">
              {filteredCases.map((c) => {
                const checked = !!selected[c.id];
                return (
                  <li key={c.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-2xl border bg-white p-4 transition",
                        checked
                          ? "border-brand-orange shadow-sm"
                          : "border-brand-line hover:border-brand-orange/50",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setSelected((s) => ({ ...s, [c.id]: e.target.checked }))
                        }
                        className="mt-1 size-4 accent-brand-orange"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-brand-ink">{c.code}</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                            {c.category}
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                            {c.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{c.summary}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {c.attendances} atendimento(s) • {c.totalHours.toFixed(2)}h
                        </p>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl border border-brand-line bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-orange">
            Resumo da seleção
          </h3>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">Casos selecionados</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-ink">
                {selectedCases.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total de horas</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-ink">
                {totalHours.toFixed(2)}h
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Categorias</dt>
              <dd className="mt-1 text-sm text-brand-ink">
                {[...new Set(selectedCases.map((c) => c.category))].join(", ") || "—"}
              </dd>
            </div>
          </dl>
          <ul className="mt-6 space-y-2 text-sm">
            {selectedCases.map((c) => (
              <li
                key={c.id}
                className="flex justify-between border-b border-dashed border-brand-line/60 py-1.5"
              >
                <span>
                  <strong>{c.code}</strong> — {c.summary}
                </span>
                <span className="text-muted-foreground">{c.totalHours.toFixed(2)}h</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-ink">
            Relato reflexivo (obrigatório, mínimo {MIN_NARRATIVE_CHARS} caracteres)
          </label>
          <Textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder={NARRATIVE_PLACEHOLDER}
            rows={14}
            className="font-normal"
          />
          <div className="flex justify-between text-xs">
            <span className={narrativeOk ? "text-emerald-700" : "text-muted-foreground"}>
              {narrative.trim().length} / {MIN_NARRATIVE_CHARS} caracteres mínimos
            </span>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 rounded-2xl border border-brand-line bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-orange">
            Confirmação
          </h3>
          <p className="text-sm text-muted-foreground">
            Ao enviar, o sistema gerará o PDF institucional e o encaminhará para análise do(a)
            professor(a). Após a assinatura, o documento ficará disponível para download.
          </p>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Casos</dt>
              <dd className="font-semibold">{selectedCases.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total de horas</dt>
              <dd className="font-semibold">{totalHours.toFixed(2)}h</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Narrativa</dt>
              <dd className="font-semibold">
                {narrative.trim().length} caracteres
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          disabled={step === 1}
          onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
        >
          <ArrowLeft className="size-4" /> Voltar
        </Button>

        {step < 4 ? (
          <Button
            disabled={
              (step === 1 && !canNextFromStep1) ||
              (step === 3 && !narrativeOk)
            }
            onClick={() => setStep((s) => (s + 1) as 2 | 3 | 4)}
          >
            Próximo <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            disabled={!narrativeOk || !canNextFromStep1 || submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
          >
            <Send className="size-4" />{" "}
            {submitMutation.isPending ? "Enviando..." : "Enviar para análise"}
          </Button>
        )}
      </div>
    </section>
  );
}
