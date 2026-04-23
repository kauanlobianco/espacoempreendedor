import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MetricTone = "default" | "accent" | "dark" | "muted";
type DeltaTone = "positive" | "negative" | "neutral";

const TONE_STYLES: Record<MetricTone, string> = {
  default:
    "border-[color:var(--brand-soft-line)] bg-white shadow-soft",
  accent:
    "border-[color:rgba(232,93,31,0.28)] bg-[var(--brand-orange-ghost)]",
  muted:
    "border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]",
  dark:
    "border-transparent bg-[var(--brand-ink)] text-white shadow-lift",
};

const DELTA_STYLES: Record<DeltaTone, string> = {
  positive:
    "bg-[color:rgba(47,125,91,0.12)] text-[var(--brand-green)] border-[color:rgba(47,125,91,0.20)]",
  negative:
    "bg-[color:rgba(168,42,31,0.12)] text-[var(--brand-red)] border-[color:rgba(168,42,31,0.20)]",
  neutral:
    "bg-[var(--brand-paper-deep)] text-[var(--brand-mute)] border-[color:var(--brand-soft-line)]",
};

export function MetricCard({
  label,
  value,
  help,
  delta,
  deltaTone = "neutral",
  icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  help?: string;
  delta?: string;
  deltaTone?: DeltaTone;
  icon?: ReactNode;
  tone?: MetricTone;
  className?: string;
}) {
  const isDark = tone === "dark";
  return (
    <div
      data-tone={tone}
      className={cn(
        "group/metric relative flex flex-col gap-3 rounded-2xl border p-5",
        TONE_STYLES[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "font-eyebrow",
            isDark ? "text-white/60" : "text-[var(--brand-mute)]",
          )}
        >
          {label}
        </p>
        {icon ? (
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-xl",
              isDark
                ? "bg-white/10 text-[var(--brand-orange)]"
                : "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "font-display text-4xl leading-none tracking-tight tabular-nums",
          isDark ? "text-white" : "text-[var(--brand-ink)]",
        )}
      >
        {value}
      </p>
      <div className="flex items-center justify-between gap-2">
        {help ? (
          <p
            className={cn(
              "text-xs leading-5",
              isDark ? "text-white/60" : "text-[var(--brand-mute)]",
            )}
          >
            {help}
          </p>
        ) : <span />}
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
              DELTA_STYLES[deltaTone],
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
