import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PillTone =
  | "neutral"
  | "orange"
  | "green"
  | "amber"
  | "red"
  | "blue"
  | "ghost"
  | "dark";

const TONE_STYLES: Record<PillTone, string> = {
  neutral:
    "bg-[var(--brand-paper-deep)] text-[var(--brand-night)] border-[color:var(--brand-soft-line)]",
  orange:
    "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)] border-[color:rgba(232,93,31,0.18)]",
  green:
    "bg-[color:rgba(47,125,91,0.10)] text-[var(--brand-green)] border-[color:rgba(47,125,91,0.18)]",
  amber:
    "bg-[color:rgba(178,113,0,0.10)] text-[var(--brand-amber)] border-[color:rgba(178,113,0,0.20)]",
  red:
    "bg-[color:rgba(168,42,31,0.10)] text-[var(--brand-red)] border-[color:rgba(168,42,31,0.18)]",
  blue:
    "bg-[color:rgba(30,95,140,0.10)] text-[var(--brand-blue)] border-[color:rgba(30,95,140,0.18)]",
  ghost:
    "bg-white text-[var(--brand-mute)] border-[color:var(--brand-soft-line)]",
  dark:
    "bg-[var(--brand-ink)] text-white border-transparent",
};

const DOT_COLOR: Record<PillTone, string> = {
  neutral: "bg-[var(--brand-mute)]",
  orange: "bg-[var(--brand-orange)]",
  green: "bg-[var(--brand-green)]",
  amber: "bg-[var(--brand-amber)]",
  red: "bg-[var(--brand-red)]",
  blue: "bg-[var(--brand-blue)]",
  ghost: "bg-[var(--brand-mute)]",
  dark: "bg-[var(--brand-orange)]",
};

export function Dot({
  tone = "orange",
  pulse = false,
  className,
}: {
  tone?: PillTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex size-2 rounded-full",
        DOT_COLOR[tone],
        className,
      )}
    >
      {pulse ? (
        <span
          className={cn(
            "absolute inset-0 animate-ping rounded-full opacity-60",
            DOT_COLOR[tone],
          )}
        />
      ) : null}
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral",
  withDot = false,
  pulse = false,
  size = "md",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: PillTone;
  withDot?: boolean;
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  className?: string;
}) {
  const sizes: Record<string, string> = {
    sm: "h-5 px-2 text-[10.5px] gap-1.5",
    md: "h-6 px-2.5 text-[11.5px] gap-1.5",
    lg: "h-7 px-3 text-xs gap-2",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold tracking-wide whitespace-nowrap",
        sizes[size],
        TONE_STYLES[tone],
        className,
      )}
    >
      {withDot ? <Dot tone={tone} pulse={pulse} /> : null}
      {icon}
      {children}
    </span>
  );
}
