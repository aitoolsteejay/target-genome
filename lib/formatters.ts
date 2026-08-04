export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

export function formatHours(value: number): string {
  return `${formatNumber(value)} ${Math.round(value) === 1 ? "hour" : "hours"}`;
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatCurrency(value: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
}

export function formatWorkingDays(hours: number, hoursPerDay = 8): string {
  const days = hours / hoursPerDay;
  return `${days.toFixed(1)} working days`;
}

export function formatWeeks(hours: number, hoursPerWeek = 40): string {
  const weeks = hours / hoursPerWeek;
  return `${weeks.toFixed(1)} weeks`;
}
