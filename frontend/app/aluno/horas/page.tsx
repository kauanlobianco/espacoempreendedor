"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Clock3, FileText, Plus } from "lucide-react";
import { toast } from "sonner";

import { MetricCard } from "@/components/data-display/metric-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pill } from "@/components/ui/pill";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { formatDate, formatHours } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { casesService } from "@/services/cases";
import { extensionHoursService } from "@/services/extension-hours";
import type { CreateExtensionHoursPayload, ExtensionHoursEntry, ValidationStatus } from "@/types/api";

const TARGET_HOURS = 120;

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date);
}

function formatDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function statusTone(status: ValidationStatus) {
  if (status === "APPROVED") return "green";
  if (status === "REJECTED") return "red";
  return "amber";
}

function statusLabel(status: ValidationStatus) {
  if (status === "APPROVED") return "Validado";
  if (status === "REJECTED") return "Rejeitado";
  return "Em validacao";
}

export default function StudentHoursPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const hoursQuery = useQuery({
    queryKey: ["extension-hours", "mine"],
    queryFn: () => extensionHoursService.mine(),
  });

  const casesQuery = useQuery({
    queryKey: ["cases", "mine", "hours", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => casesService.list({ assigneeId: user!.id, pageSize: 100 }),
  });

  const logMutation = useMutation({
    mutationFn: (payload: CreateExtensionHoursPayload) => extensionHoursService.log(payload),
    onSuccess: () => {
      toast.success("Horas registradas com sucesso.");
      void queryClient.invalidateQueries({ queryKey: ["extension-hours"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Nao foi possivel registrar as horas agora."));
    },
  });

  const entries = useMemo(
    () =>
      [...(hoursQuery.data ?? [])].sort(
        (a, b) =>
          new Date(b.referenceDate).getTime() - new Date(a.referenceDate).getTime(),
      ),
    [hoursQuery.data],
  );

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.total += entry.hours;
        acc[entry.status] += entry.hours;
        return acc;
      },
      { APPROVED: 0, PENDING: 0, REJECTED: 0, total: 0 },
    );
  }, [entries]);

  const openCases =
    casesQuery.data?.items.filter((item) => !["CLOSED", "CANCELLED"].includes(item.status))
      .length ?? 0;
  const concludedCases =
    casesQuery.data?.items.filter((item) => ["RESOLVED", "CLOSED"].includes(item.status))
      .length ?? 0;

  const monthSeries = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 5 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (4 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: formatMonthLabel(date),
        value: 0,
      };
    });

    const lookup = new Map(months.map((item) => [item.key, item]));
    entries.forEach((entry) => {
      const date = new Date(entry.referenceDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = lookup.get(key);
      if (bucket) bucket.value += entry.hours;
    });

    return months;
  }, [entries]);

  const maxMonthValue = Math.max(...monthSeries.map((item) => item.value), 1);
  const progress = Math.min((totals.total / TARGET_HOURS) * 100, 100);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Horas extensionistas"
        title="Carga do semestre"
        description="Acompanhe a sua evolucao, registre atividades complementares e veja o que ja foi validado para o semestre atual."
        actions={
          <Link
            href="/aluno/relatorio-extensao"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
          >
            <FileText className="size-4" />
            Ver relatorios
          </Link>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-transparent bg-[var(--brand-ink)] text-white shadow-lift">
          <CardContent className="relative p-7 md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full radial-orange-orb opacity-50"
            />
            <div className="relative space-y-5">
              <div>
                <p className="font-eyebrow text-[var(--brand-orange)]">Semestre 2026.1</p>
                <div className="mt-4 flex items-end gap-3">
                  <p className="font-display text-6xl leading-none tracking-tight">
                    {formatHours(totals.total).replace(" h", "h")}
                  </p>
                  <p className="pb-1 text-sm text-white/60">de {TARGET_HOURS}h previstas</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--brand-orange)] transition-[width]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/65">
                  <span>{progress.toFixed(0)}% da meta acumulada</span>
                  <span>Faltam {formatHours(Math.max(TARGET_HOURS - totals.total, 0))}</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Validadas</p>
                  <p className="mt-2 text-lg font-semibold text-white">{formatHours(totals.APPROVED)}</p>
                </div>
                <div className="rounded-2xl bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Em validacao</p>
                  <p className="mt-2 text-lg font-semibold text-white">{formatHours(totals.PENDING)}</p>
                </div>
                <div className="rounded-2xl bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Casos concluidos</p>
                  <p className="mt-2 text-lg font-semibold text-white">{concludedCases}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[color:var(--brand-soft-line)] bg-white/88 shadow-soft">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-eyebrow text-[var(--brand-mute)]">Ultimos 5 meses</p>
                <h2 className="mt-2 font-display text-[28px] leading-none text-[var(--brand-ink)]">
                  Ritmo mensal
                </h2>
              </div>
              <Pill tone="blue" size="lg">
                <BarChart3 className="size-3.5" />
                Evolucao
              </Pill>
            </div>

            <div className="flex h-44 items-end gap-3">
              {monthSeries.map((item) => (
                <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end">
                    <div
                      className={cn(
                        "w-full rounded-t-xl transition-[height]",
                        item.value > 0
                          ? "bg-[var(--brand-orange)]"
                          : "bg-[var(--brand-paper-deep)]",
                      )}
                      style={{
                        height: `${Math.max((item.value / maxMonthValue) * 100, item.value > 0 ? 8 : 4)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-mute)]">
                    {item.label}
                  </span>
                  <span className="text-xs font-semibold text-[var(--brand-ink)]">
                    {item.value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}h
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Registros no semestre"
          value={String(entries.length)}
          help="Total de lancamentos de horas feitos por voce."
        />
        <MetricCard
          label="Em aberto"
          value={String(openCases)}
          help="Casos que ainda podem gerar novas atividades."
          tone={openCases > 0 ? "accent" : "default"}
        />
        <MetricCard
          label="Rejeitadas"
          value={formatHours(totals.REJECTED)}
          help="Horas que precisaram de ajuste ou foram recusadas."
          tone={totals.REJECTED > 0 ? "muted" : "default"}
        />
        <MetricCard
          label="Ultimo lancamento"
          value={entries[0] ? formatDate(entries[0].referenceDate).slice(0, 6) : "—"}
          help={entries[0] ? entries[0].activity : "Sem registros recentes."}
          tone="muted"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <Card className="border-[color:var(--brand-soft-line)] bg-white/88 shadow-soft">
          <CardContent className="space-y-5 p-6">
            <div>
              <p className="font-eyebrow text-[var(--brand-orange-deep)]">Novo registro</p>
              <h2 className="mt-2 font-display text-[30px] leading-none text-[var(--brand-ink)]">
                Lancar horas
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--brand-mute)]">
                Use este formulario para registrar atividades complementares que depois vao
                para validacao do professor.
              </p>
            </div>

            <HoursLogForm onSubmit={(payload) => logMutation.mutate(payload)} busy={logMutation.isPending} />

            <Callout tone="info" title="Como isso entra no relatorio?">
              Registros validados alimentam a visao de horas e podem compor os seus relatórios
              institucionais de extensao.
            </Callout>
          </CardContent>
        </Card>

        <Card className="border-[color:var(--brand-soft-line)] bg-white/88 shadow-soft">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-eyebrow text-[var(--brand-mute)]">Historico recente</p>
                <h2 className="mt-2 font-display text-[30px] leading-none text-[var(--brand-ink)]">
                  Registros do semestre
                </h2>
              </div>
              <Link
                href="/aluno/relatorio-extensao"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-xl border border-[color:var(--brand-soft-line)]")}
              >
                Abrir relatorios
              </Link>
            </div>

            {!entries.length ? (
              <EmptyState
                title="Sem horas registradas"
                description="Quando voce registrar atendimentos ou atividades complementares, eles aparecerao aqui com o status de validacao."
              />
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-2xl border border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/45 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--brand-ink)]">
                          {entry.activity}
                        </p>
                        <p className="text-xs text-[var(--brand-mute)]">
                          Referencia em {formatDate(entry.referenceDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill tone={statusTone(entry.status)} size="sm">
                          {statusLabel(entry.status)}
                        </Pill>
                        <Pill tone="ghost" size="sm">
                          {formatHours(entry.hours)}
                        </Pill>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function HoursLogForm({
  onSubmit,
  busy,
}: {
  onSubmit: (payload: CreateExtensionHoursPayload) => void;
  busy?: boolean;
}) {
  const [referenceDate, setReferenceDate] = useState(formatDateInputValue());
  const [hours, setHours] = useState("1");
  const [activity, setActivity] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          referenceDate,
          hours: Number(hours),
          activity,
        });
        setHours("1");
        setActivity("");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[12.5px] font-semibold text-[var(--brand-night)]">Data</label>
          <Input type="date" value={referenceDate} onChange={(event) => setReferenceDate(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[12.5px] font-semibold text-[var(--brand-night)]">Carga horaria</label>
          <Input
            type="number"
            min="0.5"
            step="0.5"
            value={hours}
            onChange={(event) => setHours(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[12.5px] font-semibold text-[var(--brand-night)]">Atividade</label>
        <Textarea
          rows={4}
          placeholder="Descreva a atividade extensionista realizada."
          value={activity}
          onChange={(event) => setActivity(event.target.value)}
        />
      </div>

      <Button
        type="submit"
        className="w-full justify-center"
        disabled={busy || !referenceDate || !activity.trim() || Number(hours) <= 0}
      >
        <Plus className="size-4" />
        {busy ? "Registrando..." : "Registrar horas"}
      </Button>
    </form>
  );
}
