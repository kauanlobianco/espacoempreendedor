"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";

import { InfoIconView, type InfoIconName } from "@/components/info/info-icons";
import { cn } from "@/lib/utils";

export interface GuideSection {
  icon?: InfoIconName;
  title: string;
  intro?: string;
  checklist?: ReadonlyArray<string>;
  tip?: string;
  warning?: string;
  action?: string;
}

export function RichGuide({
  sections,
  defaultOpen = 0,
}: {
  sections: ReadonlyArray<GuideSection>;
  defaultOpen?: number;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className="overflow-hidden rounded-[28px] border border-[color:var(--brand-soft-line)] bg-white shadow-soft">
      {sections.map((section, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={section.title}
            className={cn(
              "border-b border-[color:var(--brand-soft-line)] last:border-b-0",
              isOpen && "bg-[var(--brand-paper-deep)]/35",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={cn(
                "flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors md:px-7",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)]">
                  {section.icon ? (
                    <InfoIconView name={section.icon} className="size-4" />
                  ) : (
                    <span className="text-[12px] font-bold">{i + 1}</span>
                  )}
                </span>
                <span className="font-display text-[18px] leading-tight tracking-tight text-[var(--brand-ink)] md:text-[20px]">
                  {section.title}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-[var(--brand-mute)] transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen ? (
              <div className="space-y-3 px-5 pb-6 md:px-7">
                {section.intro ? (
                  <p className="text-[14px] leading-6 text-[var(--brand-night)]">
                    {section.intro}
                  </p>
                ) : null}

                {section.checklist?.length ? (
                  <ul className="space-y-2 pt-1">
                    {section.checklist.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 rounded-xl bg-white px-3.5 py-2.5 text-[13.5px] leading-6 text-[var(--brand-night)] shadow-soft"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--brand-orange)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.tip ? (
                  <Inline
                    tone="info"
                    icon={<Lightbulb className="size-4" />}
                    label="Dica"
                    body={section.tip}
                  />
                ) : null}

                {section.warning ? (
                  <Inline
                    tone="warning"
                    icon={<AlertTriangle className="size-4" />}
                    label="Atenção"
                    body={section.warning}
                  />
                ) : null}

                {section.action ? (
                  <Inline
                    tone="action"
                    icon={<ArrowRight className="size-4" />}
                    label="O que fazer agora"
                    body={section.action}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function Inline({
  tone,
  icon,
  label,
  body,
}: {
  tone: "info" | "warning" | "action";
  icon: React.ReactNode;
  label: string;
  body: string;
}) {
  const tones = {
    info: "border-[color:rgba(30,95,140,0.22)] bg-[color:rgba(30,95,140,0.06)] text-[var(--brand-blue)]",
    warning:
      "border-[color:rgba(178,113,0,0.22)] bg-[color:rgba(178,113,0,0.06)] text-[var(--brand-amber)]",
    action:
      "border-[color:rgba(47,125,91,0.22)] bg-[color:rgba(47,125,91,0.06)] text-[var(--brand-green)]",
  } as const;

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border px-3.5 py-3", tones[tone])}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="text-[13.5px] leading-6 text-[var(--brand-night)]">
        <span className="block text-[10.5px] font-bold uppercase tracking-[0.18em]">{label}</span>
        <span className="block">{body}</span>
      </div>
    </div>
  );
}
