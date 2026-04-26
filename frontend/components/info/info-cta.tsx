import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircleQuestion } from "lucide-react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

export function InfoCTA({
  title = "Continua com dúvida?",
  description = "A equipe do Espaço Empreendedor pode te orientar com calma, sem cobrança e na sua linguagem.",
  primary = { href: "/quero-ajuda", label: "Pedir orientação" },
  secondary = { href: "/acompanhar", label: "Acompanhar pedido" },
}: {
  title?: string;
  description?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-[var(--brand-ink)] p-8 text-white shadow-lift md:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-[320px] rounded-full opacity-50 radial-orange-orb"
      />

      <div className="relative z-10 grid gap-6 md:grid-cols-[1.2fr_auto] md:items-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-[12px] font-semibold text-white/70">
            <MessageCircleQuestion className="size-3.5 text-[var(--brand-orange)]" />
            Apoio gratuito
          </div>
          <Eyebrow tone="orange">Próximo passo</Eyebrow>
          <h2 className="font-display text-[28px] leading-tight tracking-tight md:text-[34px]">
            {title}
          </h2>
          <p className="max-w-xl text-[14.5px] leading-relaxed text-white/70">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={primary.href}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-6 text-[14.5px] font-semibold text-white shadow-[0_14px_28px_rgba(232,93,31,0.32)] transition hover:bg-[var(--brand-orange-deep)]",
            )}
          >
            {primary.label}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={secondary.href}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-[14.5px] font-semibold text-white hover:bg-white/10"
          >
            {secondary.label}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
