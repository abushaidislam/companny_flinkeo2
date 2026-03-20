// Human-friendly read time: minutes -> "X min read"
export function formatReadTime(minutes: number): string {
  if (!minutes || minutes < 1) return "Less than 1 min read";
  const m = Math.round(minutes);
  if (m <= 1) return "1 min read";
  return `${m} min read`;
}

// Date -> "Aug 15, 2025" (localized but concise)
export function formatPostDate(date: Date): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
