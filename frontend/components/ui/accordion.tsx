"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type ItemCtx = { isOpen: boolean };
const ItemCtx = React.createContext<ItemCtx>({ isOpen: false });

function Accordion({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

const AccordionItem = React.forwardRef<
  HTMLDetailsElement,
  React.ComponentPropsWithoutRef<"details"> & { value: string }
>(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ItemCtx.Provider value={{ isOpen }}>
      <details
        ref={ref}
        className={cn("group border-b border-brand-line/60 last:border-b-0", className)}
        onToggle={(event) => setIsOpen((event.currentTarget as HTMLDetailsElement).open)}
        {...props}
      >
        {children}
      </details>
    </ItemCtx.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"summary">
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(ItemCtx);

  return (
    <summary
      ref={ref}
      className={cn(
        "flex w-full list-none items-center justify-between gap-4 py-4 text-left text-sm font-medium text-brand-ink transition-colors hover:text-brand-orange focus-visible:outline-none [&::-webkit-details-marker]:hidden",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          "size-4 shrink-0 text-brand-night/60 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    </summary>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-200 ease-out group-open:grid-rows-[1fr]",
      className,
    )}
    {...props}
  >
    <div className="min-h-0 overflow-hidden">
      <div className="pb-4 pr-8 text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  </div>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
