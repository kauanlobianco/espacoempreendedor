import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin, UserRound } from "lucide-react";

import { CaseStatusBadge } from "@/components/data-display/case-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { CATEGORY_LABEL } from "@/lib/constants/domain";
import { formatRelativeTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CaseListItem } from "@/types/api";

function formatLocation(item: CaseListItem) {
  if (!item.request.city) return "Localidade nao informada";
  return item.request.state
    ? `${item.request.city} · ${item.request.state}`
    : item.request.city;
}

export function StudentCaseRow({
  item,
  href,
  actionLabel = "Abrir",
  highlight = false,
  extraMeta,
  actionTone = "outline",
  action,
}: {
  item: CaseListItem;
  href: string;
  actionLabel?: string;
  highlight?: boolean;
  extraMeta?: string;
  actionTone?: "outline" | "default";
  action?: ReactNode;
}) {
  const assignedTo = item.assignments[0]?.student.fullName;

  return (
    <article
      className={cn(
        "rounded-[24px] border bg-white px-4 py-4 shadow-soft transition-all md:px-5",
        highlight
          ? "border-[color:rgba(232,93,31,0.42)] shadow-[0_16px_30px_rgba(232,93,31,0.10)]"
          : "border-[color:var(--brand-soft-line)]",
      )}
    >
      <div className="grid gap-4 md:grid-cols-[132px_minmax(0,1fr)_auto] md:items-center">
        <div className="space-y-1.5">
          <p className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[var(--brand-night)]">
            {item.code}
          </p>
          <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--brand-mute)]">
            <Clock3 className="size-3" />
            {formatRelativeTime(item.updatedAt)}
          </p>
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-[var(--brand-ink)] md:text-[15.5px]">
              {item.request.fullName}
            </h3>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-mute)]">
              {CATEGORY_LABEL[item.category]}
            </span>
          </div>

          <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--brand-mute)]">
            {item.summary || item.request.fullName}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-[var(--brand-mute)]">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {formatLocation(item)}
            </span>
            {assignedTo || extraMeta ? (
              <span className="flex items-center gap-1">
                <UserRound className="size-3" />
                {extraMeta ?? assignedTo}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <CaseStatusBadge status={item.status} size="sm" />
          {action ?? (
            <Link
              href={href}
              className={cn(
                buttonVariants({
                  variant: actionTone === "default" ? "default" : "outline",
                  size: "sm",
                }),
                "min-w-[92px] justify-between",
              )}
            >
              {actionLabel}
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
