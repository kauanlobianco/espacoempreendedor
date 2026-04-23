import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start",
  actions,
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  actions?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "space-y-2",
          align === "center" && "max-w-2xl",
        )}
      >
        {eyebrow ? (
          <p
            className={cn(
              "font-eyebrow",
              isDark ? "text-[var(--brand-orange)]" : "text-[var(--brand-orange-deep)]",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "font-display text-3xl leading-tight tracking-tight md:text-4xl",
            isDark ? "text-white" : "text-[var(--brand-ink)]",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-[14.5px] leading-relaxed",
              isDark ? "text-white/70" : "text-[var(--brand-mute)]",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
      ) : null}
    </div>
  );
}
