import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full min-w-0 resize-y rounded-xl border border-[color:var(--brand-line)] bg-white px-3.5 py-3 text-sm text-[var(--brand-ink)] leading-relaxed transition-colors outline-none placeholder:text-[var(--brand-mute)] focus-visible:border-[var(--brand-orange)] focus-visible:ring-3 focus-visible:ring-[color:rgba(232,93,31,0.18)] disabled:cursor-not-allowed disabled:bg-[var(--brand-paper-deep)] disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
