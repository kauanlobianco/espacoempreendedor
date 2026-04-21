import type { ReactNode } from "react";
import { AlertTriangle, Info, ShieldCheck, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "info" | "warning" | "success" | "note";

const TONES: Record<Tone, { icon: typeof Info; className: string; iconClass: string }> = {
  info: {
    icon: Info,
    className: "border-brand-night/15 bg-brand-night/5 text-brand-night",
    iconClass: "text-brand-night",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-300/60 bg-amber-50 text-amber-950",
    iconClass: "text-amber-700",
  },
  success: {
    icon: ShieldCheck,
    className: "border-emerald-300/60 bg-emerald-50 text-emerald-950",
    iconClass: "text-emerald-700",
  },
  note: {
    icon: Sparkles,
    className: "border-brand-line bg-brand-paper text-brand-ink",
    iconClass: "text-brand-orange",
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
        "flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-6",
        toneClass,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconClass)} />
      <div className="space-y-1">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? <div className="text-[0.9em] opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}
