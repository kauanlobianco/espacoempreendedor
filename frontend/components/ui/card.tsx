import * as React from "react"

import { cn } from "@/lib/utils"

type CardSize = "default" | "sm" | "lg"
type CardTone = "default" | "elevated" | "muted" | "dark"

function Card({
  className,
  size = "default",
  tone = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: CardSize; tone?: CardTone }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-tone={tone}
      className={cn(
        "group/card relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-card py-6 text-sm text-card-foreground border border-[color:var(--brand-soft-line)] shadow-soft has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-2xl *:[img:last-child]:rounded-b-2xl",
        "data-[size=sm]:gap-3 data-[size=sm]:py-4 data-[size=sm]:rounded-xl data-[size=sm]:has-data-[slot=card-footer]:pb-0",
        "data-[size=lg]:gap-6 data-[size=lg]:py-8 data-[size=lg]:rounded-3xl",
        "data-[tone=elevated]:shadow-lift data-[tone=elevated]:border-[color:var(--brand-line)]",
        "data-[tone=muted]:bg-[var(--brand-paper-deep)] data-[tone=muted]:border-[color:var(--brand-soft-line)] data-[tone=muted]:shadow-none",
        "data-[tone=dark]:bg-[var(--brand-ink)] data-[tone=dark]:text-white data-[tone=dark]:border-transparent data-[tone=dark]:shadow-lift",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min items-start gap-1.5 px-6 group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-8 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-display text-2xl leading-tight tracking-tight group-data-[size=sm]/card:text-lg group-data-[size=lg]/card:text-3xl",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm leading-relaxed text-[var(--brand-mute)] group-data-[tone=dark]/card:text-white/70",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 group-data-[size=sm]/card:px-4 group-data-[size=lg]/card:px-8",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex items-center gap-3 border-t border-[color:var(--brand-soft-line)] bg-[color:var(--brand-paper-deep)]/60 px-6 py-4 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3 group-data-[size=lg]/card:px-8 group-data-[tone=dark]/card:bg-white/5 group-data-[tone=dark]/card:border-white/10",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
