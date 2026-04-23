import Link from "next/link";
import { ArrowRight, Clock, MapPin, UserCircle } from "lucide-react";

import { CaseStatusBadge } from "@/components/data-display/case-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { CATEGORY_LABEL } from "@/lib/constants/domain";
import { formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CaseListItem } from "@/types/api";

export function CaseCard({
  item,
  href,
  actionLabel = "Abrir caso",
  layout = "row",
}: {
  item: CaseListItem;
  href: string;
  actionLabel?: string;
  layout?: "row" | "stack";
}) {
  const assignedTo = item.assignments[0]?.student.fullName;

  if (layout === "row") {
    return (
      <Link
        href={href}
        className={cn(
          "group/card relative grid gap-5 rounded-2xl border bg-white p-5 transition-all md:grid-cols-[160px_1fr_auto] md:items-center",
          "border-[color:var(--brand-soft-line)] hover:border-[color:var(--brand-line)] hover:shadow-soft",
        )}
      >
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[12px] font-semibold tracking-wide text-[var(--brand-night)]">
            {item.code}
          </span>
          <span className="flex items-center gap-1 text-[11.5px] text-[var(--brand-mute)]">
            <Clock className="size-3" />
            {formatDateTime(item.updatedAt)}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg leading-tight text-[var(--brand-ink)]">
              {item.request.fullName}
            </h3>
            <Pill tone="ghost" size="sm">
              {CATEGORY_LABEL[item.category]}
            </Pill>
          </div>
          {item.summary ? (
            <p className="line-clamp-2 text-[13.5px] leading-relaxed text-[var(--brand-mute)]">
              {item.summary}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11.5px] text-[var(--brand-mute)]">
            {item.request.city ? (
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {item.request.city}
                {item.request.state ? ` · ${item.request.state}` : ""}
              </span>
            ) : null}
            {assignedTo ? (
              <span className="flex items-center gap-1">
                <UserCircle className="size-3" />
                {assignedTo}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <CaseStatusBadge status={item.status} />
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--brand-ink)] transition-colors group-hover/card:text-[var(--brand-orange-deep)]",
            )}
          >
            {actionLabel}
            <ArrowRight className="size-3.5 transition-transform group-hover/card:translate-x-0.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-[color:var(--brand-soft-line)] bg-white p-5 transition-shadow hover:shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11.5px] font-semibold text-[var(--brand-night)]">
          {item.code}
        </span>
        <CaseStatusBadge status={item.status} size="sm" />
        <Pill tone="ghost" size="sm">
          {CATEGORY_LABEL[item.category]}
        </Pill>
      </div>

      <div>
        <h3 className="font-display text-lg leading-tight text-[var(--brand-ink)]">
          {item.request.fullName}
        </h3>
        {item.summary ? (
          <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-[var(--brand-mute)]">
            {item.summary}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-[var(--brand-mute)]">
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {formatDateTime(item.updatedAt)}
        </span>
        {item.request.city ? (
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {item.request.city}
            {item.request.state ? ` · ${item.request.state}` : ""}
          </span>
        ) : null}
        {assignedTo ? (
          <span className="flex items-center gap-1">
            <UserCircle className="size-3" />
            {assignedTo}
          </span>
        ) : null}
      </div>

      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-auto justify-between",
        )}
      >
        {actionLabel}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
