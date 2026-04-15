/** Amounts are stored as integer yen (JPY is zero-decimal). */
export function formatJpy(yen: number | null | undefined): string {
  if (yen == null) return '—';
  return `¥${yen.toLocaleString('ja-JP')}`;
}
