"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

import { CaseTimeline } from "@/components/data-display/case-timeline";
import { CaseStatusBadge } from "@/components/data-display/case-status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import {
  CASE_TRANSITIONS_BY_ROLE,
  CATEGORY_LABEL,
  INTERACTION_TYPE_OPTIONS,
  PREFERRED_CHANNEL_LABEL,
} from "@/lib/constants/domain";
import { formatDateTime, maskCpf } from "@/lib/formatters";
import { attendancesService } from "@/services/attendances";
import { casesService } from "@/services/cases";
import type { AttendanceChannel, AttendanceInteractionType, CaseStatus, UserRole } from "@/types/api";

// ── Schema ───────────────────────────────────────────────────────────────────

const serviceRecordSchema = z.object({
  channel: z.enum(["PRESENCIAL", "TELEFONE", "WHATSAPP", "EMAIL", "OUTRO"]),
  interactionType: z.enum(["SIMPLE_GUIDANCE", "GUIDANCE_WITH_REFERRAL", "DETAILED_SUPPORT"]),
  demandDescription: z.string().min(15, "Descreva a demanda com um pouco mais de detalhe."),
  actionTaken: z.string().min(15, "Explique o que você fez com um pouco mais de detalhe."),
  outcome: z.string().min(10, "Registre o resultado deste atendimento."),
  needsFollowUp: z.boolean(),
  internalNotes: z.string().optional(),
});

type ServiceRecordValues = z.infer<typeof serviceRecordSchema>;

// ── Primitives ───────────────────────────────────────────────────────────────

const CHANNELS: Array<{ value: AttendanceChannel; label: string }> = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "TELEFONE", label: "Telefone" },
  { value: "EMAIL", label: "E-mail" },
  { value: "OUTRO", label: "Outro" },
];

function Chip({
  active,
  onClick,
  children,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
        variant === "default" &&
          (active
            ? "border-brand-orange bg-brand-orange text-white shadow-sm"
            : "border-brand-line bg-white text-brand-night/70 hover:border-brand-orange/50 hover:text-brand-ink"),
        variant === "danger" &&
          (active
            ? "border-rose-500 bg-rose-500 text-white shadow-sm"
            : "border-brand-line bg-white text-brand-night/70 hover:border-rose-400 hover:text-rose-700"),
      )}
    >
      {children}
    </button>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="mb-2">
      <p className="text-sm font-semibold text-brand-ink">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-destructive">{message}</p>;
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function CaseDetailScreen({
  caseId,
  role,
}: {
  caseId: string;
  role: Extract<UserRole, "STUDENT" | "PROFESSOR" | "ADMIN">;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showConclude, setShowConclude] = useState(false);
  const [concludeStatus, setConcludeStatus] = useState<"RESOLVED" | "CANCELLED" | null>(null);
  const [concludeNote, setConcludeNote] = useState("");

  const detailQuery = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => casesService.findOne(caseId),
  });

  const form = useForm<ServiceRecordValues>({
    resolver: zodResolver(serviceRecordSchema),
    defaultValues: {
      channel: "WHATSAPP",
      interactionType: "SIMPLE_GUIDANCE",
      demandDescription: "",
      actionTaken: "",
      outcome: "",
      needsFollowUp: false,
      internalNotes: "",
    },
  });

  const selectedType = form.watch("interactionType");
  const interactionOption = INTERACTION_TYPE_OPTIONS.find((o) => o.value === selectedType);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["case", caseId] });
    void queryClient.invalidateQueries({ queryKey: ["cases"] });
  };

  const createAttendance = useMutation({
    mutationFn: (values: ServiceRecordValues) =>
      attendancesService.create(caseId, {
        channel: values.channel,
        interactionType: values.interactionType as AttendanceInteractionType,
        demandDescription: values.demandDescription,
        actionTaken: values.actionTaken,
        outcome: values.outcome,
        needsFollowUp: values.needsFollowUp,
        internalNotes: values.internalNotes || undefined,
      }),
    onSuccess: () => {
      form.reset({
        channel: "WHATSAPP",
        interactionType: "SIMPLE_GUIDANCE",
        demandDescription: "",
        actionTaken: "",
        outcome: "",
        needsFollowUp: false,
        internalNotes: "",
      });
      toast.success("Atendimento registrado.");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Não foi possível registrar.")),
  });

  const concludeCase = useMutation({
    mutationFn: () =>
      casesService.updateStatus(caseId, {
        status: concludeStatus!,
        note: concludeNote || undefined,
      }),
    onSuccess: () => {
      toast.success(concludeStatus === "RESOLVED" ? "Caso concluído." : "Caso cancelado.");
      setShowConclude(false);
      setConcludeNote("");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const assignCase = useMutation({
    mutationFn: () => casesService.assign(caseId, user!.id),
    onSuccess: () => {
      toast.success("Caso assumido.");
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const availableTransitions = useMemo(() => {
    const status = detailQuery.data?.status;
    if (!status) return [];
    return CASE_TRANSITIONS_BY_ROLE(status, role);
  }, [detailQuery.data?.status, role]);

  if (detailQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-36 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="h-96 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
          <div className="h-96 animate-pulse rounded-2xl border border-brand-line bg-white/70" />
        </div>
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <EmptyState
        title="Caso indisponível"
        description="Não foi possível carregar este caso agora."
      />
    );
  }

  const item = detailQuery.data;
  const activeAssignment = item.assignments.find((a) => a.active);
  const isAssignedToMe = activeAssignment?.student.id === user?.id;
  const canAssignToSelf =
    role === "STUDENT" && !activeAssignment && ["NEW", "TRIAGED"].includes(item.status);
  const isClosed = ["CLOSED", "RESOLVED", "CANCELLED"].includes(item.status);

  const concludeOptions = (
    [
      { value: "RESOLVED" as const, label: "✓ Resolvido — demanda atendida", variant: "default" as const },
      { value: "CANCELLED" as const, label: "Cancelado — sem atendimento", variant: "danger" as const },
    ] as const
  ).filter((o) => availableTransitions.includes(o.value));

  const canConclude = role === "STUDENT" && isAssignedToMe && !isClosed && concludeOptions.length > 0;

  return (
    <div className="space-y-6">
      {/* ── Case header ──────────────────────────────────────────────────── */}
      <Card className="border-brand-line bg-white/88 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            {/* Left: identity */}
            <div className="space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-brand-night">
                  {item.code}
                </span>
                <CaseStatusBadge status={item.status} />
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {CATEGORY_LABEL[item.category]}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-brand-ink">{item.request.fullName}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground line-clamp-2">
                  {item.request.description}
                </p>
              </div>

              <dl className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: "Tel", value: item.request.phone },
                  { label: "E-mail", value: item.request.email || "—" },
                  { label: "CPF", value: maskCpf(item.request.cpf) },
                  {
                    label: "Local",
                    value: item.request.city
                      ? `${item.request.city} · ${item.request.state}`
                      : "—",
                  },
                  { label: "Pedido em", value: formatDateTime(item.request.createdAt) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex gap-1.5 rounded-lg bg-brand-paper/70 px-2.5 py-1.5"
                  >
                    <span className="font-semibold uppercase tracking-wider text-brand-night/50">
                      {label}
                    </span>
                    <span className="font-medium text-brand-ink">{value}</span>
                  </div>
                ))}
                {activeAssignment ? (
                  <div className="flex gap-1.5 rounded-lg bg-brand-paper/70 px-2.5 py-1.5">
                    <span className="font-semibold uppercase tracking-wider text-brand-night/50">
                      Responsável
                    </span>
                    <span className="font-medium text-brand-ink">
                      {activeAssignment.student.fullName}
                    </span>
                  </div>
                ) : null}
              </dl>
            </div>

            {/* Right: primary actions */}
            <div className="flex shrink-0 flex-col items-end gap-2">
              {canAssignToSelf ? (
                <Button onClick={() => assignCase.mutate()} disabled={assignCase.isPending}>
                  Assumir este caso
                </Button>
              ) : null}

              {canConclude ? (
                <Button
                  variant="outline"
                  className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                  onClick={() => {
                    setShowConclude(true);
                    setConcludeStatus(concludeOptions[0]?.value ?? null);
                  }}
                >
                  <CheckCircle2 className="size-4" /> Concluir caso
                </Button>
              ) : null}

              {isClosed ? (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                  <CheckCircle2 className="size-3.5" /> Encerrado
                </span>
              ) : null}
            </div>
          </div>

          {/* Conclude panel */}
          {showConclude ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">Concluir este caso</p>
              <p className="mt-0.5 text-xs text-emerald-800/70">
                Após concluído o caso não poderá receber novos registros de atendimento.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {concludeOptions.map((opt) => (
                  <Chip
                    key={opt.value}
                    active={concludeStatus === opt.value}
                    onClick={() => setConcludeStatus(opt.value)}
                    variant={opt.variant}
                  >
                    {opt.label}
                  </Chip>
                ))}
              </div>
              <Textarea
                className="mt-3"
                rows={2}
                value={concludeNote}
                onChange={(e) => setConcludeNote(e.target.value)}
                placeholder="Observação final opcional (ex.: empreendedor regularizou o MEI com sucesso)"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className={concludeStatus === "CANCELLED" ? "bg-rose-600 hover:bg-rose-700" : ""}
                  onClick={() => concludeCase.mutate()}
                  disabled={!concludeStatus || concludeCase.isPending}
                >
                  {concludeCase.isPending ? "Salvando…" : "Confirmar"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowConclude(false);
                    setConcludeNote("");
                    setConcludeStatus(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* ── Body: form + timeline ─────────────────────────────────────────── */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ── Service record form (LEFT — primary action) ─────────────────── */}
        <div>
          {isClosed ? (
            <Card className="border-brand-line bg-white/88 shadow-soft">
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <CheckCircle2 className="size-10 text-emerald-400" />
                <p className="font-semibold text-brand-ink">Caso encerrado</p>
                <p className="text-sm text-muted-foreground">
                  Nenhum novo atendimento pode ser registrado. O histórico está disponível ao lado.
                </p>
              </CardContent>
            </Card>
          ) : !isAssignedToMe && role === "STUDENT" ? (
            <Card className="border-brand-line bg-white/88 shadow-soft">
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                <AlertCircle className="size-10 text-amber-400" />
                <p className="font-semibold text-brand-ink">Você não é o responsável por este caso</p>
                <p className="text-sm text-muted-foreground">
                  Apenas o aluno atribuído pode registrar atendimentos.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-brand-line bg-white/88 shadow-soft">
              <CardContent className="p-6">
                <div className="mb-6 border-b border-brand-line/50 pb-4">
                  <h3 className="text-base font-semibold text-brand-ink">
                    Registrar atendimento
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Documente o que aconteceu — esses registros compõem o relatório de horas extensionistas.
                  </p>
                </div>

                <form
                  className="space-y-6"
                  onSubmit={form.handleSubmit((values) => createAttendance.mutate(values))}
                >
                  {/* Canal */}
                  <div>
                    <FieldLabel label="Canal do atendimento" />
                    <Controller
                      control={form.control}
                      name="channel"
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                          {CHANNELS.map((ch) => (
                            <Chip
                              key={ch.value}
                              active={field.value === ch.value}
                              onClick={() => field.onChange(ch.value)}
                            >
                              {ch.label}
                            </Chip>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  {/* Demanda */}
                  <div>
                    <FieldLabel
                      label="O que o empreendedor precisava?"
                      hint="Descreva a dúvida ou situação apresentada de forma objetiva."
                    />
                    <Textarea
                      rows={3}
                      placeholder="Ex.: Empreendedora perguntou sobre como emitir a guia DAS em atraso e queria entender os encargos."
                      {...form.register("demandDescription")}
                    />
                    <FieldError message={form.formState.errors.demandDescription?.message} />
                  </div>

                  {/* Ação */}
                  <div>
                    <FieldLabel
                      label="O que você fez?"
                      hint="Descreva a orientação, encaminhamento ou suporte que você prestou."
                    />
                    <Textarea
                      rows={3}
                      placeholder="Ex.: Expliquei o portal MEI, mostrei como calcular o valor em atraso e acompanhei a emissão da guia durante o atendimento."
                      {...form.register("actionTaken")}
                    />
                    <FieldError message={form.formState.errors.actionTaken?.message} />
                  </div>

                  {/* Tipo */}
                  <div>
                    <FieldLabel
                      label="Como você classificaria este atendimento?"
                      hint="Ajuda a entender o nível de complexidade do suporte prestado."
                    />
                    <Controller
                      control={form.control}
                      name="interactionType"
                      render={({ field }) => (
                        <div className="grid gap-2 sm:grid-cols-3">
                          {INTERACTION_TYPE_OPTIONS.filter(
                            (o) => o.value !== "ONGOING_CASE",
                          ).map((opt) => (
                            <label
                              key={opt.value}
                              className={cn(
                                "flex cursor-pointer flex-col gap-1 rounded-2xl border p-3 transition",
                                field.value === opt.value
                                  ? "border-brand-orange bg-orange-50"
                                  : "border-brand-line bg-white hover:border-brand-orange/40",
                              )}
                            >
                              <input
                                type="radio"
                                value={opt.value}
                                checked={field.value === opt.value}
                                onChange={() =>
                                  field.onChange(opt.value as AttendanceInteractionType)
                                }
                                className="sr-only"
                              />
                              <p className="text-sm font-semibold text-brand-ink">{opt.label}</p>
                              <p className="text-xs text-muted-foreground leading-5">{opt.description}</p>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {interactionOption ? (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        Equivale a {interactionOption.durationMin} min de extensão
                      </p>
                    ) : null}
                  </div>

                  {/* Resultado */}
                  <div>
                    <FieldLabel
                      label="Como ficou a situação?"
                      hint="Registre o resultado deste atendimento de forma clara."
                    />
                    <Textarea
                      rows={2}
                      placeholder="Ex.: Empreendedora emitiu a guia e pagou no mesmo dia. Questão resolvida."
                      {...form.register("outcome")}
                    />
                    <FieldError message={form.formState.errors.outcome?.message} />
                  </div>

                  {/* Continuidade */}
                  <div>
                    <FieldLabel label="Este caso precisa de retorno?" />
                    <Controller
                      control={form.control}
                      name="needsFollowUp"
                      render={({ field }) => (
                        <div className="flex gap-2">
                          <Chip active={!field.value} onClick={() => field.onChange(false)}>
                            Não, está resolvido
                          </Chip>
                          <Chip active={field.value} onClick={() => field.onChange(true)}>
                            Sim, precisa de retorno
                          </Chip>
                        </div>
                      )}
                    />
                  </div>

                  {/* Notas internas */}
                  <div>
                    <FieldLabel
                      label="Notas internas"
                      hint="Visível só para você. Não entra no relatório de extensão."
                    />
                    <Textarea
                      rows={2}
                      placeholder="Ex.: empreendedora tem dificuldade com tecnologia, pode precisar de ajuda em futuros acessos."
                      {...form.register("internalNotes")}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 border-t border-brand-line/50 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createAttendance.isPending}
                    >
                      {createAttendance.isPending ? "Salvando…" : "Salvar registro"}
                    </Button>
                    {canConclude ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                        onClick={() => {
                          setShowConclude(true);
                          setConcludeStatus(concludeOptions[0]?.value ?? null);
                        }}
                      >
                        <CheckCircle2 className="size-4" /> Concluir caso
                      </Button>
                    ) : null}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Timeline (RIGHT — history) ────────────────────────────────────── */}
        <div className="min-w-0 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-night/70">
              Histórico
            </p>
            <h3 className="text-base font-semibold text-brand-ink">Registros do caso</h3>
          </div>
          <CaseTimeline attendances={item.attendances} />
        </div>
      </div>
    </div>
  );
}
