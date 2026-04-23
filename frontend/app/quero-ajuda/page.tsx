"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/feedback/page-header";
import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
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
  email: z.string().email("Digite um e-mail válido.").optional().or(z.literal("")),
  cpf: z
    .string()
    .regex(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Use 11 dígitos ou 000.000.000-00.")
    .optional()
    .or(z.literal("")),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  preferredChannel: z.enum(channelValues),
  category: z.enum(categoryValues),
  description: z.string().min(10, "Conte com um pouco mais de detalhe."),
  consentAccepted: z
    .boolean()
    .refine((value) => value, "É preciso aceitar para enviar."),
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
      <label className="block text-[12.5px] font-semibold tracking-wide text-[var(--brand-night)]">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-[var(--brand-red)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--brand-mute)]">{hint}</p>
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
      toast.success("Solicitação recebida com sucesso.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Não foi possível enviar sua solicitação."));
    },
  });

  const phone = useWatch({ control: form.control, name: "phone" });
  const email = useWatch({ control: form.control, name: "email" });
  const preferredChannel = useWatch({
    control: form.control,
    name: "preferredChannel",
  });

  if (submitted) {
    return (
      <PublicShell>
        <section className="mx-auto max-w-2xl space-y-6 px-4 py-16 md:px-6">
          <div className="rounded-3xl border border-[color:rgba(47,125,91,0.22)] bg-[color:rgba(47,125,91,0.06)] p-8 text-center shadow-soft">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[color:rgba(47,125,91,0.18)] text-[var(--brand-green)]">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="mt-5 font-display text-3xl tracking-tight text-[var(--brand-ink)]">
              Pedido recebido!
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-mute)]">
              Seu caso entrou na fila do projeto. Um aluno extensionista vai
              assumir e acompanhar o atendimento.
            </p>
            <p className="mt-2 text-xs text-[var(--brand-mute)]">
              Este aparelho vai lembrar seus dados para facilitar o acompanhamento depois.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft">
            <Eyebrow>Como acompanhar</Eyebrow>
            <p className="text-[14px] leading-relaxed text-[var(--brand-night)]">
              Use o <strong>e-mail</strong> ou <strong>telefone</strong> que você
              cadastrou para consultar o status na tela de acompanhamento.
            </p>
            <div className="grid gap-2 rounded-2xl bg-[var(--brand-paper-deep)]/60 px-4 py-3 text-sm">
              {phone ? (
                <div className="flex justify-between">
                  <span className="text-[var(--brand-mute)]">Telefone</span>
                  <span className="font-medium text-[var(--brand-ink)]">{phone}</span>
                </div>
              ) : null}
              {email ? (
                <div className="flex justify-between">
                  <span className="text-[var(--brand-mute)]">E-mail</span>
                  <span className="font-medium text-[var(--brand-ink)]">{email}</span>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                render={<Link href="/acompanhar" />}
                size="lg"
                className="flex-1 justify-center"
              >
                Acompanhar pedido
                <ArrowUpRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 justify-center"
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
              >
                Novo pedido
              </Button>
            </div>
          </div>
        </section>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl space-y-10 px-4 py-12 md:px-6 md:py-16">
        <PageHeader
          eyebrow="Atendimento público"
          title="Conte o que você precisa"
          description="Preencha o formulário. O pedido entra na fila e você acompanha pelo e-mail ou telefone informados."
        />

        {cachedRequest ? (
          <div className="rounded-3xl border border-[color:rgba(232,93,31,0.22)] bg-[var(--brand-orange-ghost)] p-5 md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-orange)] text-white">
                  <AlertCircle className="size-5" />
                </div>
                <div className="space-y-1.5">
                  <Eyebrow>Pedido em andamento encontrado</Eyebrow>
                  <h2 className="font-display text-2xl tracking-tight text-[var(--brand-ink)]">
                    Já existe uma solicitação salva neste aparelho
                  </h2>
                  <p className="max-w-2xl text-[14px] leading-relaxed text-[var(--brand-night)]/85">
                    Se este ainda for o seu caso atual, o melhor caminho é acompanhar
                    a evolução do pedido existente. Se precisar tratar outro assunto,
                    ainda pode abrir uma nova solicitação abaixo.
                  </p>
                  <p className="text-xs text-[var(--brand-mute)]">
                    Último contato salvo: {cachedRequest.email || cachedRequest.phone}
                  </p>
                </div>
              </div>

              <Button
                render={<Link href="/acompanhar" />}
                size="lg"
                className="shrink-0"
              >
                Ver pedido em andamento
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-8">
            <form
              className="space-y-8"
              onSubmit={form.handleSubmit((values) => submitMutation.mutate(values))}
            >
              <FormSection eyebrow="Identificação" title="Quem está pedindo">
                <Field label="Nome completo" error={form.formState.errors.fullName?.message}>
                  <Input placeholder="Seu nome" {...form.register("fullName")} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Telefone *"
                    hint="Obrigatório — usado para identificar seu pedido"
                    error={form.formState.errors.phone?.message}
                  >
                    <Input placeholder="(00) 00000-0000" {...form.register("phone")} />
                  </Field>
                  <Field
                    label="E-mail"
                    hint="Opcional — também serve para localizar seu pedido"
                    error={form.formState.errors.email?.message}
                  >
                    <Input placeholder="voce@exemplo.com" {...form.register("email")} />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="CPF" hint="Opcional" error={form.formState.errors.cpf?.message}>
                    <Input placeholder="000.000.000-00" {...form.register("cpf")} />
                  </Field>
                  <div className="grid grid-cols-[1fr_84px] gap-4">
                    <Field label="Cidade">
                      <Input placeholder="Sua cidade" {...form.register("city")} />
                    </Field>
                    <Field label="UF">
                      <Input placeholder="SP" maxLength={2} {...form.register("state")} />
                    </Field>
                  </div>
                </div>
              </FormSection>

              <FormSection
                eyebrow="Atendimento"
                title="Como prefere ser atendido?"
              >
                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                  {PREFERRED_CHANNEL_OPTIONS.map((option) => {
                    const checked = preferredChannel === option.value;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-sm transition-colors",
                          checked
                            ? "border-[var(--brand-orange)] bg-[var(--brand-orange-ghost)] text-[var(--brand-ink)]"
                            : "border-[color:var(--brand-soft-line)] bg-white text-[var(--brand-night)]/80 hover:border-[color:var(--brand-line)]",
                        )}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...form.register("preferredChannel")}
                          className="mt-1 size-4 accent-[var(--brand-orange)]"
                        />
                        <div>
                          <p className="font-semibold">{option.label}</p>
                          <p className="text-xs text-[var(--brand-mute)]">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </FormSection>

              <FormSection eyebrow="Sua dúvida" title="Sobre o que precisa de ajuda">
                <Field label="Assunto">
                  <select
                    className="h-11 w-full rounded-xl border border-[color:var(--brand-line)] bg-white px-3 text-sm text-[var(--brand-ink)] outline-none focus-visible:border-[var(--brand-orange)] focus-visible:ring-3 focus-visible:ring-[color:rgba(232,93,31,0.18)]"
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
                  label="Explique sua dúvida"
                  hint="Ex.: quero abrir meu MEI, mas não sei se minha atividade é permitida."
                  error={form.formState.errors.description?.message}
                >
                  <Textarea rows={5} {...form.register("description")} />
                </Field>
              </FormSection>

              <div className="space-y-4 border-t border-[color:var(--brand-soft-line)] pt-6">
                <label className="flex items-start gap-3 rounded-2xl bg-[var(--brand-paper-deep)]/70 px-4 py-3.5 text-sm leading-6 text-[var(--brand-night)]">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-[var(--brand-orange)]"
                    {...form.register("consentAccepted")}
                  />
                  <span>
                    Concordo em enviar meus dados para atendimento e acompanhamento
                    da solicitação.
                  </span>
                </label>
                {form.formState.errors.consentAccepted ? (
                  <p className="text-xs text-[var(--brand-red)]">
                    {form.formState.errors.consentAccepted.message}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full justify-center"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Enviando..." : "Enviar solicitação"}
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft">
              <Eyebrow>O que acontece depois</Eyebrow>
              <ol className="mt-4 space-y-3.5 text-[14px] leading-relaxed text-[var(--brand-night)]">
                {[
                  "Seu pedido entra na fila do projeto.",
                  "Um aluno extensionista assume o caso.",
                  "Um professor supervisiona o atendimento.",
                  "Você acompanha pelo e-mail ou telefone informado.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <Pill tone="orange" size="sm">{index + 1}</Pill>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Callout tone="note" title="Sem cobrança">
              Abrir MEI no canal oficial é gratuito. Se a dúvida envolver cobrança
              suspeita, selecione &quot;Cobrança suspeita ou golpe&quot;.
            </Callout>

            <div className="rounded-3xl border border-[color:var(--brand-soft-line)] bg-white p-6 text-[14px] leading-relaxed text-[var(--brand-night)]">
              <Eyebrow>Contato do projeto</Eyebrow>
              <p className="mt-3">R. Mario Santos Braga, 30 — Centro, Niterói</p>
              <a
                href="mailto:empreendedor.uff@gmail.com"
                className="mt-1 block font-semibold text-[var(--brand-orange-deep)] hover:text-[var(--brand-orange)]"
              >
                empreendedor.uff@gmail.com
              </a>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}

function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 border-t border-[color:var(--brand-soft-line)] pt-6 first:border-0 first:pt-0">
      <div className="space-y-1">
        <Eyebrow tone="mute">{eyebrow}</Eyebrow>
        <h3 className="font-display text-xl tracking-tight text-[var(--brand-ink)]">
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
