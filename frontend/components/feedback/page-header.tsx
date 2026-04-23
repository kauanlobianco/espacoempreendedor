import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "start",
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "mx-auto max-w-2xl text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div
        className={cn(
          "space-y-3",
          align === "center" && "max-w-2xl text-center",
        )}
      >
        {eyebrow ? (
          <p className="font-eyebrow text-[var(--brand-orange-deep)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl leading-tight tracking-tight text-[var(--brand-ink)] md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-[15px] leading-relaxed text-[var(--brand-mute)]",
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
