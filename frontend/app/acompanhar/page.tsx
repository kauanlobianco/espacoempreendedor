"use client";

import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { CaseStatusBadge } from "@/components/data-display/case-status-badge";
import { PageHeader } from "@/components/feedback/page-header";
import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/client";
import { CATEGORY_LABEL, PREFERRED_CHANNEL_LABEL } from "@/lib/constants/domain";
import { formatDateTime } from "@/lib/formatters";
import {
  clearCachedPublicRequest,
  getCachedPublicRequest,
  type CachedPublicRequest,
} from "@/lib/public-request-cache";
import { cn } from "@/lib/utils";
import { requestsService } from "@/services/requests";
import type { TrackedRequestResponse } from "@/types/api";

const STATUS_FLOW = [
  "NEW",
  "TRIAGED",
  "ASSIGNED",
  "IN_PROGRESS",
  "WAITING_USER",
  "WAITING_SUPERVISION",
  "RESOLVED",
  "CLOSED",
] as const;

function getJourneyCopy(result: TrackedRequestResponse) {
  const caseData = result.case;

  if (!caseData) {
    return {
      title: "Seu pedido foi recebido",
      description:
        "Seu caso entrou na fila do projeto e está aguardando a primeira análise. Em breve nossa equipe olha as informações e segue para o próximo passo.",
    };
  }

  switch (caseData.status) {
    case "NEW":
      return {
        title: "Seu pedido está sendo analisado",
        description:
          "Recebemos suas informações e seu caso está na fila de atendimento. Em breve ele será avaliado pela equipe do projeto.",
      };
    case "TRIAGED":
      return {
        title: "Seu caso avançou para triagem",
        description:
          "Sua solicitação já está em avaliação inicial para entendermos melhor a demanda e encaminhar do jeito certo.",
      };
    case "ASSIGNED":
      return {
        title: caseData.assigneeName
          ? `${caseData.assigneeName} assumiu seu caso`
          : "Seu caso foi assumido pela equipe",
        description:
          "Seu pedido já está com uma pessoa do projeto. Em breve entraremos em contato caso seja preciso confirmar ou complementar alguma informação.",
      };
    case "IN_PROGRESS":
      return {
        title: "Seu atendimento está em andamento",
        description:
          "Seu caso está sendo acompanhado pela equipe. Em breve você pode receber contato com orientações ou pedido de mais informações.",
      };
    case "WAITING_USER":
      return {
        title: "Estamos aguardando um retorno seu",
        description:
          "Já houve análise do seu caso e agora a equipe precisa de uma resposta ou informação complementar para continuar.",
      };
    case "WAITING_SUPERVISION":
      return {
        title: "Seu caso segue em análise interna",
        description:
          "Seu pedido já teve andamento no atendimento e agora passa por uma última organização interna antes do fechamento.",
      };
    case "RESOLVED":
      return {
        title: "Seu caso foi concluído",
        description:
          "A análise principal do seu pedido foi finalizada. Se ainda houver necessidade, a equipe pode complementar o retorno.",
      };
    case "CLOSED":
      return {
        title: "Seu atendimento foi encerrado",
        description:
          "Esse pedido já foi finalizado no sistema. Se surgir uma nova necessidade, você pode abrir outra solicitação.",
      };
    case "CANCELLED":
      return {
        title: "Seu pedido foi cancelado",
        description:
          "Esse pedido não seguiu em frente no sistema. Se precisar, você pode enviar uma nova solicitação.",
      };
    default:
      return {
        title: "Seu caso está em acompanhamento",
        description:
          "Sua solicitação continua em andamento no projeto e pode receber novos passos em breve.",
      };
  }
}

export default function AcompanharPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [cachedRequest, setCachedRequest] = useState<CachedPublicRequest | null>(() =>
    getCachedPublicRequest(),
  );
  const [contact, setContact] = useState(() => {
    const cached = getCachedPublicRequest();
    return cached ? cached.email || cached.phone : "";
  });
  const [result, setResult] = useState<TrackedRequestResponse | null>(null);

  const trackMutation = useMutation({
    mutationFn: (value: string) => requestsService.track(value),
    onSuccess: (data) => setResult(data),
    onError: (error) => {
      setResult(null);
      toast.error(
        getErrorMessage(
          error,
          "Não foi possível consultar agora. Tente novamente em instantes.",
        ),
      );
    },
  });

  const journey = result ? getJourneyCopy(result) : null;
  const currentStepIndex = result?.case
    ? Math.max(STATUS_FLOW.indexOf(result.case.status as (typeof STATUS_FLOW)[number]), 0)
    : 0;

  const journeySteps = [
    { label: "Pedido recebido", index: 0 },
    { label: "Em análise", index: 1 },
    { label: "Caso assumido", index: 2 },
    { label: "Em andamento", index: 3 },
  ];

  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl space-y-10 px-4 py-12 md:px-6 md:py-16">
        <PageHeader
          eyebrow="Acompanhamento"
          title="Consulte sua solicitação"
          description="Digite o e-mail ou telefone que você usou no pedido. Se este aparelho já enviou uma solicitação, a busca aparece preenchida."
        />

        {cachedRequest ? (
          <div className="rounded-3xl border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <Eyebrow>Último pedido neste aparelho</Eyebrow>
                <p className="font-display text-xl tracking-tight text-[var(--brand-ink)]">
                  {cachedRequest.fullName}
                </p>
                <p className="text-sm text-[var(--brand-mute)]">
                  {cachedRequest.email || cachedRequest.phone}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const preferredContact = cachedRequest.email || cachedRequest.phone;
                    setContact(preferredContact);
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  Usar este contato
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    clearCachedPublicRequest();
                    setCachedRequest(null);
                    setContact("");
                    setResult(null);
                  }}
                >
                  Esquecer neste aparelho
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (contact.trim()) trackMutation.mutate(contact);
          }}
          className="rounded-3xl border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--brand-mute)]" />
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="seu@email.com ou (00) 00000-0000"
                className="pl-10"
                autoFocus={!cachedRequest}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={!contact.trim() || trackMutation.isPending}
            >
              {trackMutation.isPending ? "Buscando..." : "Consultar pedido"}
            </Button>
          </div>
        </form>

        {result ? (
          <div className="space-y-5 rounded-3xl border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CaseStatusBadge status={result.case?.status ?? "NEW"} size="lg" />
              <span className="text-xs font-medium text-[var(--brand-mute)]">
                Recebido em {formatDateTime(result.createdAt)}
              </span>
            </div>

            <div className="rounded-2xl bg-[var(--brand-paper-deep)]/60 p-6">
              <Eyebrow>Acompanhamento do pedido</Eyebrow>
              <h2 className="mt-2 font-display text-3xl leading-tight tracking-tight text-[var(--brand-ink)]">
                {journey?.title}
              </h2>
              <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[var(--brand-mute)]">
                {journey?.description}
              </p>
            </div>

            <div className="space-y-1">
              <Eyebrow tone="mute">{CATEGORY_LABEL[result.category]}</Eyebrow>
              <h3 className="font-display text-xl tracking-tight text-[var(--brand-ink)]">
                {result.fullName}
              </h3>
              {result.preferredChannel ? (
                <p className="text-sm text-[var(--brand-mute)]">
                  Canal preferido:{" "}
                  <span className="font-semibold text-[var(--brand-ink)]">
                    {PREFERRED_CHANNEL_LABEL[result.preferredChannel]}
                  </span>
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {journeySteps.map((step) => {
                const done = currentStepIndex >= step.index;
                const current = currentStepIndex === step.index;
                return (
                  <div
                    key={step.label}
                    className={cn(
                      "rounded-2xl border px-4 py-4 text-sm",
                      current
                        ? "border-[var(--brand-orange)] bg-[var(--brand-orange-ghost)] text-[var(--brand-ink)]"
                        : done
                          ? "border-[color:var(--brand-soft-line)] bg-white text-[var(--brand-ink)]"
                          : "border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/50 text-[var(--brand-mute)]",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-3 flex size-7 items-center justify-center rounded-full text-xs font-bold",
                        done
                          ? "bg-[var(--brand-orange)] text-white"
                          : "bg-[var(--brand-paper-deep)] text-[var(--brand-mute)]",
                      )}
                    >
                      {step.index + 1}
                    </div>
                    <p className="font-semibold">{step.label}</p>
                  </div>
                );
              })}
            </div>

            {result.case ? (
              <dl className="grid gap-3 text-sm md:grid-cols-2">
                <DetailCell label="Código interno" value={result.case.code} mono />
                <DetailCell
                  label="Atualizado em"
                  value={formatDateTime(result.case.updatedAt)}
                />
                <DetailCell
                  label="Responsável atual"
                  value={result.case.assigneeName || "Equipe do projeto"}
                />
                <DetailCell
                  label="Próximo passo esperado"
                  value={
                    result.case.status === "WAITING_USER"
                      ? "Responder ou complementar as informações pedidas."
                      : "Aguardar a análise e o contato da equipe do projeto."
                  }
                />
              </dl>
            ) : (
              <Callout tone="info">
                Sua solicitação foi registrada e aguarda tratamento inicial. Em breve a
                equipe avança para a análise do caso.
              </Callout>
            )}
          </div>
        ) : (
          <Callout tone="note" title="O que informar aqui?">
            O e-mail ou telefone que você preencheu ao enviar o pedido. Se informou os
            dois, qualquer um funciona.
          </Callout>
        )}
      </section>
    </PublicShell>
  );
}

function DetailCell({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/40 px-4 py-3">
      <dt className="font-eyebrow text-[var(--brand-mute)]">{label}</dt>
      <dd
        className={cn(
          "mt-1 text-[var(--brand-night)]",
          mono && "font-mono text-[var(--brand-ink)]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
