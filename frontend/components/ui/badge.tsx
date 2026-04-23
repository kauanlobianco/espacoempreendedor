import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 rounded-full border border-transparent px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-wide whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)] border-[color:rgba(232,93,31,0.18)]",
        secondary:
          "bg-[var(--brand-paper-deep)] text-[var(--brand-night)] border-[color:var(--brand-soft-line)]",
        destructive:
          "bg-[color:rgba(168,42,31,0.10)] text-[var(--brand-red)] border-[color:rgba(168,42,31,0.18)]",
        outline:
          "border-[color:var(--brand-line)] bg-transparent text-[var(--brand-ink)]",
        ghost:
          "bg-white text-[var(--brand-mute)] border-[color:var(--brand-soft-line)]",
        link: "text-[var(--brand-orange-deep)] underline-offset-4 hover:underline",
        green:
          "bg-[color:rgba(47,125,91,0.10)] text-[var(--brand-green)] border-[color:rgba(47,125,91,0.18)]",
        amber:
          "bg-[color:rgba(178,113,0,0.10)] text-[var(--brand-amber)] border-[color:rgba(178,113,0,0.20)]",
        red:
          "bg-[color:rgba(168,42,31,0.10)] text-[var(--brand-red)] border-[color:rgba(168,42,31,0.18)]",
        blue:
          "bg-[color:rgba(30,95,140,0.10)] text-[var(--brand-blue)] border-[color:rgba(30,95,140,0.18)]",
        orange:
          "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)] border-[color:rgba(232,93,31,0.18)]",
        dark: "bg-[var(--brand-ink)] text-white border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
