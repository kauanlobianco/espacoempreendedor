import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Mail,
  Scale,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/feedback/page-header";
import { SectionHeader } from "@/components/feedback/section-header";
import { PublicShell } from "@/components/layout/public-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Atendimento humano",
    description:
      "Escuta ativa, sem pressão e sem jargão. Cada caso é tratado por uma pessoa real.",
  },
  {
    icon: GraduationCap,
    title: "Supervisão acadêmica",
    description:
      "Alunos extensionistas atuam com acompanhamento de professores responsáveis.",
  },
  {
    icon: Scale,
    title: "Informação responsável",
    description:
      "Separamos o que é procedimento oficial, apoio opcional e cobrança indevida.",
  },
  {
    icon: Users,
    title: "Serviço gratuito",
    description:
      "O atendimento ao público é gratuito e não exige contratação de nada.",
  },
];

const FAQ = [
  {
    question: "Como o projeto atende?",
    answer:
      "Você envia uma solicitação descrevendo sua dúvida. Ela entra em uma fila, é assumida por um aluno extensionista e supervisionada por um professor até o fechamento.",
  },
  {
    question: "Quem são os atendentes?",
    answer:
      "Alunos de graduação vinculados ao projeto de extensão, com orientação direta de professores das áreas envolvidas.",
  },
  {
    question: "O atendimento é gratuito?",
    answer:
      "Sim. Toda orientação prestada pelo projeto é gratuita. Abrir MEI no canal oficial também é gratuito.",
  },
  {
    question: "Vocês substituem um contador ou advogado?",
    answer:
      "Não. Oferecemos orientação inicial e encaminhamos para fontes oficiais. Casos complexos podem exigir profissional especializado.",
  },
  {
    question: "Como meus dados são usados?",
    answer:
      "Apenas para tratamento da solicitação e acompanhamento interno. Não compartilhamos dados com terceiros fora do escopo do atendimento.",
  },
];

const STEPS = [
  "Você abre uma solicitação pelo site.",
  "Um aluno assume seu caso.",
  "Um professor supervisiona o atendimento.",
  "Você acompanha pelo código recebido.",
];

export default function SobrePage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl space-y-12 px-4 py-10 md:px-6 md:py-16">
        <PageHeader
          eyebrow="Sobre o projeto"
          title="Extensão universitária que aproxima o MEI de informação confiável"
          description="Somos um projeto de extensão voltado a atender microempreendedores com linguagem simples, base oficial e supervisão acadêmica."
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-7 shadow-soft md:p-8">
            <Eyebrow>Nossa missão</Eyebrow>
            <h2 className="mt-3 font-display text-[26px] leading-tight tracking-tight text-[var(--brand-ink)] md:text-[30px]">
              Tornar a formalização do MEI mais clara, acessível e segura.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--brand-mute)]">
              Muita gente começa a empreender sem saber por onde ir e acaba exposta a cobranças
              indevidas ou informações confusas. Organizamos o conhecimento essencial e oferecemos
              atendimento humano pra reduzir essa distância.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[28px] bg-[var(--brand-ink)] p-7 text-white shadow-lift md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-[260px] rounded-full opacity-45 radial-orange-orb"
            />
            <div className="relative z-10 space-y-4">
              <Eyebrow tone="orange">Como funciona</Eyebrow>
              <ol className="space-y-3 text-[14.5px] leading-6 text-white/85">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[color:rgba(232,93,31,0.22)] text-[12px] font-bold text-[var(--brand-orange)]">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <SectionHeader eyebrow="Princípios" title="O que guia o atendimento" />
          <div className="grid gap-3 md:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="flex gap-4 rounded-[20px] border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
                  <value.icon className="size-4" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-[var(--brand-ink)]">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--brand-mute)]">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Callout tone="warning" title="O que o projeto não faz">
          Não oferecemos consultoria tributária individual, não assinamos documentos em nome do
          empreendedor e não substituímos canais oficiais quando a situação exige.
        </Callout>

        <div className="grid gap-5 rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:grid-cols-2 md:p-8">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
              <MapPin className="size-4" />
            </span>
            <div>
              <Eyebrow tone="mute">Onde estamos</Eyebrow>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-night)]">
                R. Mario Santos Braga, 30 — Centro, Niterói
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
              <Mail className="size-4" />
            </span>
            <div>
              <Eyebrow tone="mute">Contato</Eyebrow>
              <a
                href="mailto:empreendedor.uff@gmail.com"
                className="mt-2 block text-sm leading-6 text-[var(--brand-night)] hover:text-[var(--brand-orange-deep)]"
              >
                empreendedor.uff@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader eyebrow="Dúvidas comuns" title="Perguntas sobre o projeto" />
          <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white px-6 shadow-soft md:px-7">
            <Accordion>
              {FAQ.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-[var(--brand-orange-ghost)] p-6 shadow-soft md:p-8">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Eyebrow>Próximo passo</Eyebrow>
              <h3 className="mt-2 font-display text-[24px] leading-tight tracking-tight text-[var(--brand-ink)]">
                Tem uma dúvida específica?
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-night)]">
                Abra uma solicitação gratuita e acompanhe com um código simples.
              </p>
            </div>
            <Link href="/quero-ajuda" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              Pedir ajuda
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
