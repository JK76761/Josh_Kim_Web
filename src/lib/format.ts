const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDateLabel(value: string): string {
  if (value === "Present" || value.includes("Expected")) {
    return value;
  }

  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return value;
  }

  const monthIndex = Number(match[2]) - 1;
  const monthLabel = MONTHS[monthIndex] ?? "";

  return `${monthLabel} ${match[1]}`.trim();
}

export function getDisplayName(value: string): string {
  return value.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
}
