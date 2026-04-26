import Link from "next/link";
import {
  ArrowRight,
  Compass,
  HandHeart,
  HeartHandshake,
  ListChecks,
  ShieldAlert,
  Sparkles,
  Sprout,
} from "lucide-react";

import { SectionHeader } from "@/components/feedback/section-header";
import { PublicShell } from "@/components/layout/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

const HELP_TOPICS = [
  {
    icon: Compass,
    title: "Por onde começar",
    description: "Um primeiro caminho, sem pressa e sem promessa milagrosa.",
  },
  {
    icon: ListChecks,
    title: "Organizar o trabalho",
    description: "Ideias simples para separar contas, ganhos e tarefas do dia.",
  },
  {
    icon: Sparkles,
    title: "Informação confiável",
    description: "Conteúdo baseado em fontes oficiais, em linguagem simples.",
  },
  {
    icon: ShieldAlert,
    title: "Cuidado com golpes",
    description: "Como reconhecer cobranças indevidas e mensagens suspeitas.",
  },
];

const SUPPORT = [
  "Capacitações e cursos gratuitos voltados a mulheres",
  "Espaços de troca com outras empreendedoras",
  "Orientação inicial sobre formalização",
  "Encaminhamento para canais oficiais quando o caso pede",
];

export default function MulheresEmpreendedorasPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl space-y-14 px-4 py-10 md:px-6 md:py-16">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--brand-soft-line)] bg-white p-8 shadow-soft md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-[320px] rounded-full opacity-60 radial-orange-orb"
          />
          <div className="relative z-10 max-w-2xl">
            <Eyebrow>Para mulheres empreendedoras</Eyebrow>
            <h1 className="mt-4 font-display text-[40px] leading-[1.05] tracking-[-0.03em] text-[var(--brand-ink)] md:text-[56px]">
              Você não precisa{" "}
              <em className="not-italic text-[var(--brand-orange)]">empreender sozinha.</em>
            </h1>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-[var(--brand-mute)]">
              Um espaço de orientação, escuta e direcionamento para mulheres que estão começando,
              trabalham por conta própria ou querem dar o próximo passo com mais segurança.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/quero-ajuda" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
                Pedir orientação
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sobre"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Conhecer o projeto
              </Link>
            </div>
          </div>
        </div>

        {/* Como podemos ajudar */}
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Como podemos ajudar"
            title="Apoio simples para o dia a dia"
            description="Pequenos passos que tiram dúvidas comuns e dão clareza para seguir em frente."
          />

          <div className="grid gap-3 md:grid-cols-2">
            {HELP_TOPICS.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-[20px] border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
                  <item.icon className="size-5" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-[15.5px] font-semibold tracking-tight text-[var(--brand-ink)]">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] leading-6 text-[var(--brand-mute)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apoio e oportunidades */}
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <Eyebrow>Apoio e oportunidades</Eyebrow>
            <h2 className="font-display text-[30px] leading-tight tracking-tight text-[var(--brand-ink)] md:text-[34px]">
              Existem caminhos confiáveis pensados para mulheres.
            </h2>
            <p className="text-[14.5px] leading-relaxed text-[var(--brand-mute)]">
              Capacitações, redes de apoio e orientação institucional ajudam a tirar a ideia do
              papel com mais confiança. Se quiser, podemos te indicar por onde seguir.
            </p>
          </div>

          <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/55 p-6 md:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-[var(--brand-orange-deep)] shadow-soft">
                <Sprout className="size-5" />
              </span>
              <p className="font-eyebrow text-[var(--brand-mute)]">O que costuma ajudar</p>
            </div>
            <ul className="mt-4 space-y-2.5">
              {SUPPORT.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] leading-6 text-[var(--brand-night)]">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--brand-orange)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cuidado e segurança */}
        <div className="rounded-[28px] border border-[color:rgba(178,113,0,0.22)] bg-[color:rgba(178,113,0,0.06)] p-6 shadow-soft md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[color:rgba(178,113,0,0.14)] text-[var(--brand-amber)]">
              <ShieldAlert className="size-5" />
            </span>
            <div className="space-y-2">
              <h2 className="font-display text-[24px] leading-tight tracking-tight text-[var(--brand-ink)] md:text-[26px]">
                Cuidado com promessas e cobranças.
              </h2>
              <p className="max-w-2xl text-[14.5px] leading-relaxed text-[var(--brand-night)]">
                Empreender envolve responsabilidade. Desconfie de mensagens com pressa,{" "}
                cobranças que não vêm de canais oficiais e promessas de ganho rápido. Em caso de
                dúvida, pergunte antes de pagar.
              </p>
              <Link
                href="/informacoes/golpes"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--brand-orange-deep)] hover:text-[var(--brand-orange)]"
              >
                Ver sinais de alerta
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="relative overflow-hidden rounded-[32px] bg-[var(--brand-ink)] p-8 text-white shadow-lift md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -bottom-24 size-[280px] rounded-full opacity-50 radial-orange-orb"
          />
          <div className="relative z-10 grid gap-6 md:grid-cols-[1.2fr_auto] md:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[12px] font-semibold text-white/70">
                <HeartHandshake className="size-3.5 text-[var(--brand-orange)]" />
                Atendimento gratuito
              </div>
              <h2 className="font-display text-[28px] leading-tight tracking-tight md:text-[34px]">
                Conta pra gente o que está te travando.
              </h2>
              <p className="max-w-xl text-[14.5px] leading-relaxed text-white/70">
                Uma pessoa do projeto vai te ouvir e te ajudar a entender o próximo passo. Sem
                cobrança, sem julgamento e na sua linguagem.
              </p>
            </div>

            <Link
              href="/quero-ajuda"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-6 text-[14.5px] font-semibold text-white shadow-[0_14px_28px_rgba(232,93,31,0.32)] transition hover:bg-[var(--brand-orange-deep)]"
            >
              <HandHeart className="size-4" />
              Pedir ajuda agora
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
