import Link from "next/link";
import { ArrowRight, MapPin, UserCircle } from "lucide-react";

import { CaseStatusBadge } from "@/components/data-display/case-status-badge";
import { buttonVariants } from "@/components/ui/button";
import { CATEGORY_LABEL } from "@/lib/constants/domain";
import { formatDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CaseListItem } from "@/types/api";

export function CaseCard({
  item,
  href,
  actionLabel = "Abrir caso",
}: {
  item: CaseListItem;
  href: string;
  actionLabel?: string;
}) {
  const assignedTo = item.assignments[0]?.student.fullName;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-brand-line/60 bg-white/80 p-5 transition-shadow hover:shadow-soft">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-brand-line/60 bg-brand-paper px-2.5 py-0.5 font-mono text-[11px] font-semibold text-brand-night">
          {item.code}
        </span>
        <CaseStatusBadge status={item.status} />
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {CATEGORY_LABEL[item.category]}
        </span>
      </div>

      <div>
        <h3 className="text-base font-semibold text-brand-ink">{item.request.fullName}</h3>
        {item.summary ? (
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {item.summary}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-night/65">
        <span>{formatDateTime(item.updatedAt)}</span>
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
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mt-auto justify-between rounded-xl border border-brand-line/60",
        )}
      >
        {actionLabel}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
