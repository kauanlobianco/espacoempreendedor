import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function SiteLogo({
  href = "/",
  className,
  invert = false,
  size = "md",
  wordmarkOnly = false,
}: {
  href?: string;
  className?: string;
  invert?: boolean;
  size?: "sm" | "md" | "lg";
  wordmarkOnly?: boolean;
}) {
  const dimensions: Record<string, { box: string; word: string; sub: string }> = {
    sm: {
      box: "h-12 w-[4rem] md:h-14 md:w-[5rem]",
      word: "text-base md:text-lg",
      sub: "text-[10px] md:text-[11px]",
    },
    md: {
      box: "h-16 w-[5.6rem] md:h-20 md:w-[6.8rem]",
      word: "text-xl md:text-2xl",
      sub: "text-[11px] md:text-[12.5px]",
    },
    lg: {
      box: "h-20 w-[7rem] md:h-24 md:w-[8.4rem]",
      word: "text-2xl md:text-3xl",
      sub: "text-[12px] md:text-sm",
    },
  };
  const d = dimensions[size];

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-0", className)}
      aria-label="Espaço do Empreendedor"
    >
      {!wordmarkOnly ? (
        <div className={cn("relative shrink-0 overflow-hidden", d.box)}>
          <Image
            src="/brand/logo-v2.png"
            alt=""
            fill
            className={cn("object-contain", invert && "brightness-110")}
            priority
          />
        </div>
      ) : null}

      <div
        className={cn(
          "block",
          !wordmarkOnly && "hidden sm:block -ml-2",
          wordmarkOnly && "ml-0",
          invert ? "text-white" : "text-[var(--brand-ink)]",
        )}
      >
        <span
          className={cn(
            "block font-display font-medium leading-none tracking-tight",
            d.word,
          )}
        >
          Espaço
          <em
            className={cn(
              "not-italic",
              invert ? "text-[var(--brand-orange)]" : "text-[var(--brand-orange-deep)]",
            )}
          >
            .
          </em>
        </span>
        <span
          className={cn(
            "block font-eyebrow",
            d.sub,
            invert ? "text-white/60" : "text-[var(--brand-mute)]",
          )}
        >
          do empreendedor
        </span>
      </div>
    </Link>
  );
}
