import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function SiteLogo({
  href = "/",
  className,
  invert = false,
}: {
  href?: string;
  className?: string;
  invert?: boolean;
  labelClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-0", className)}
      aria-label="Espaço do Empreendedor"
    >
      <div className="relative h-16 w-[5.6rem] shrink-0 overflow-hidden rounded-xl md:h-20 md:w-[6.8rem]">
        <Image
          src="/brand/logo-v2.png"
          alt=""
          fill
          className={cn("object-contain", invert && "brightness-110")}
          priority
        />
      </div>
      <div className={cn("hidden sm:block -ml-3", invert ? "text-white" : "text-brand-ink")}>
        <span className="block text-base font-bold uppercase leading-none tracking-wide md:text-xl">
          Espaço
        </span>
        <span
          className={cn(
            "block text-[11px] font-semibold uppercase tracking-[0.2em] md:text-sm",
            invert ? "text-white/60" : "text-muted-foreground",
          )}
        >
          do empreendedor
        </span>
      </div>
    </Link>
  );
}
