export function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatRelativeTime(value?: string | null) {
  if (!value) return "—";

  const target = new Date(value).getTime();
  const now = Date.now();
  const diffMs = now - target;

  if (diffMs < 60 * 1000) return "agora";

  const diffMin = Math.floor(diffMs / (60 * 1000));
  if (diffMin < 60) return `ha ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `ha ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `ha ${diffDays}d`;

  return formatDateTime(value);
}

export function formatHours(value?: number | null) {
  if (typeof value !== "number") return "0 h";

  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} h`;
}

export function maskCpf(value?: string | null) {
  if (!value) return "Nao informado";

  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return value;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
