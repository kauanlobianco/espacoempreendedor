import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepFlowItem {
  icon?: LucideIcon;
  title: string;
  description: string;
  hint?: string;
}

export function StepFlow({
  items,
  variant = "vertical",
}: {
  items: ReadonlyArray<StepFlowItem>;
  variant?: "vertical" | "horizontal";
}) {
  if (variant === "horizontal") {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="relative flex flex-col gap-3 rounded-2xl border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-full bg-[var(--brand-ink)] text-[12px] font-bold text-white">
                  {i + 1}
                </span>
                {Icon ? (
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
                    <Icon className="size-4" />
                  </span>
                ) : null}
              </div>
              <h3 className="font-display text-[18px] leading-tight tracking-tight text-[var(--brand-ink)]">
                {item.title}
              </h3>
              <p className="text-[13px] leading-6 text-[var(--brand-mute)]">{item.description}</p>
              {item.hint ? (
                <p className="rounded-xl bg-[var(--brand-paper-deep)]/55 px-3 py-2 text-[12px] leading-5 text-[var(--brand-night)]">
                  {item.hint}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ol className="relative ml-3 space-y-4 border-l border-dashed border-[color:var(--brand-line)] pl-6">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <li key={item.title} className="relative">
            <span
              className={cn(
                "absolute -left-[33px] flex size-7 items-center justify-center rounded-full border-2 border-white bg-[var(--brand-orange)] text-[11px] font-bold text-white shadow-soft",
              )}
            >
              {i + 1}
            </span>
            <div className="rounded-2xl border border-[color:var(--brand-soft-line)] bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center gap-2">
                {Icon ? (
                  <span className="flex size-8 items-center justify-center rounded-xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
                    <Icon className="size-4" />
                  </span>
                ) : null}
                <h3 className="font-display text-[20px] leading-tight tracking-tight text-[var(--brand-ink)]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2 text-[14px] leading-6 text-[var(--brand-mute)]">
                {item.description}
              </p>
              {item.hint ? (
                <p className="mt-3 rounded-xl bg-[var(--brand-paper-deep)]/55 px-3.5 py-2.5 text-[13px] leading-6 text-[var(--brand-night)]">
                  {item.hint}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
