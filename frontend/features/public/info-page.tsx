import Link from "next/link";
import { ArrowRight, BookOpen, HelpCircle } from "lucide-react";

import { PageHeader } from "@/components/feedback/page-header";
import { PublicShell } from "@/components/layout/public-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Checklist } from "@/components/ui/checklist";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

export interface InfoPageContent {
  eyebrow: string;
  title: string;
  intro: string;
  blocks: ReadonlyArray<{
    title: string;
    items: ReadonlyArray<string>;
  }>;
}

export function InfoPage({ content }: { content: InfoPageContent }) {
  const [firstBlock, ...restBlocks] = content.blocks;

  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6 md:py-16">
        <PageHeader eyebrow={content.eyebrow} title={content.title} description={content.intro} />

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {firstBlock ? (
              <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
                    <BookOpen className="size-4" />
                  </span>
                  <h2 className="font-display text-[22px] leading-tight tracking-tight text-[var(--brand-ink)]">
                    {firstBlock.title}
                  </h2>
                </div>
                <Checklist items={firstBlock.items} className="mt-5" />
              </div>
            ) : null}

            {restBlocks.length > 0 ? (
              <div className="rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white px-6 shadow-soft md:px-7">
                <Accordion>
                  {restBlocks.map((block) => (
                    <AccordionItem key={block.title} value={block.title}>
                      <AccordionTrigger>
                        <span className="flex items-center gap-3 text-left">
                          <HelpCircle className="size-4 shrink-0 text-[var(--brand-orange-deep)]" />
                          {block.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Checklist items={block.items} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : null}
          </div>

          <aside className="space-y-4">
            <Callout tone="note" title="Informação oficial, explicada sem burocracia">
              Este conteúdo resume a base técnica do projeto, mas não substitui o canal oficial
              quando o caso exige conferência fina.
            </Callout>

            <div className="rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft">
              <Eyebrow tone="mute">Próximo passo</Eyebrow>
              <h3 className="mt-2 font-display text-[22px] leading-tight tracking-tight text-[var(--brand-ink)]">
                Precisa de ajuda humana para o seu caso?
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--brand-mute)]">
                Abra um pedido gratuito e acompanhe sua solicitação com um código.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link href="/quero-ajuda" className={cn(buttonVariants(), "justify-center gap-2")}>
                  Pedir ajuda
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/acompanhar"
                  className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
                >
                  Acompanhar solicitação
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </PublicShell>
  );
}
