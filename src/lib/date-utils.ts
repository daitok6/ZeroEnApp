/**
 * Safely adds months to an ISO date string, clamping to the last day of the
 * target month if the original day would overflow (e.g. Aug 31 + 6 → Feb 28).
 */
export function addMonths(isoString: string, months: number): Date {
  const d = new Date(isoString);
  const target = new Date(d.getFullYear(), d.getMonth() + months, d.getDate());
  const expectedMonth = ((d.getMonth() + months) % 12 + 12) % 12;
  if (target.getMonth() !== expectedMonth) {
    // Day overflowed — clamp to last day of target month
    return new Date(d.getFullYear(), d.getMonth() + months + 1, 0);
  }
  return target;
}

export function formatDate(isoString: string, locale: string): string {
  return new Date(isoString).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
