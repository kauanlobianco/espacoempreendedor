import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  FileSearch,
  HandHelping,
  ShieldAlert,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

import { SectionHeader } from "@/components/feedback/section-header";
import { PublicShell } from "@/components/layout/public-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Pill } from "@/components/ui/pill";
import { FAQ_ITEMS, QUICK_ACTIONS } from "@/lib/constants/domain";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    icon: HandHelping,
    title: "Atendimento humano",
    description:
      "Pedidos entram na fila e são acompanhados por aluno e professor.",
  },
  {
    icon: ShieldAlert,
    title: "Conteúdo seguro",
    description:
      "Baseado em fontes oficiais e revisado por supervisão acadêmica.",
  },
  {
    icon: BadgeCheck,
    title: "Serviço gratuito",
    description: "Mostramos o que é oficial e o que parece cobrança indevida.",
  },
  {
    icon: FileSearch,
    title: "Acompanhamento simples",
    description:
      "Consulte o andamento pelo e-mail ou telefone informado no pedido.",
  },
];

const PROOF_STATS = [
  { value: "+1.200", label: "atendimentos realizados" },
  { value: "82%", label: "resolvidos no primeiro contato" },
  { value: "0,00", label: "custo para o microempreendedor" },
  { value: "UFF", label: "extensão universitária" },
];

const COMMITMENT_ROWS: Array<{
  tone: "green" | "amber" | "red";
  icon: typeof CheckCircle2;
  label: string;
  description: string;
}> = [
  {
    tone: "green",
    icon: CheckCircle2,
    label: "Procedimento oficial",
    description: "Caminhos formais, gratuitos e validados pela legislação.",
  },
  {
    tone: "amber",
    icon: ShieldCheck,
    label: "Apoio privado opcional",
    description:
      "Serviços de terceiros que podem ajudar — mas você não é obrigado a contratar.",
  },
  {
    tone: "red",
    icon: XCircle,
    label: "Cobrança indevida",
    description:
      "Mensagens, boletos e taxas falsas que tentam parecer documento oficial.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      {/* Hero — preserva a imagem aprovada */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 md:px-6 md:pb-20 md:pt-20">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <div className="relative z-10 max-w-xl space-y-7">
              <Pill tone="orange" size="lg" withDot>
                Espaço do Empreendedor · UFF
              </Pill>
              <h1 className="font-display text-[clamp(2.4rem,7.6vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.04em] text-[var(--brand-ink)]">
                Ajuda real para quem quer{" "}
                <em className="not-italic text-[var(--brand-orange)]">empreender.</em>
              </h1>
              <p className="max-w-[34rem] text-[15.5px] leading-relaxed text-[var(--brand-mute)] md:text-[17px] md:leading-8">
                Aqui você entende o que fazer, evita cobrança errada e encontra
                ajuda humana para abrir, organizar ou regularizar seu MEI.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/quero-ajuda"
                  className={cn(
                    "inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--brand-orange)] px-7 text-[15px] font-semibold text-white shadow-[0_18px_36px_rgba(232,93,31,0.28)] transition-all hover:bg-[var(--brand-orange-deep)]",
                  )}
                >
                  Quero ajuda agora
                  <ArrowUpRight className="size-5" />
                </Link>
                <Link
                  href="/acompanhar"
                  className="inline-flex items-center justify-center gap-2 text-[15px] font-semibold text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-orange-deep)] sm:justify-start"
                >
                  Acompanhar pedido
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[20rem] w-full sm:min-h-[26rem] lg:min-h-[36rem]">
              <div className="pointer-events-none absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_52%_62%,rgba(28,23,20,0.08),transparent_36%)] blur-3xl" />
              <Image
                src="/hero/espaco-empreendedor-hero-v4.png"
                alt="Pavilhão do Espaço do Empreendedor"
                fill
                priority
                className="scale-[1.18] object-contain object-center drop-shadow-[0_28px_40px_rgba(28,23,20,0.16)] sm:scale-[1.24] lg:scale-[1.28]"
                sizes="(min-width: 1024px) 56rem, 100vw"
              />
            </div>
          </div>
        </div>

        {/* Proof stats */}
        <div className="border-y border-[color:var(--brand-soft-line)] bg-[color:rgba(255,255,255,0.55)]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-4 py-7 md:grid-cols-4 md:px-6">
            {PROOF_STATS.map((stat) => (
              <div key={stat.label} className="space-y-1 text-center md:text-left">
                <p className="font-display text-3xl tracking-tight text-[var(--brand-ink)] md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-mute)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="group flex flex-col gap-4 rounded-3xl border border-[color:var(--brand-soft-line)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
                <pillar.icon className="size-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-[15.5px] font-semibold tracking-tight text-[var(--brand-ink)]">
                  {pillar.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-[var(--brand-mute)]">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Por onde começar */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <SectionHeader
          eyebrow="Por onde começar"
          title="Escolha o caminho mais próximo da sua dúvida"
          description="Conteúdo curto, direto e pensado para ler no celular."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map((action, idx) => {
            const highlight = idx === 0;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "group/card flex h-full flex-col justify-between gap-6 rounded-3xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft",
                  highlight
                    ? "border-transparent bg-[var(--brand-ink)] text-white shadow-lift"
                    : "border-[color:var(--brand-soft-line)] bg-white text-[var(--brand-ink)]",
                )}
              >
                <div className="space-y-3">
                  <div
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-xl",
                      highlight
                        ? "bg-[color:rgba(232,93,31,0.18)] text-[var(--brand-orange)]"
                        : "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]",
                    )}
                  >
                    <ArrowRight className="size-4" />
                  </div>
                  <h3
                    className={cn(
                      "font-display text-[1.35rem] leading-tight tracking-tight",
                      highlight ? "text-white" : "text-[var(--brand-ink)]",
                    )}
                  >
                    {action.title}
                  </h3>
                  <p
                    className={cn(
                      "text-[13.5px] leading-relaxed",
                      highlight ? "text-white/70" : "text-[var(--brand-mute)]",
                    )}
                  >
                    {action.description}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[13px] font-semibold transition-transform group-hover/card:translate-x-0.5",
                    highlight
                      ? "text-[var(--brand-orange)]"
                      : "text-[var(--brand-orange-deep)]",
                  )}
                >
                  Abrir guia
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Compromisso — banda escura */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--brand-ink)] p-8 text-white shadow-lift md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 size-[440px] opacity-50 radial-orange-orb"
          />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-5">
              <Eyebrow tone="orange">Compromisso</Eyebrow>
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-[40px]">
                Sem juridiquês, sem pressão,{" "}
                <em className="not-italic text-[var(--brand-orange)]">sem aparência de golpe.</em>
              </h2>
              <p className="max-w-md text-[14.5px] leading-relaxed text-white/70">
                A plataforma diferencia procedimento oficial, apoio privado opcional e
                cobrança indevida — para reduzir risco para quem está começando.
              </p>
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--brand-orange)] hover:text-white"
              >
                Conhecer o projeto
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid gap-3">
              {COMMITMENT_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      row.tone === "green" && "bg-[color:rgba(47,125,91,0.18)] text-[var(--brand-green)]",
                      row.tone === "amber" && "bg-[color:rgba(178,113,0,0.18)] text-[var(--brand-amber)]",
                      row.tone === "red" && "bg-[color:rgba(168,42,31,0.18)] text-[var(--brand-red)]",
                    )}
                  >
                    <row.icon className="size-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-[14.5px] font-semibold text-white">{row.label}</p>
                    <p className="text-[13px] leading-relaxed text-white/65">
                      {row.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + Atendimento */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Dúvidas frequentes"
              title="Respostas rápidas para as principais dúvidas do MEI"
            />
            <div className="rounded-3xl border border-[color:var(--brand-soft-line)] bg-white px-6">
              <Accordion>
                {FAQ_ITEMS.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-3xl border border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/50 p-7">
            <Eyebrow>Atendimento assistido</Eyebrow>
            <h3 className="font-display text-3xl leading-tight tracking-tight text-[var(--brand-ink)]">
              Precisa falar com alguém do projeto?
            </h3>
            <p className="text-[14.5px] leading-relaxed text-[var(--brand-mute)]">
              Abra uma solicitação gratuita e acompanhe o andamento pelo e-mail ou
              telefone que você informar. Se preferir, agende um horário com a equipe.
            </p>
            <ul className="space-y-2.5 pt-1 text-[13.5px] text-[var(--brand-night)]">
              <li className="flex items-center gap-2">
                <Users className="size-4 text-[var(--brand-orange-deep)]" />
                Atendimento por aluno extensionista com supervisão.
              </li>
              <li className="flex items-center gap-2">
                <CalendarClock className="size-4 text-[var(--brand-orange-deep)]" />
                Resposta em até 2 dias úteis.
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[var(--brand-orange-deep)]" />
                Sem cobrança em nenhuma etapa.
              </li>
            </ul>
            <div className="mt-auto flex flex-col gap-2.5 pt-2 sm:flex-row">
              <Button
                render={<Link href="/quero-ajuda" />}
                size="lg"
                className="flex-1 justify-center"
              >
                Pedir ajuda
                <ArrowUpRight className="size-4" />
              </Button>
              <Button
                render={<Link href="/acompanhar" />}
                variant="outline"
                size="lg"
                className="flex-1 justify-center"
              >
                Acompanhar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vídeo explicativo */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2 text-center">
            <Eyebrow>Vídeo rápido</Eyebrow>
            <h2 className="font-display text-3xl tracking-tight text-[var(--brand-ink)] md:text-4xl">
              Veja um passo a passo em vídeo
            </h2>
          </div>

          <div className="rounded-[1.9rem] border border-[color:var(--brand-soft-line)] bg-white p-2 shadow-soft sm:p-2.5">
            <div className="relative aspect-video overflow-hidden rounded-[1.55rem] bg-[var(--brand-paper-deep)]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/InoidBAJZ98"
                title="Vídeo explicativo sobre MEI"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
