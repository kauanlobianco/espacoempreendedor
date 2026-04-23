import type { ReactNode } from "react";
import { AlertTriangle, Info, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "info" | "warning" | "success" | "note";

const TONES: Record<Tone, { icon: typeof Info; className: string; iconClass: string }> = {
  info: {
    icon: Info,
    className:
      "border-[color:rgba(30,95,140,0.18)] bg-[color:rgba(30,95,140,0.06)] text-[var(--brand-blue)]",
    iconClass: "text-[var(--brand-blue)]",
  },
  warning: {
    icon: AlertTriangle,
    className:
      "border-[color:rgba(178,113,0,0.22)] bg-[color:rgba(178,113,0,0.08)] text-[var(--brand-amber)]",
    iconClass: "text-[var(--brand-amber)]",
  },
  success: {
    icon: ShieldCheck,
    className:
      "border-[color:rgba(47,125,91,0.22)] bg-[color:rgba(47,125,91,0.08)] text-[var(--brand-green)]",
    iconClass: "text-[var(--brand-green)]",
  },
  note: {
    icon: Sparkles,
    className:
      "border-[color:var(--brand-soft-line)] bg-[var(--brand-orange-ghost)] text-[var(--brand-ink)]",
    iconClass: "text-[var(--brand-orange-deep)]",
  },
};

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: toneClass, iconClass } = TONES[tone];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-6",
        toneClass,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconClass)} />
      <div className="space-y-1">
        {title ? <p className="font-semibold tracking-tight text-[var(--brand-ink)]">{title}</p> : null}
        {children ? (
          <div className="text-[0.9em] text-[var(--brand-mute)]">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
