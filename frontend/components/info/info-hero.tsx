import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

export function InfoHero({
  eyebrow,
  title,
  highlight,
  description,
  chips,
  essential,
  visual,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  highlight?: string;
  description: string;
  chips?: ReadonlyArray<{ label: string; tone?: "neutral" | "orange" | "green" | "amber" | "red" }>;
  essential?: { title: string; lines: ReadonlyArray<string> };
  visual?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-[color:var(--brand-soft-line)] bg-white shadow-soft",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-[360px] rounded-full opacity-50 radial-orange-orb"
      />

      <div className="relative z-10 grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 p-8 md:p-12">
          <Eyebrow>{eyebrow}</Eyebrow>

          <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.03em] text-[var(--brand-ink)] md:text-[48px]">
            {title}
            {highlight ? (
              <>
                {" "}
                <em className="not-italic text-[var(--brand-orange)]">{highlight}</em>
              </>
            ) : null}
          </h1>

          <p className="max-w-xl text-[15.5px] leading-relaxed text-[var(--brand-mute)]">
            {description}
          </p>

          {chips?.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {chips.map((c) => (
                <Pill key={c.label} tone={c.tone ?? "neutral"} size="md">
                  {c.label}
                </Pill>
              ))}
            </div>
          ) : null}
        </div>

        {essential ? (
          <div className="border-t border-[color:var(--brand-soft-line)] bg-[var(--brand-paper-deep)]/55 p-8 md:border-l md:border-t-0 md:p-10">
            <Eyebrow tone="mute">{essential.title}</Eyebrow>
            <ul className="mt-4 space-y-3">
              {essential.lines.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[14.5px] leading-6 text-[var(--brand-night)]"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--brand-orange)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : visual ? (
          <div className="relative flex items-end justify-center overflow-hidden border-t border-[color:var(--brand-soft-line)] md:border-l md:border-t-0">
            {visual}
          </div>
        ) : null}
      </div>
    </div>
  );
}
