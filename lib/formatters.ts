export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatLakh(value: number): string {
  return `₹${value}L`;
}

export function formatCompRange(minLakh: number, maxLakh: number): string {
  return `₹${minLakh}–${maxLakh} lakh`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
