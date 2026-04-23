"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  Circle,
  CircleAlert,
  Clock3,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { CaseStatusBadge } from "@/components/data-display/case-status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import {
  CASE_TRANSITIONS_BY_ROLE,
  CATEGORY_LABEL,
  INTERACTION_TYPE_LABEL,
  INTERACTION_TYPE_OPTIONS,
  PREFERRED_CHANNEL_LABEL,
} from "@/lib/constants/domain";
import { formatDateTime, formatRelativeTime, maskCpf } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { attendancesService } from "@/services/attendances";
import { casesService } from "@/services/cases";
import type {
  Attendance,
  AttendanceChannel,
  AttendanceInteractionType,
  CaseDetail,
  CaseStatus,
  UserRole,
} from "@/types/api";

const serviceRecordSchema = z.object({
  channel: z.enum(["PRESENCIAL", "TELEFONE", "WHATSAPP", "EMAIL", "OUTRO"]),
  interactionType: z.enum(["SIMPLE_GUIDANCE", "GUIDANCE_WITH_REFERRAL", "DETAILED_SUPPORT"]),
  demandDescription: z.string().min(15, "Descreva a demanda com um pouco mais de detalhe."),
  actionTaken: z.string().min(15, "Explique o que voce fez com um pouco mais de detalhe."),
  outcome: z.string().min(10, "Registre o resultado deste atendimento."),
  needsFollowUp: z.boolean(),
  internalNotes: z.string().optional(),
});

type ServiceRecordValues = z.infer<typeof serviceRecordSchema>;

const CHANNELS: Array<{ value: AttendanceChannel; label: string }> = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "TELEFONE", label: "Telefone" },
  { value: "EMAIL", label: "E-mail" },
  { value: "OUTRO", label: "Outro" },
];

type HistoryEvent = {
  id: string;
  occurredAt: string;
  title: string;
  body: string;
  tone: "orange" | "green" | "neutral" | "red";
  tags?: string[];
};

const JOURNEY_LABELS = [
  "Recebido",
  "Triado",
  "Em atendimento",
  "Aguardando retorno",
  "Concluido",
] as const;

function getJourneyIndex(status: CaseStatus) {
  switch (status) {
    case "NEW":
      return 0;
    case "TRIAGED":
      return 1;
    case "ASSIGNED":
    case "IN_PROGRESS":
      return 2;
    case "WAITING_USER":
    case "WAITING_SUPERVISION":
      return 3;
    case "RESOLVED":
    case "CLOSED":
    case "CANCELLED":
      return 4;
    default:
      return 0;
  }
}

function formatLocation(item: CaseDetail) {
  if (!item.request.city) return "Nao informado";
  return item.request.state
    ? `${item.request.city} · ${item.request.state}`
    : item.request.city;
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}min`;
}

function buildHistory(item: CaseDetail): HistoryEvent[] {
  const activeAssignment = item.assignments.find((assignment) => assignment.active);
  const history: HistoryEvent[] = [
    {
      id: `${item.id}-request`,
      occurredAt: item.request.createdAt,
      title: "Pedido recebido",
      body: item.request.description,
      tone: "neutral",
      tags: [CATEGORY_LABEL[item.category]],
    },
  ];

  if (activeAssignment?.assignedAt) {
    history.push({
      id: `${activeAssignment.id}-assignment`,
      occurredAt: activeAssignment.assignedAt,
      title: `Caso assumido por ${activeAssignment.student.fullName}`,
      body: "O caso saiu da fila e passou para acompanhamento direto.",
      tone: "neutral",
    });
  }

  item.attendances.forEach((attendance: Attendance) => {
    history.push({
      id: attendance.id,
      occurredAt: attendance.occurredAt,
      title: attendance.needsFollowUp
        ? `Atendimento com retorno (${PREFERRED_CHANNEL_LABEL[attendance.channel]})`
        : `Orientacao prestada (${PREFERRED_CHANNEL_LABEL[attendance.channel]})`,
      body: attendance.outcome || attendance.actionTaken || attendance.summary,
      tone: attendance.needsFollowUp ? "orange" : "green",
      tags: [
        PREFERRED_CHANNEL_LABEL[attendance.channel],
        INTERACTION_TYPE_LABEL[attendance.interactionType],
        formatDuration(attendance.durationMin),
      ],
    });
  });

  if (["RESOLVED", "CLOSED", "CANCELLED"].includes(item.status)) {
    history.push({
      id: `${item.id}-closed`,
      occurredAt: item.closedAt ?? item.updatedAt,
      title:
        item.status === "CANCELLED"
          ? "Caso cancelado"
          : item.status === "RESOLVED"
            ? "Caso resolvido"
            : "Caso concluido",
      body: item.notes || "Fluxo encerrado e historico consolidado.",
      tone: item.status === "CANCELLED" ? "red" : "green",
    });
  }

  return history.sort(
    (left, right) =>
      new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
  );
}

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
      interactionType: "GUIDANCE_WITH_REFERRAL",
      demandDescription: "",
      actionTaken: "",
      outcome: "",
      needsFollowUp: false,
      internalNotes: "",
    },
  });

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
      toast.success("Atendimento registrado.");
      form.reset({
        channel: "WHATSAPP",
        interactionType: "GUIDANCE_WITH_REFERRAL",
        demandDescription: "",
        actionTaken: "",
        outcome: "",
        needsFollowUp: false,
        internalNotes: "",
      });
      invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Nao foi possivel registrar.")),
  });

  const concludeCase = useMutation({
    mutationFn: () =>
      casesService.updateStatus(caseId, {
        status: concludeStatus!,
        note: concludeNote || undefined,
      }),
    onSuccess: () => {
      toast.success(
        concludeStatus === "CANCELLED" ? "Caso cancelado." : "Caso concluido.",
      );
      setShowConclude(false);
      setConcludeStatus(null);
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
      <div className="space-y-5">
        <div className="h-60 animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="h-[620px] animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
          <div className="h-[620px] animate-pulse rounded-[28px] border border-brand-line bg-white/70" />
        </div>
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <EmptyState
        title="Caso indisponivel"
        description="Nao foi possivel carregar este caso agora."
      />
    );
  }

  const item = detailQuery.data;
  const activeAssignment = item.assignments.find((assignment) => assignment.active);
  const isAssignedToMe = activeAssignment?.student.id === user?.id;
  const isClosed = ["RESOLVED", "CLOSED", "CANCELLED"].includes(item.status);
  const canAssignToSelf =
    role === "STUDENT" && !activeAssignment && ["NEW", "TRIAGED"].includes(item.status);

  const concludeOptions = (
    [
      { value: "RESOLVED" as const, label: "Concluir como resolvido", tone: "default" as const },
      { value: "CANCELLED" as const, label: "Encerrar como cancelado", tone: "destructive" as const },
    ] as const
  ).filter((option) => availableTransitions.includes(option.value));

  const canConclude = role === "STUDENT" && isAssignedToMe && !isClosed && concludeOptions.length > 0;
  const historyItems = buildHistory(item);
  const currentJourney = getJourneyIndex(item.status);

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[28px] border-[color:var(--brand-soft-line)] bg-white shadow-soft">
        <CardContent className="space-y-8 p-6 md:p-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="neutral" size="lg">
                  {item.code}
                </Pill>
                <CaseStatusBadge status={item.status} size="md" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-mute)]">
                  {CATEGORY_LABEL[item.category]}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-[2rem] leading-none tracking-[-0.04em] text-[var(--brand-ink)] md:text-[2.65rem]">
                  {item.request.fullName}
                </h1>
                <p className="max-w-4xl text-[14.5px] leading-7 text-[var(--brand-mute)]">
                  {item.summary || item.request.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <InfoChip icon={<Phone className="size-3.5" />} label="Telefone" value={item.request.phone} />
                <InfoChip icon={<Mail className="size-3.5" />} label="E-mail" value={item.request.email || "Nao informado"} />
                <InfoChip icon={<ShieldCheck className="size-3.5" />} label="CPF" value={maskCpf(item.request.cpf)} />
                <InfoChip icon={<MapPin className="size-3.5" />} label="Localidade" value={formatLocation(item)} />
                <InfoChip icon={<Clock3 className="size-3.5" />} label="Abriu em" value={formatDateTime(item.request.createdAt)} />
              </div>
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 xl:w-auto xl:min-w-[220px] xl:items-end">
              <Button variant="outline" size="sm" className="gap-2">
                Mais opcoes
                <MoreHorizontal className="size-3.5" />
              </Button>

              {canAssignToSelf ? (
                <Button
                  size="lg"
                  className="justify-center"
                  onClick={() => assignCase.mutate()}
                  disabled={assignCase.isPending}
                >
                  {assignCase.isPending ? "Assumindo..." : "Assumir caso"}
                </Button>
              ) : null}

              {canConclude ? (
                <Button
                  size="lg"
                  className="justify-center"
                  onClick={() => {
                    setShowConclude(true);
                    setConcludeStatus(concludeOptions[0]?.value ?? null);
                  }}
                >
                  <CheckCircle2 className="size-4" />
                  Concluir caso
                </Button>
              ) : null}

              <p className="text-right text-[11.5px] text-[var(--brand-mute)]">
                {isAssignedToMe
                  ? "Voce e a responsavel"
                  : activeAssignment
                    ? `Responsavel: ${activeAssignment.student.fullName}`
                    : "Caso ainda sem responsavel"}
              </p>
            </div>
          </div>

          {showConclude ? (
            <div className="rounded-[22px] border border-[color:rgba(232,93,31,0.22)] bg-[var(--brand-orange-ghost)]/60 p-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--brand-ink)]">Encerrar este caso</p>
                <p className="text-[13px] text-[var(--brand-mute)]">
                  Escolha o desfecho final. Depois disso, o caso sai da rotina ativa.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {concludeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setConcludeStatus(option.value)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                      concludeStatus === option.value
                        ? option.value === "CANCELLED"
                          ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                          : "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white"
                        : "border-[color:var(--brand-soft-line)] bg-white text-[var(--brand-ink)]",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <Textarea
                className="mt-4"
                rows={3}
                value={concludeNote}
                onChange={(event) => setConcludeNote(event.target.value)}
                placeholder="Observacao final opcional"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={() => concludeCase.mutate()}
                  disabled={!concludeStatus || concludeCase.isPending}
                >
                  {concludeCase.isPending ? "Salvando..." : "Confirmar encerramento"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConclude(false);
                    setConcludeStatus(null);
                    setConcludeNote("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : null}

          <div className="border-t border-[color:var(--brand-soft-line)] pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-mute)]">
              Jornada do caso
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-5 md:gap-0">
              {JOURNEY_LABELS.map((label, index) => {
                const done = index < currentJourney;
                const current = index === currentJourney;

                return (
                  <div key={label} className="relative flex flex-col items-center text-center">
                    {index < JOURNEY_LABELS.length - 1 ? (
                      <div
                        aria-hidden
                        className={cn(
                          "absolute left-1/2 top-3 hidden h-[2px] w-full translate-x-6 md:block",
                          index < currentJourney
                            ? "bg-[var(--brand-ink)]"
                            : "bg-[var(--brand-soft-line)]",
                        )}
                      />
                    ) : null}

                    <div
                      className={cn(
                        "relative z-10 flex size-8 items-center justify-center rounded-full border text-[11px] font-bold",
                        done
                          ? "border-[var(--brand-ink)] bg-[var(--brand-ink)] text-white"
                          : current
                            ? "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white shadow-[0_0_0_6px_rgba(232,93,31,0.14)]"
                            : "border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)] text-[var(--brand-mute)]",
                      )}
                    >
                      {done ? <Check className="size-4" /> : index + 1}
                    </div>
                    <p
                      className={cn(
                        "mt-3 text-[12.5px] font-semibold",
                        done || current ? "text-[var(--brand-ink)]" : "text-[var(--brand-mute)]",
                      )}
                    >
                      {label}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--brand-mute)]">
                      {index === 0
                        ? formatRelativeTime(item.request.createdAt)
                        : index === currentJourney
                          ? formatRelativeTime(item.updatedAt)
                          : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="rounded-[28px] border-[color:var(--brand-soft-line)] bg-white shadow-soft">
          <CardContent className="space-y-6 p-6 md:p-7">
            <div className="flex flex-col gap-3 border-b border-[color:var(--brand-soft-line)] pb-5 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-orange-deep)]">
                  Novo registro
                </p>
                <h2 className="font-display text-[2rem] leading-none tracking-[-0.03em] text-[var(--brand-ink)]">
                  Registrar atendimento
                </h2>
                <p className="text-[13px] leading-6 text-[var(--brand-mute)]">
                  Cada atendimento compoe seu historico do caso e segue para validacao.
                </p>
              </div>
              <Pill tone="green" size="lg">
                Registro vai para validacao
              </Pill>
            </div>

            {isClosed ? (
              <LockedState
                icon={<CheckCircle2 className="size-10 text-[var(--brand-green)]" />}
                title="Caso encerrado"
                description="Esse caso ja foi finalizado. Voce ainda pode consultar todo o historico ao lado."
              />
            ) : !isAssignedToMe && role === "STUDENT" ? (
              <LockedState
                icon={<CircleAlert className="size-10 text-[var(--brand-amber)]" />}
                title="Caso fora da sua carteira"
                description="Somente o aluno responsavel pode registrar novos atendimentos."
              />
            ) : (
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit((values) => createAttendance.mutate(values))}
              >
                <section className="space-y-3">
                  <FieldLabel label="Canal do atendimento" />
                  <Controller
                    control={form.control}
                    name="channel"
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2">
                        {CHANNELS.map((channel) => (
                          <ChoicePill
                            key={channel.value}
                            active={field.value === channel.value}
                            onClick={() => field.onChange(channel.value)}
                          >
                            {channel.label}
                          </ChoicePill>
                        ))}
                      </div>
                    )}
                  />
                </section>

                <section className="space-y-2.5">
                  <FieldLabel
                    label="O que a empreendedora precisava?"
                    hint="Descreva a duvida ou necessidade de forma objetiva."
                  />
                  <Textarea
                    rows={4}
                    placeholder="Ex.: quer entender se a atividade pode ser registrada como MEI e quais documentos precisa reunir."
                    {...form.register("demandDescription")}
                  />
                  <FieldError message={form.formState.errors.demandDescription?.message} />
                </section>

                <section className="space-y-2.5">
                  <FieldLabel
                    label="O que voce fez?"
                    hint="Registre orientacao, encaminhamento e o passo seguinte indicado."
                  />
                  <Textarea
                    rows={4}
                    placeholder="Ex.: conferi a atividade, expliquei as regras e enviei o link oficial para o proximo passo."
                    {...form.register("actionTaken")}
                  />
                  <FieldError message={form.formState.errors.actionTaken?.message} />
                </section>

                <section className="space-y-3">
                  <FieldLabel
                    label="Complexidade do atendimento"
                    hint="Isso ajuda a compor suas horas extensionistas."
                  />
                  <Controller
                    control={form.control}
                    name="interactionType"
                    render={({ field }) => (
                      <div className="grid gap-3 md:grid-cols-3">
                        {INTERACTION_TYPE_OPTIONS.filter(
                          (option) => option.value !== "ONGOING_CASE",
                        ).map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "rounded-[18px] border p-4 text-left transition-all",
                              field.value === option.value
                                ? "border-[var(--brand-orange)] bg-[var(--brand-orange-ghost)]"
                                : "border-[color:var(--brand-soft-line)] bg-white",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[13.5px] font-semibold text-[var(--brand-ink)]">
                                  {option.label}
                                </p>
                                <p className="mt-1 text-[12.5px] leading-5 text-[var(--brand-mute)]">
                                  {option.description}
                                </p>
                              </div>
                              {field.value === option.value ? (
                                <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-[var(--brand-orange)] text-white">
                                  <Check className="size-3" />
                                </span>
                              ) : null}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </section>

                <section className="space-y-2.5">
                  <FieldLabel
                    label="Como ficou a situacao?"
                    hint="Registre o resultado do atendimento."
                  />
                  <Textarea
                    rows={3}
                    placeholder="Ex.: empreendedora entendeu o passo inicial e vai enviar o documento restante."
                    {...form.register("outcome")}
                  />
                  <FieldError message={form.formState.errors.outcome?.message} />
                </section>

                <section className="space-y-3">
                  <FieldLabel label="Precisa de retorno?" />
                  <Controller
                    control={form.control}
                    name="needsFollowUp"
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2">
                        <ChoicePill active={!field.value} onClick={() => field.onChange(false)}>
                          Nao, esta resolvido
                        </ChoicePill>
                        <ChoicePill active={field.value} onClick={() => field.onChange(true)}>
                          Sim, precisa de retorno
                        </ChoicePill>
                      </div>
                    )}
                  />
                </section>

                <section className="space-y-2.5">
                  <FieldLabel
                    label="Notas internas"
                    hint="Nao entram no relatorio. Use apenas para contexto operacional."
                  />
                  <Textarea
                    rows={3}
                    placeholder="Ex.: pode precisar de apoio extra para juntar documentos."
                    {...form.register("internalNotes")}
                  />
                </section>

                <div className="flex flex-wrap gap-2 border-t border-[color:var(--brand-soft-line)] pt-5">
                  <Button type="submit" size="lg" disabled={createAttendance.isPending}>
                    {createAttendance.isPending ? "Salvando..." : "Salvar registro"}
                  </Button>
                  {canConclude ? (
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setShowConclude(true);
                        setConcludeStatus(concludeOptions[0]?.value ?? null);
                      }}
                    >
                      Concluir caso
                    </Button>
                  ) : null}
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-mute)]">
                Historico
              </p>
              <h2 className="font-display text-[2rem] leading-none tracking-[-0.03em] text-[var(--brand-ink)]">
                Tudo o que aconteceu
              </h2>
            </div>
            <Pill tone="neutral" size="lg">
              {historyItems.length} registros
            </Pill>
          </div>

          {historyItems.length === 0 ? (
            <Card className="rounded-[24px] border-[color:var(--brand-soft-line)] bg-white shadow-soft">
              <CardContent className="p-6">
                <p className="text-sm text-[var(--brand-mute)]">
                  Nenhum registro disponivel ate o momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="relative space-y-4 pl-6">
              <div className="absolute left-[13px] top-3 bottom-3 w-px bg-[var(--brand-soft-line)]" />
              {historyItems.map((event) => (
                <HistoryCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[13px] font-semibold text-[var(--brand-ink)]">{label}</p>
      {hint ? <p className="text-[12px] text-[var(--brand-mute)]">{hint}</p> : null}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[12px] text-[var(--brand-red)]">{message}</p>;
}

function ChoicePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
        active
          ? "border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white"
          : "border-[color:var(--brand-soft-line)] bg-white text-[var(--brand-ink)]",
      )}
    >
      {children}
    </button>
  );
}

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-[14px] border border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/50 px-3 py-2">
      <span className="text-[var(--brand-mute)]">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-mute)]">
          {label}
        </p>
        <p className="text-[12.5px] font-semibold text-[var(--brand-ink)]">{value}</p>
      </div>
    </div>
  );
}

function LockedState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-[22px] border border-dashed border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/30 px-6 text-center">
      {icon}
      <p className="text-base font-semibold text-[var(--brand-ink)]">{title}</p>
      <p className="max-w-md text-sm leading-6 text-[var(--brand-mute)]">{description}</p>
    </div>
  );
}

function HistoryCard({ event }: { event: HistoryEvent }) {
  const toneClass =
    event.tone === "orange"
      ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]"
      : event.tone === "green"
        ? "border-[var(--brand-green)] bg-[var(--brand-green)]"
        : event.tone === "red"
          ? "border-[var(--brand-red)] bg-[var(--brand-red)]"
          : "border-[color:var(--brand-line)] bg-[var(--brand-paper-deep)]";

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute -left-6 top-4 flex size-6 items-center justify-center rounded-full border-2 bg-white",
          toneClass,
        )}
      >
        <Circle className="size-2 fill-white text-white" />
      </div>

      <Card className="rounded-[22px] border-[color:var(--brand-soft-line)] bg-white shadow-soft">
        <CardContent className="space-y-3 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-[14px] font-semibold text-[var(--brand-ink)]">{event.title}</p>
            <p className="text-[11.5px] text-[var(--brand-mute)]">
              {formatDateTime(event.occurredAt)}
            </p>
          </div>
          <p className="text-[13px] leading-6 text-[var(--brand-mute)]">{event.body}</p>
          {event.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Pill key={tag} tone="neutral" size="sm">
                  {tag}
                </Pill>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
