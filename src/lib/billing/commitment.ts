export function computeCommitmentStatus(commitmentStartsAt: string | null) {
  if (!commitmentStartsAt) {
    return { end: null, withinCommitment: false, remainingMonths: 0 };
  }
  const start = new Date(commitmentStartsAt);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 6);
  const now = new Date();
  const withinCommitment = end > now;
  const remainingMonths = withinCommitment
    ? Math.ceil((end.getTime() - now.getTime()) / (30 * 24 * 60 * 60 * 1000))
    : 0;
  return { end, withinCommitment, remainingMonths };
}
