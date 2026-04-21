export function MetricCard({
  label,
  value,
  help,
  accent = false,
}: {
  label: string;
  value: string;
  help: string;
  accent?: boolean;
}) {
  return (
    <div
      className={
        accent
          ? "rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-5"
          : "rounded-2xl border border-brand-line/60 bg-white/80 p-5"
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-night/60">
        {label}
      </p>
      <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-brand-ink">
        {value}
      </p>
      <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{help}</p>
    </div>
  );
}
