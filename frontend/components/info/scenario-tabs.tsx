"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { InfoIconView, type InfoIconName } from "@/components/info/info-icons";
import { cn } from "@/lib/utils";

export interface Scenario {
  id: string;
  icon: InfoIconName;
  label: string;
  hint?: string;
  intro: string;
  steps: ReadonlyArray<string>;
  nextStep?: string;
}

export function ScenarioTabs({ scenarios }: { scenarios: ReadonlyArray<Scenario> }) {
  const [activeId, setActiveId] = useState(scenarios[0]?.id);
  const active = scenarios.find((s) => s.id === activeId) ?? scenarios[0];

  if (!active) return null;

  return (
    <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
      {/* Lista lateral (vira pílulas no mobile) */}
      <div
        className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        role="tablist"
      >
        {scenarios.map((s) => {
          const isActive = s.id === active.id;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={isActive ? "true" : "false"}
              onClick={() => setActiveId(s.id)}
              className={cn(
                "group flex shrink-0 items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all lg:shrink",
                isActive
                  ? "border-[var(--brand-orange)] bg-[var(--brand-orange-ghost)] shadow-soft"
                  : "border-[color:var(--brand-soft-line)] bg-white hover:border-[color:rgba(232,93,31,0.32)]",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? "bg-[var(--brand-orange)] text-white"
                    : "bg-[var(--brand-paper-deep)] text-[var(--brand-night)] group-hover:bg-[var(--brand-orange-ghost)] group-hover:text-[var(--brand-orange-deep)]",
                )}
              >
                <InfoIconView name={s.icon} className="size-4" />
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[13.5px] font-semibold leading-tight",
                    isActive ? "text-[var(--brand-ink)]" : "text-[var(--brand-night)]",
                  )}
                >
                  {s.label}
                </p>
                {s.hint ? (
                  <p className="mt-1 hidden text-[11.5px] leading-tight text-[var(--brand-mute)] lg:block">
                    {s.hint}
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Painel ativo */}
      <div
        key={active.id}
        role="tabpanel"
        className="rounded-[24px] border border-[color:var(--brand-soft-line)] bg-white p-6 shadow-soft md:p-7"
      >
        <Eyebrow>Cenário</Eyebrow>
        <h3 className="mt-2 font-display text-[24px] leading-tight tracking-tight text-[var(--brand-ink)] md:text-[26px]">
          {active.label}
        </h3>
        <p className="mt-3 text-[14.5px] leading-6 text-[var(--brand-mute)]">{active.intro}</p>

        <ul className="mt-5 space-y-2.5">
          {active.steps.map((step, i) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-xl bg-[var(--brand-paper-deep)]/55 px-3.5 py-3 text-[13.5px] leading-6 text-[var(--brand-night)]"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[var(--brand-orange-deep)] shadow-soft">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>

        {active.nextStep ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[color:rgba(47,125,91,0.22)] bg-[color:rgba(47,125,91,0.06)] px-4 py-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:rgba(47,125,91,0.18)] text-[var(--brand-green)]">
              <Check className="size-3.5" />
            </span>
            <div className="text-[13.5px] leading-6 text-[var(--brand-night)]">
              <span className="block text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--brand-green)]">
                Próximo passo
              </span>
              <span className="block">{active.nextStep}</span>
            </div>
            <ArrowRight className="ml-auto mt-1 size-4 shrink-0 text-[var(--brand-green)]" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
