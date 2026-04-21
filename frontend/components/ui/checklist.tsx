import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function Checklist({
  items,
  className,
}: {
  items: ReadonlyArray<string>;
  className?: string;
}) {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-6 text-brand-night/85"
        >
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
            <Check className="size-3" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
