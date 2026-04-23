"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Search,
  Send,
  Sparkles,
} from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { Textarea } from "@/components/ui/textarea";
import { MIN_NARRATIVE_CHARS } from "@/features/extension-reports/status";
import { getErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { extensionReportsService } from "@/services/extension-reports";

const NARRATIVE_PLACEHOLDER = `Relate, em primeira pessoa, sua experiência no Espaço Empreendedor. Inclua:
• como você participou do projeto e apoiou os microempreendedores
• tipos de demandas que você atendeu
• aprendizados técnicos e humanos
• contribuição para sua formação acadêmica e profissional
• como suas ações ajudaram a orientar, resolver ou encaminhar casos reais`;

const STEPS = [
  { n: 1, label: "Casos" },
  { n: 2, label: "Resumo" },
  { n: 3, label: "Relato" },
  { n: 4, label: "Envio" },
] as const;

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

      <div className="rounded-[20px] border border-[color:var(--brand-soft-line)] bg-white p-4 shadow-soft">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, idx) => {
            const done = step > s.n;
            const current = step === s.n;
            return (
              <div key={s.n} className="flex flex-1 items-center gap-3">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold transition-all",
                    current
                      ? "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white shadow-[0_6px_18px_rgba(232,93,31,0.28)]"
                      : done
                        ? "border-[var(--brand-orange-deep)] bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]"
                        : "border-[color:var(--brand-soft-line)] bg-white text-[var(--brand-mute)]",
                  )}
                >
                  {s.n}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-[13px] font-semibold",
                      current
                        ? "text-[var(--brand-ink)]"
                        : done
                          ? "text-[var(--brand-orange-deep)]"
                          : "text-[var(--brand-mute)]",
                    )}
                  >
                    {s.label}
                  </p>
                </div>
                {idx < STEPS.length - 1 ? (
                  <span
                    className={cn(
                      "hidden h-0.5 flex-1 rounded-full md:block",
                      done
                        ? "bg-[var(--brand-orange)]"
                        : "bg-[var(--brand-paper-deep)]",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--brand-mute)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, categoria ou resumo"
              className="pl-10"
            />
          </div>

          {eligibleQuery.isLoading ? (
            <div className="h-32 animate-pulse rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white/70" />
          ) : !cases.length ? (
            <EmptyState
              title="Nenhum caso elegível"
              description="Você precisa de casos concluídos (RESOLVED/CLOSED) com atendimentos registrados para compor um relatório."
              primaryHref="/aluno/meus-casos"
              primaryLabel="Ver meus casos"
            />
          ) : (
            <div className="space-y-2.5">
              {filteredCases.map((c) => {
                const checked = !!selected[c.id];
                return (
                  <label
                    key={c.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-[20px] border bg-white p-4 transition-all",
                      checked
                        ? "border-[var(--brand-orange)] shadow-[0_12px_28px_rgba(232,93,31,0.14)]"
                        : "border-[color:var(--brand-soft-line)] hover:border-[color:rgba(232,93,31,0.32)]",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setSelected((s) => ({ ...s, [c.id]: e.target.checked }))
                      }
                      className="mt-1 size-4 accent-[var(--brand-orange)]"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[13px] font-semibold text-[var(--brand-ink)]">
                          {c.code}
                        </span>
                        <Pill tone="neutral" size="sm">
                          {c.category}
                        </Pill>
                        <Pill tone="green" size="sm" withDot>
                          {c.status}
                        </Pill>
                      </div>
                      <p className="mt-1.5 text-[14px] leading-6 text-[var(--brand-night)]">
                        {c.summary}
                      </p>
                      <p className="mt-1 text-xs text-[var(--brand-mute)]">
                        {c.attendances} atendimento(s) · {c.totalHours.toFixed(2)}h
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-7">
          <Eyebrow>Resumo da seleção</Eyebrow>
          <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight text-[var(--brand-ink)]">
            Confira antes de avançar
          </h2>

          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryTile label="Casos selecionados" value={String(selectedCases.length)} />
            <SummaryTile label="Total de horas" value={`${totalHours.toFixed(2)}h`} accent />
            <SummaryTile
              label="Categorias"
              value={[...new Set(selectedCases.map((c) => c.category))].join(", ") || "—"}
              small
            />
          </dl>

          <ul className="mt-6 space-y-1.5 text-sm">
            {selectedCases.map((c) => (
              <li
                key={c.id}
                className="flex items-start justify-between gap-4 rounded-xl bg-[var(--brand-paper-deep)]/55 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <span className="font-mono text-[12.5px] font-semibold text-[var(--brand-ink)]">
                    {c.code}
                  </span>
                  <span className="ml-2 text-[var(--brand-night)]">{c.summary}</span>
                </div>
                <span className="shrink-0 text-[var(--brand-mute)]">
                  {c.totalHours.toFixed(2)}h
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3 rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-7">
          <Eyebrow>Relato reflexivo</Eyebrow>
          <h2 className="font-display text-[28px] leading-tight tracking-tight text-[var(--brand-ink)]">
            Sua vivência como extensionista
          </h2>
          <p className="text-sm leading-6 text-[var(--brand-mute)]">
            Obrigatório, com pelo menos {MIN_NARRATIVE_CHARS} caracteres.
          </p>

          <Textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder={NARRATIVE_PLACEHOLDER}
            rows={14}
            className="mt-3"
          />

          <div className="flex items-center justify-between text-xs">
            <span
              className={cn(
                "font-semibold",
                narrativeOk
                  ? "text-[var(--brand-green)]"
                  : "text-[var(--brand-mute)]",
              )}
            >
              {narrative.trim().length} / {MIN_NARRATIVE_CHARS} caracteres mínimos
            </span>
            {narrativeOk ? (
              <Pill tone="green" size="sm" icon={<Sparkles className="size-3" />}>
                Pronto
              </Pill>
            ) : null}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-7">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
              <FileText className="size-5" />
            </span>
            <div>
              <Eyebrow>Confirmação</Eyebrow>
              <h2 className="mt-2 font-display text-[28px] leading-tight tracking-tight text-[var(--brand-ink)]">
                Tudo pronto para envio?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-mute)]">
                Ao enviar, o sistema gera o PDF institucional e encaminha para análise do(a)
                professor(a). Após a assinatura, o documento fica disponível para download.
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryTile label="Casos" value={String(selectedCases.length)} />
            <SummaryTile label="Total de horas" value={`${totalHours.toFixed(2)}h`} accent />
            <SummaryTile
              label="Narrativa"
              value={`${narrative.trim().length} caracteres`}
            />
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

function SummaryTile({
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
          : "border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/55",
      )}
    >
      <p className="font-eyebrow text-[var(--brand-mute)]">{label}</p>
      <p
        className={cn(
          "mt-2 font-display leading-none tracking-tight text-[var(--brand-ink)]",
          small ? "text-[15px]" : "text-[24px]",
        )}
      >
        {value}
      </p>
    </div>
  );
}
