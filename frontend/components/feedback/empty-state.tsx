import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  primaryHref,
  primaryLabel,
}: {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-line/60 bg-white/60 px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {primaryHref && primaryLabel ? (
        <Link href={primaryHref} className={cn(buttonVariants(), "mt-6 inline-flex")}>
          {primaryLabel}
        </Link>
      ) : null}
    </div>
  );
}
