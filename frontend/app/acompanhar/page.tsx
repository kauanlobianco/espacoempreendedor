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
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/client";
import { CATEGORY_LABEL, PREFERRED_CHANNEL_LABEL } from "@/lib/constants/domain";
import { formatDateTime } from "@/lib/formatters";
import {
  clearCachedPublicRequest,
  getCachedPublicRequest,
  type CachedPublicRequest,
} from "@/lib/public-request-cache";
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
        "Seu caso entrou na fila do projeto e esta aguardando a primeira analise. Em breve nossa equipe olha as informacoes e segue para o proximo passo.",
    };
  }

  switch (caseData.status) {
    case "NEW":
      return {
        title: "Seu pedido esta sendo analisado",
        description:
          "Recebemos suas informacoes e seu caso esta na fila de atendimento. Em breve ele sera avaliado pela equipe do projeto.",
      };
    case "TRIAGED":
      return {
        title: "Seu caso avancou para triagem",
        description:
          "Sua solicitacao ja esta em avaliacao inicial para entendermos melhor a demanda e encaminhar do jeito certo.",
      };
    case "ASSIGNED":
      return {
        title: caseData.assigneeName
          ? `${caseData.assigneeName} assumiu seu caso`
          : "Seu caso foi assumido pela equipe",
        description:
          "Seu pedido ja esta com uma pessoa do projeto. Em breve entraremos em contato caso seja preciso confirmar ou complementar alguma informacao.",
      };
    case "IN_PROGRESS":
      return {
        title: "Seu atendimento esta em andamento",
        description:
          "Seu caso esta sendo acompanhado pela equipe. Em breve voce pode receber contato com orientacoes ou pedido de mais informacoes.",
      };
    case "WAITING_USER":
      return {
        title: "Estamos aguardando um retorno seu",
        description:
          "Ja houve analise do seu caso e agora a equipe precisa de uma resposta ou informacao complementar para continuar.",
      };
    case "WAITING_SUPERVISION":
      return {
        title: "Seu caso segue em analise interna",
        description:
          "Seu pedido ja teve andamento no atendimento e agora passa por uma ultima organizacao interna antes do fechamento.",
      };
    case "RESOLVED":
      return {
        title: "Seu caso foi concluido",
        description:
          "A analise principal do seu pedido foi finalizada. Se ainda houver necessidade, a equipe pode complementar o retorno.",
      };
    case "CLOSED":
      return {
        title: "Seu atendimento foi encerrado",
        description:
          "Esse pedido ja foi finalizado no sistema. Se surgir uma nova necessidade, voce pode abrir outra solicitacao.",
      };
    case "CANCELLED":
      return {
        title: "Seu pedido foi cancelado",
        description:
          "Esse pedido nao seguiu em frente no sistema. Se precisar, voce pode enviar uma nova solicitacao.",
      };
    default:
      return {
        title: "Seu caso esta em acompanhamento",
        description:
          "Sua solicitacao continua em andamento no projeto e pode receber novos passos em breve.",
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
          "Nao foi possivel consultar agora. Tente novamente em instantes.",
        ),
      );
    },
  });

  const journey = result ? getJourneyCopy(result) : null;
  const currentStepIndex = result?.case
    ? Math.max(STATUS_FLOW.indexOf(result.case.status as (typeof STATUS_FLOW)[number]), 0)
    : 0;

  return (
    <PublicShell>
      <section className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:px-6 md:py-16">
        <PageHeader
          eyebrow="Acompanhamento"
          title="Consulte sua solicitacao"
          description="Digite o e-mail ou telefone que voce usou no pedido. Se este aparelho ja enviou uma solicitacao, a busca aparece preenchida."
        />

        {cachedRequest ? (
          <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
                  Ultimo pedido neste aparelho
                </p>
                <p className="mt-1 text-sm font-semibold text-brand-ink">{cachedRequest.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {cachedRequest.email || cachedRequest.phone}
                </p>
              </div>
              <div className="flex gap-2">
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
          className="rounded-2xl border border-brand-line/60 bg-white/80 p-4"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="seu@email.com ou (00) 00000-0000"
                className="pl-9"
                autoFocus={!cachedRequest}
              />
            </div>
            <Button type="submit" disabled={!contact.trim() || trackMutation.isPending}>
              {trackMutation.isPending ? "Buscando..." : "Consultar"}
            </Button>
          </div>
        </form>

        {result ? (
          <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CaseStatusBadge status={result.case?.status ?? "NEW"} />
              <span className="text-xs font-medium text-muted-foreground">
                Recebido em {formatDateTime(result.createdAt)}
              </span>
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-brand-paper/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
                Acompanhamento do pedido
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink">
                {journey?.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                {journey?.description}
              </p>
            </div>

            <div className="mt-5 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                {CATEGORY_LABEL[result.category]}
              </p>
              <h2 className="text-xl font-semibold text-brand-ink">{result.fullName}</h2>
            </div>

            {result.preferredChannel ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Canal preferido:{" "}
                <span className="font-medium text-brand-ink">
                  {PREFERRED_CHANNEL_LABEL[result.preferredChannel]}
                </span>
              </p>
            ) : null}

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {[
                {
                  label: "Pedido recebido",
                  done: currentStepIndex >= 0,
                },
                {
                  label: "Em analise",
                  done: currentStepIndex >= 1,
                },
                {
                  label: "Caso assumido",
                  done: currentStepIndex >= 2,
                },
                {
                  label: "Em andamento",
                  done: currentStepIndex >= 3,
                },
              ].map((step, index) => (
                <div
                  key={step.label}
                  className={`rounded-xl px-4 py-4 text-sm ${
                    step.done ? "bg-[#fff1e8] text-brand-ink" : "bg-white text-muted-foreground"
                  }`}
                >
                  <div
                    className={`mb-3 flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                      step.done
                        ? "bg-brand-orange text-white"
                        : "bg-brand-paper text-brand-night/60"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="font-medium">{step.label}</p>
                </div>
              ))}
            </div>

            {result.case ? (
              <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-xl bg-brand-paper/70 px-4 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-night/60">
                    Codigo interno
                  </dt>
                  <dd className="mt-1 font-mono text-brand-ink">{result.case.code}</dd>
                </div>
                <div className="rounded-xl bg-brand-paper/70 px-4 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-night/60">
                    Atualizado em
                  </dt>
                  <dd className="mt-1 text-brand-night/85">{formatDateTime(result.case.updatedAt)}</dd>
                </div>
                <div className="rounded-xl bg-brand-paper/70 px-4 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-night/60">
                    Responsavel atual
                  </dt>
                  <dd className="mt-1 text-brand-night/85">
                    {result.case.assigneeName || "Equipe do projeto"}
                  </dd>
                </div>
                <div className="rounded-xl bg-brand-paper/70 px-4 py-3">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-night/60">
                    Proximo passo esperado
                  </dt>
                  <dd className="mt-1 text-brand-night/85">
                    {result.case.status === "WAITING_USER"
                      ? "Responder ou complementar as informacoes pedidas."
                      : "Aguardar a analise e o contato da equipe do projeto."}
                  </dd>
                </div>
              </dl>
            ) : (
              <Callout tone="info" className="mt-5">
                Sua solicitacao foi registrada e aguarda tratamento inicial. Em breve a equipe avanca para a analise do caso.
              </Callout>
            )}
          </div>
        ) : (
          <Callout tone="note" title="O que informar aqui?">
            O e-mail ou telefone que voce preencheu ao enviar o pedido. Se informou os dois, qualquer um funciona.
          </Callout>
        )}
      </section>
    </PublicShell>
  );
}
