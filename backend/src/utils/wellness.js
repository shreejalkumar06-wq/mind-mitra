export function computeWellnessScore({
  recentMoodAverage = 0,
  streakCount = 0,
  journalEntriesThisWeek = 0,
}) {
  const moodScore = Math.min(100, Math.max(0, (recentMoodAverage / 5) * 100));
  const streakScore = Math.min(100, (Math.max(streakCount, 0) / 14) * 100);
  const journalScore = Math.min(100, (Math.max(journalEntriesThisWeek, 0) / 5) * 100);

  return Math.round(moodScore * 0.5 + streakScore * 0.3 + journalScore * 0.2);
}
