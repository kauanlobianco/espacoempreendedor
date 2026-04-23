import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-orange)] text-white shadow-[0_10px_24px_rgba(232,93,31,0.22)] hover:bg-[var(--brand-orange-deep)] hover:shadow-[0_14px_28px_rgba(232,93,31,0.28)]",
        dark:
          "bg-[var(--brand-ink)] text-white hover:bg-[var(--brand-night)] hover:shadow-soft",
        outline:
          "border-[var(--brand-line)] bg-white text-[var(--brand-ink)] hover:bg-[var(--brand-paper-deep)] hover:border-[var(--brand-ink)]",
        secondary:
          "bg-[var(--brand-paper-deep)] text-[var(--brand-ink)] hover:bg-[var(--brand-orange-ghost)]",
        ghost:
          "text-[var(--brand-ink)] hover:bg-[var(--brand-paper-deep)] aria-expanded:bg-[var(--brand-paper-deep)]",
        soft:
          "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)] hover:bg-[var(--brand-orange-soft)]",
        destructive:
          "bg-[var(--brand-red)]/10 text-[var(--brand-red)] hover:bg-[var(--brand-red)]/15 focus-visible:ring-destructive/20",
        link: "h-auto rounded-none px-0 py-0 text-[var(--brand-orange-deep)] underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default:
          "h-10 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-full px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-full px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 px-5 text-[0.95rem] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xl: "h-14 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
