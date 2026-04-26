import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type QuickFactTone = "neutral" | "orange" | "amber" | "green";

const TONE_STYLES: Record<QuickFactTone, { card: string; pill: string; icon: string }> = {
  neutral: {
    card: "border-[color:var(--brand-soft-line)] bg-white",
    pill: "bg-[var(--brand-paper-deep)] text-[var(--brand-mute)]",
    icon: "bg-[var(--brand-paper-deep)] text-[var(--brand-night)]",
  },
  orange: {
    card: "border-[color:var(--brand-soft-line)] bg-white",
    pill: "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]",
    icon: "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]",
  },
  amber: {
    card: "border-[color:rgba(178,113,0,0.22)] bg-[color:rgba(178,113,0,0.06)]",
    pill: "bg-[color:rgba(178,113,0,0.16)] text-[var(--brand-amber)]",
    icon: "bg-[color:rgba(178,113,0,0.14)] text-[var(--brand-amber)]",
  },
  green: {
    card: "border-[color:rgba(47,125,91,0.22)] bg-[color:rgba(47,125,91,0.06)]",
    pill: "bg-[color:rgba(47,125,91,0.16)] text-[var(--brand-green)]",
    icon: "bg-[color:rgba(47,125,91,0.14)] text-[var(--brand-green)]",
  },
};

export interface QuickFact {
  icon: LucideIcon;
  kicker: string;
  title: string;
  description: string;
  tone?: QuickFactTone;
}

export function QuickFacts({ items }: { items: ReadonlyArray<QuickFact> }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const tone = TONE_STYLES[item.tone ?? "neutral"];
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className={cn(
              "flex flex-col gap-3 rounded-2xl border p-5 shadow-soft",
              tone.card,
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  tone.icon,
                )}
              >
                <Icon className="size-4" />
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em]",
                  tone.pill,
                )}
              >
                {item.kicker}
              </span>
            </div>
            <h3 className="font-display text-[18px] leading-tight tracking-tight text-[var(--brand-ink)]">
              {item.title}
            </h3>
            <p className="text-[13px] leading-6 text-[var(--brand-mute)]">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
