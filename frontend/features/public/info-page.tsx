import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      <section className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-6 md:py-14">
        <PageHeader eyebrow={content.eyebrow} title={content.title} description={content.intro} />

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {firstBlock ? (
              <div className="rounded-2xl border border-brand-line/60 bg-white/80 p-6 md:p-7">
                <h2 className="text-lg font-semibold text-brand-ink">{firstBlock.title}</h2>
                <Checklist items={firstBlock.items} className="mt-4" />
              </div>
            ) : null}

            {restBlocks.length > 0 ? (
              <div className="rounded-2xl border border-brand-line/60 bg-white/70 px-6">
                <Accordion>
                  {restBlocks.map((block) => (
                    <AccordionItem key={block.title} value={block.title}>
                      <AccordionTrigger>{block.title}</AccordionTrigger>
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
              Este conteúdo resume a base técnica do projeto, mas não substitui o canal oficial quando o caso exige conferência fina.
            </Callout>

            <div className="rounded-2xl border border-brand-line/60 bg-white/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
                Próximo passo
              </p>
              <h3 className="mt-2 text-base font-semibold text-brand-ink">
                Precisa de ajuda humana para o seu caso?
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Abra um pedido gratuito e acompanhe sua solicitação com um código.
              </p>
              <div className="mt-4 flex flex-col gap-2">
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
