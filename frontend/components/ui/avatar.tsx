import { cn } from "@/lib/utils";

const SIZE_STYLES: Record<string, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-14 text-lg",
};

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("");
}

export function Avatar({
  name,
  size = "md",
  tone = "orange",
  className,
}: {
  name: string;
  size?: keyof typeof SIZE_STYLES;
  tone?: "orange" | "ink" | "ghost";
  className?: string;
}) {
  const tones: Record<string, string> = {
    orange:
      "bg-[var(--brand-orange-ghost)] text-[var(--brand-orange-deep)] border border-[color:rgba(232,93,31,0.22)]",
    ink: "bg-[var(--brand-ink)] text-white",
    ghost:
      "bg-white text-[var(--brand-ink)] border border-[color:var(--brand-soft-line)]",
  };
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide",
        SIZE_STYLES[size],
        tones[tone],
        className,
      )}
    >
      {initialsOf(name) || "·"}
    </span>
  );
}
