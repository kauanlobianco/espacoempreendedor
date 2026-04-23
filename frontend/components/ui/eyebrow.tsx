import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  tone = "orange",
  className,
}: {
  children: React.ReactNode;
  tone?: "orange" | "mute" | "white";
  className?: string;
}) {
  const tones: Record<string, string> = {
    orange: "text-[var(--brand-orange-deep)]",
    mute: "text-[var(--brand-mute)]",
    white: "text-white/70",
  };
  return (
    <span className={cn("font-eyebrow", tones[tone], className)}>{children}</span>
  );
}
