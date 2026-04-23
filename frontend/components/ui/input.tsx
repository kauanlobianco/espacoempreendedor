import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-[color:var(--brand-line)] bg-white px-3.5 py-2 text-sm text-[var(--brand-ink)] transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--brand-mute)] focus-visible:border-[var(--brand-orange)] focus-visible:ring-3 focus-visible:ring-[color:rgba(232,93,31,0.18)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--brand-paper-deep)] disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
