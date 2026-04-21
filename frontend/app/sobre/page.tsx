import Link from "next/link";
import { ArrowRight, GraduationCap, HeartHandshake, Scale, Users } from "lucide-react";

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
import { cn } from "@/lib/utils";

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Atendimento humano",
    description: "Escuta ativa, sem pressão e sem jargão. Cada caso é tratado por uma pessoa real.",
  },
  {
    icon: GraduationCap,
    title: "Supervisão acadêmica",
    description: "Alunos extensionistas atuam com acompanhamento de professores responsáveis.",
  },
  {
    icon: Scale,
    title: "Informação responsável",
    description: "Separamos o que é procedimento oficial, apoio opcional e cobrança indevida.",
  },
  {
    icon: Users,
    title: "Serviço gratuito",
    description: "O atendimento ao público é gratuito e não exige contratação de nada.",
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

export default function SobrePage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl space-y-12 px-4 py-10 md:px-6 md:py-14">
        <PageHeader
          eyebrow="Sobre o projeto"
          title="Extensão universitária que aproxima o MEI de informação confiável"
          description="Somos um projeto de extensão voltado a atender microempreendedores com linguagem simples, base oficial e supervisão acadêmica."
        />

        {/* Missão */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-brand-line/60 bg-white/80 p-7 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Nossa missão
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-brand-ink md:text-[26px]">
              Tornar a formalização do MEI mais clara, acessível e segura.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Muita gente começa a empreender sem saber por onde ir e acaba exposta a cobranças indevidas ou informações confusas. Organizamos o conhecimento essencial e oferecemos atendimento humano pra reduzir essa distância.
            </p>
          </div>

          <div className="rounded-3xl border border-brand-line/60 bg-gradient-to-br from-brand-ink to-brand-night p-7 text-white md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              Como funciona
            </p>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-white/85">
              {[
                "Você abre uma solicitação pelo site.",
                "Um aluno assume seu caso.",
                "Um professor supervisiona o atendimento.",
                "Você acompanha pelo código recebido.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/20 text-[11px] font-semibold text-brand-orange">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Valores */}
        <div className="space-y-6">
          <SectionHeader eyebrow="Princípios" title="O que guia o atendimento" />
          <div className="grid gap-3 md:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="flex gap-4 rounded-2xl border border-brand-line/60 bg-white/70 p-5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <value.icon className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-ink">{value.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Limites */}
        <Callout tone="warning" title="O que o projeto não faz">
          Não oferecemos consultoria tributária individual, não assinamos documentos em nome do empreendedor e não substituímos canais oficiais quando a situação exige.
        </Callout>

        <div className="grid gap-6 rounded-3xl border border-brand-line/60 bg-white/75 p-6 md:grid-cols-2 md:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Onde estamos
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-night/85">
              R. Mario Santos Braga, 30 - Centro, Niterói
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange">
              Contato
            </p>
            <a
              href="mailto:empreendedor.uff@gmail.com"
              className="mt-3 block text-sm leading-7 text-brand-night/85 hover:text-brand-orange"
            >
              empreendedor.uff@gmail.com
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <SectionHeader eyebrow="Dúvidas comuns" title="Perguntas sobre o projeto" />
          <div className="rounded-3xl border border-brand-line/60 bg-white/70 px-6">
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

        {/* CTA */}
        <div className="rounded-3xl border border-brand-line/60 bg-white/70 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-xl font-semibold text-brand-ink">Tem uma dúvida específica?</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
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
