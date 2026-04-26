import { Check, X } from "lucide-react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

export interface ComparisonColumn {
  title: string;
  caption?: string;
  items: ReadonlyArray<string>;
}

export function Comparison({
  good,
  bad,
  goodLabel = "Isso sim",
  badLabel = "Isso não",
}: {
  good: ComparisonColumn;
  bad: ComparisonColumn;
  goodLabel?: string;
  badLabel?: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Column
        kind="good"
        kicker={goodLabel}
        title={good.title}
        caption={good.caption}
        items={good.items}
      />
      <Column
        kind="bad"
        kicker={badLabel}
        title={bad.title}
        caption={bad.caption}
        items={bad.items}
      />
    </div>
  );
}

function Column({
  kind,
  kicker,
  title,
  caption,
  items,
}: {
  kind: "good" | "bad";
  kicker: string;
  title: string;
  caption?: string;
  items: ReadonlyArray<string>;
}) {
  const isGood = kind === "good";
  return (
    <div
      className={cn(
        "rounded-[24px] border p-6 shadow-soft",
        isGood
          ? "border-[color:rgba(47,125,91,0.22)] bg-[color:rgba(47,125,91,0.06)]"
          : "border-[color:rgba(168,42,31,0.22)] bg-[color:rgba(168,42,31,0.06)]",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            isGood
              ? "bg-[color:rgba(47,125,91,0.14)] text-[var(--brand-green)]"
              : "bg-[color:rgba(168,42,31,0.14)] text-[var(--brand-red)]",
          )}
        >
          {isGood ? <Check className="size-4" /> : <X className="size-4" />}
        </span>
        <Eyebrow tone="mute" className={isGood ? "text-[var(--brand-green)]" : "text-[var(--brand-red)]"}>
          {kicker}
        </Eyebrow>
      </div>

      <h3 className="mt-3 font-display text-[20px] leading-tight tracking-tight text-[var(--brand-ink)]">
        {title}
      </h3>
      {caption ? (
        <p className="mt-1 text-[13px] leading-6 text-[var(--brand-mute)]">{caption}</p>
      ) : null}

      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[13.5px] leading-6 text-[var(--brand-night)]"
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                isGood
                  ? "bg-[color:rgba(47,125,91,0.18)] text-[var(--brand-green)]"
                  : "bg-[color:rgba(168,42,31,0.18)] text-[var(--brand-red)]",
              )}
            >
              {isGood ? <Check className="size-3" /> : <X className="size-3" />}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
