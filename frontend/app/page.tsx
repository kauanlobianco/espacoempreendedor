import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileSearch,
  HandHelping,
  ShieldAlert,
} from "lucide-react";

import { SectionHeader } from "@/components/feedback/section-header";
import { PublicShell } from "@/components/layout/public-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { FAQ_ITEMS, QUICK_ACTIONS } from "@/lib/constants/domain";
import { cn } from "@/lib/utils";

const PILLARS = [
  {
    icon: HandHelping,
    title: "Atendimento humano",
    description: "Pedidos entram na fila e sao acompanhados por aluno e professor.",
  },
  {
    icon: ShieldAlert,
    title: "Conteudo seguro",
    description: "Baseado em fontes oficiais e revisado por supervisao academica.",
  },
  {
    icon: BadgeCheck,
    title: "Servico gratuito",
    description: "Mostramos o que e oficial e o que parece cobranca indevida.",
  },
  {
    icon: FileSearch,
    title: "Acompanhamento simples",
    description: "Consulte o andamento pelo e-mail ou telefone informado no pedido.",
  },
];

export default function HomePage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(242,116,32,0.1),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.42),rgba(252,249,244,0))]" />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 md:px-6 md:pb-14 md:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8">
            <div className="relative z-10 max-w-xl space-y-8">
              <div className="space-y-6">
                <h1 className="max-w-[13ch] text-[clamp(2.5rem,4.8vw,4.1rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-brand-ink">
                  Ajuda real para quem quer{" "}
                  <span className="text-brand-orange">empreender</span>
                </h1>
                <p className="max-w-[34rem] text-[1.02rem] leading-8 text-brand-night/78 md:text-[1.12rem]">
                  Aqui voce entende o que fazer, evita cobranca errada e encontra
                  ajuda humana para abrir, organizar ou regularizar seu MEI.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/quero-ajuda"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-14 rounded-full border-0 bg-gradient-to-r from-brand-orange-deep to-brand-orange px-8 text-base font-semibold text-white shadow-soft hover:brightness-105",
                  )}
                >
                  Quero ajuda agora
                </Link>
                <Link
                  href="/acompanhar"
                  className="inline-flex items-center gap-2 text-base font-semibold text-brand-ink transition-colors hover:text-brand-orange"
                >
                  Acompanhar pedido
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[20rem] w-full lg:min-h-[31rem]">
              <div className="absolute inset-x-0 bottom-0 top-0 rounded-[3rem] bg-[radial-gradient(circle_at_52%_62%,rgba(28,28,28,0.1),transparent_32%)] blur-3xl" />
              <div className="relative h-full min-h-[20rem] w-full lg:min-h-[31rem]">
                <Image
                  src="/hero/pavilion-atelier.png"
                  alt="Pavilhao do Espaco do Empreendedor"
                  fill
                  priority
                  className="object-contain object-center drop-shadow-[0_28px_40px_rgba(28,28,28,0.16)]"
                  sizes="(min-width: 1024px) 56rem, 100vw"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-6 md:px-6 md:pb-10">
          <div className="grid gap-4 lg:grid-cols-4">
            {PILLARS.map((pillar, index) => (
              <div
                key={pillar.title}
                className={cn(
                  "rounded-[1.75rem] px-5 py-5",
                  index % 2 === 0 ? "bg-white" : "bg-[#f6f3ee]",
                )}
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-accent text-brand-orange">
                  <pillar.icon className="size-4" />
                </div>
                <p className="mt-4 text-base font-semibold text-brand-ink">{pillar.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 md:px-6 md:py-12">
        <SectionHeader
          eyebrow="Por onde comecar"
          title="Escolha o caminho mais proximo da sua duvida"
          description="Conteudo curto, direto e pensado para ler no celular."
        />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex h-full flex-col justify-between gap-4 rounded-[1.75rem] bg-white p-6 transition-all hover:-translate-y-0.5 hover:bg-[#fffaf5] hover:shadow-soft"
            >
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-brand-ink">{action.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{action.description}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange transition-transform group-hover:translate-x-0.5">
                Abrir
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5 rounded-[2rem] bg-gradient-to-br from-brand-ink to-[#2b2723] p-7 text-white md:p-8">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
              Compromisso
            </span>
            <h2 className="text-2xl leading-tight md:text-3xl">
              Sem juridiques, sem pressao, sem aparencia de golpe.
            </h2>
            <p className="text-sm leading-6 text-white/75">
              A plataforma diferencia procedimento oficial, apoio privado opcional e
              cobranca indevida. Isso reduz risco para quem esta comecando.
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-orange hover:text-brand-orange/80"
            >
              Conhecer o projeto
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            <SectionHeader eyebrow="Duvidas frequentes" title="Respostas rapidas" />
            <div className="rounded-[2rem] bg-white px-6">
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className="space-y-2 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Video rapido
            </p>
            <h2 className="text-2xl tracking-tight text-brand-ink md:text-3xl">
              Veja um passo a passo em video
            </h2>
          </div>

          <div className="rounded-[1.9rem] bg-white p-2 shadow-soft sm:p-2.5">
            <div className="relative aspect-video overflow-hidden rounded-[1.55rem] bg-[#ebe4da]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/InoidBAJZ98"
                title="Video explicativo sobre MEI"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-[2rem] bg-[#f6f3ee] p-6 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
                Atendimento assistido
              </p>
              <h2 className="text-2xl tracking-tight text-brand-ink md:text-3xl">
                Precisa falar com alguem do projeto?
              </h2>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Abra uma solicitacao gratuita e acompanhe o andamento pelo e-mail
                ou telefone que voce informar.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link
                href="/quero-ajuda"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full border-0 bg-gradient-to-r from-brand-orange-deep to-brand-orange px-7 text-white",
                )}
              >
                Pedir ajuda
              </Link>
              <Link
                href="/acompanhar"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full border-0 bg-white px-7 hover:bg-white/90",
                )}
              >
                Acompanhar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
