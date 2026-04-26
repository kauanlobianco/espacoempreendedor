import { ShieldAlert } from "lucide-react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { InfoIconView, type InfoIconName } from "@/components/info/info-icons";
import { cn } from "@/lib/utils";

export function AlertCard({
  eyebrow = "Atenção",
  title,
  description,
  items,
  icon = "ShieldAlert",
  tone = "amber",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  items?: ReadonlyArray<string>;
  icon?: InfoIconName;
  tone?: "amber" | "red";
}) {
  const styles = {
    amber: {
      card: "border-[color:rgba(178,113,0,0.22)] bg-[color:rgba(178,113,0,0.06)]",
      icon: "bg-[color:rgba(178,113,0,0.16)] text-[var(--brand-amber)]",
      eyebrow: "text-[var(--brand-amber)]",
      bullet: "bg-[var(--brand-amber)]",
    },
    red: {
      card: "border-[color:rgba(168,42,31,0.22)] bg-[color:rgba(168,42,31,0.06)]",
      icon: "bg-[color:rgba(168,42,31,0.16)] text-[var(--brand-red)]",
      eyebrow: "text-[var(--brand-red)]",
      bullet: "bg-[var(--brand-red)]",
    },
  } as const;

  const t = styles[tone];

  return (
    <div className={cn("rounded-[28px] border p-6 shadow-soft md:p-8", t.card)}>
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
            t.icon,
          )}
        >
          {icon ? <InfoIconView name={icon} className="size-5" /> : <ShieldAlert className="size-5" />}
        </span>
        <div className="space-y-2">
          <Eyebrow tone="mute" className={t.eyebrow}>
            {eyebrow}
          </Eyebrow>
          <h2 className="font-display text-[24px] leading-tight tracking-tight text-[var(--brand-ink)] md:text-[28px]">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-[14.5px] leading-relaxed text-[var(--brand-night)]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {items?.length ? (
        <ul className="mt-5 grid gap-2 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl bg-white/60 px-3.5 py-2.5 text-[13.5px] leading-6 text-[var(--brand-night)]"
            >
              <span className={cn("mt-2 size-1.5 shrink-0 rounded-full", t.bullet)} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
