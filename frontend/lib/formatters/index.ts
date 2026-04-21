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

export function formatHours(value?: number | null) {
  if (typeof value !== "number") return "0 h";

  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} h`;
}

export function maskCpf(value?: string | null) {
  if (!value) return "Não informado";

  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return value;

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
