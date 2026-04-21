"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/feedback/page-header";
import { PublicShell } from "@/components/layout/public-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/api/client";
import { CATEGORY_OPTIONS, PREFERRED_CHANNEL_OPTIONS } from "@/lib/constants/domain";
import {
  getCachedPublicRequest,
  saveCachedPublicRequest,
} from "@/lib/public-request-cache";
import { cn } from "@/lib/utils";
import { requestsService } from "@/services/requests";
import type { AttendanceChannel, CaseCategory } from "@/types/api";

const categoryValues = CATEGORY_OPTIONS.map((option) => option.value) as [
  CaseCategory,
  ...CaseCategory[],
];

const channelValues = PREFERRED_CHANNEL_OPTIONS.map((option) => option.value) as [
  AttendanceChannel,
  ...AttendanceChannel[],
];

const requestSchema = z.object({
  fullName: z.string().min(3, "Digite seu nome completo."),
  phone: z.string().min(8, "Informe um telefone com DDD."),
  email: z.string().email("Digite um e-mail valido.").optional().or(z.literal("")),
  cpf: z
    .string()
    .regex(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Use 11 digitos ou 000.000.000-00.")
    .optional()
    .or(z.literal("")),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  preferredChannel: z.enum(channelValues),
  category: z.enum(categoryValues),
  description: z.string().min(10, "Conte com um pouco mais de detalhe."),
  consentAccepted: z.boolean().refine((value) => value, "E preciso aceitar para enviar."),
});

type RequestValues = z.infer<typeof requestSchema>;

function Field({
  label,
  children,
  error,
  hint,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-[13px] font-medium text-brand-ink">{label}</label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export default function QueroAjudaPage() {
  const cachedRequest = getCachedPublicRequest();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      cpf: "",
      city: "",
      state: "",
      preferredChannel: "WHATSAPP",
      category: "ABERTURA_MEI",
      description: "",
      consentAccepted: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: (values: RequestValues) =>
      requestsService.submit({
        ...values,
        email: values.email || undefined,
        cpf: values.cpf || undefined,
        city: values.city || undefined,
        state: values.state?.toUpperCase() || undefined,
      }),
    onSuccess: (data, values) => {
      saveCachedPublicRequest({
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        category: values.category,
        requestId: data.requestId,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
      toast.success("Solicitacao recebida com sucesso.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Nao foi possivel enviar sua solicitacao."));
    },
  });

  const phone = useWatch({
    control: form.control,
    name: "phone",
  });
  const email = useWatch({
    control: form.control,
    name: "email",
  });
  const preferredChannel = useWatch({
    control: form.control,
    name: "preferredChannel",
  });

  if (submitted) {
    return (
      <PublicShell>
        <section className="mx-auto max-w-2xl space-y-6 px-4 py-14 md:px-6">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="size-6 text-emerald-700" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-emerald-900">Pedido recebido!</h1>
            <p className="mt-2 text-sm leading-6 text-emerald-800/80">
              Seu caso entrou na fila do projeto. Um aluno extensionista vai assumir e acompanhar o atendimento.
            </p>
            <p className="mt-2 text-xs text-emerald-800/70">
              Este aparelho vai lembrar seus dados para facilitar o acompanhamento depois.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-brand-line/60 bg-white/80 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
              Como acompanhar
            </p>
            <p className="text-sm leading-6 text-brand-night/85">
              Use o <strong>e-mail</strong> ou <strong>telefone</strong> que voce cadastrou para consultar o status na tela de acompanhamento.
            </p>
            <div className="grid gap-2 rounded-xl bg-brand-paper/60 px-4 py-3 text-sm">
              {phone ? (
                <div className="flex justify-between">
                  <span className="text-brand-night/55">Telefone</span>
                  <span className="font-medium text-brand-ink">{phone}</span>
                </div>
              ) : null}
              {email ? (
                <div className="flex justify-between">
                  <span className="text-brand-night/55">E-mail</span>
                  <span className="font-medium text-brand-ink">{email}</span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/acompanhar" className={cn(buttonVariants(), "flex-1 justify-center")}>
                Acompanhar pedido
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
                className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center")}
              >
                Novo pedido
              </button>
            </div>
          </div>
        </section>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-10 md:px-6 md:py-14">
        <PageHeader
          eyebrow="Atendimento publico"
          title="Conte o que voce precisa"
          description="Preencha o formulario. O pedido entra na fila e voce acompanha pelo e-mail ou telefone informados."
        />

        {cachedRequest ? (
          <div className="rounded-[2rem] border border-brand-orange/20 bg-[#fff3ea] p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
                  <AlertCircle className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
                    Pedido em andamento encontrado
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-brand-ink">
                    Ja existe uma solicitacao salva neste aparelho
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-brand-night/80">
                    Se esse ainda for o seu caso atual, o melhor caminho e acompanhar a evolucao do pedido existente. Se voce precisar tratar outro assunto, ainda pode abrir uma nova solicitacao abaixo.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ultimo contato salvo: {cachedRequest.email || cachedRequest.phone}
                  </p>
                </div>
              </div>

              <Link
                href="/acompanhar"
                className={cn(buttonVariants({ size: "lg" }), "shrink-0 rounded-full")}
              >
                Ver pedido em andamento
              </Link>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-brand-line/60 bg-white/80 p-6 md:p-8">
            <form className="space-y-6" onSubmit={form.handleSubmit((values) => submitMutation.mutate(values))}>
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                  Identificacao
                </p>
                <Field label="Nome completo" error={form.formState.errors.fullName?.message}>
                  <Input placeholder="Seu nome" {...form.register("fullName")} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Telefone *"
                    hint="Obrigatorio - usado para identificar seu pedido"
                    error={form.formState.errors.phone?.message}
                  >
                    <Input placeholder="(00) 00000-0000" {...form.register("phone")} />
                  </Field>
                  <Field
                    label="E-mail"
                    hint="Opcional - tambem serve para localizar seu pedido"
                    error={form.formState.errors.email?.message}
                  >
                    <Input placeholder="voce@exemplo.com" {...form.register("email")} />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="CPF" hint="Opcional" error={form.formState.errors.cpf?.message}>
                    <Input placeholder="000.000.000-00" {...form.register("cpf")} />
                  </Field>
                  <div className="grid grid-cols-[1fr_80px] gap-4">
                    <Field label="Cidade">
                      <Input placeholder="Sua cidade" {...form.register("city")} />
                    </Field>
                    <Field label="UF">
                      <Input placeholder="SP" maxLength={2} {...form.register("state")} />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-brand-line/50 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                  Como prefere ser atendido?
                </p>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {PREFERRED_CHANNEL_OPTIONS.map((option) => {
                    const checked = preferredChannel === option.value;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors",
                          checked
                            ? "border-brand-orange bg-brand-orange/5 text-brand-ink"
                            : "border-brand-line/60 bg-white/60 text-brand-night/80 hover:border-brand-orange/40",
                        )}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...form.register("preferredChannel")}
                          className="mt-0.5 accent-brand-orange"
                        />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 border-t border-brand-line/50 pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                  Sua duvida
                </p>
                <Field label="Assunto">
                  <select
                    className="h-10 w-full rounded-xl border border-brand-line bg-white px-3 text-sm outline-none focus-visible:border-brand-orange focus-visible:ring-3 focus-visible:ring-brand-orange/20"
                    {...form.register("category")}
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Explique sua duvida"
                  hint="Ex.: quero abrir meu MEI, mas nao sei se minha atividade e permitida."
                  error={form.formState.errors.description?.message}
                >
                  <Textarea rows={5} {...form.register("description")} />
                </Field>
              </div>

              <div className="space-y-3 border-t border-brand-line/50 pt-6">
                <label className="flex items-start gap-3 rounded-xl bg-brand-paper/70 px-4 py-3 text-sm leading-6 text-brand-night">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-brand-orange"
                    {...form.register("consentAccepted")}
                  />
                  <span>Concordo em enviar meus dados para atendimento e acompanhamento da solicitacao.</span>
                </label>

                <Button type="submit" size="lg" className="w-full" disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? "Enviando..." : "Enviar solicitacao"}
                </Button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-brand-line/60 bg-white/70 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                O que acontece depois
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-brand-night/85">
                {[
                  "Seu pedido entra na fila do projeto.",
                  "Um aluno extensionista assume o caso.",
                  "Um professor supervisiona o atendimento.",
                  "Voce acompanha pelo e-mail ou telefone informado.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-[11px] font-semibold text-brand-orange">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Callout tone="note">
              Abrir MEI no canal oficial e gratuito. Se a duvida envolver cobranca suspeita, selecione{" "}
              Cobranca suspeita ou golpe.
            </Callout>

            <div className="rounded-3xl border border-brand-line/60 bg-white/70 p-6 text-sm leading-6 text-brand-night/85">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                Contato do projeto
              </p>
              <p className="mt-3">R. Mario Santos Braga, 30 - Centro, Niteroi</p>
              <a href="mailto:empreendedor.uff@gmail.com" className="mt-1 block hover:text-brand-orange">
                empreendedor.uff@gmail.com
              </a>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
