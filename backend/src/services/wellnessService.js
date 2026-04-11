import { supabase } from '../config/supabase.js';
import { computeWellnessScore } from '../utils/wellness.js';
import { toDateOnly } from '../utils/date.js';

export async function calculateWellnessSummary(userId) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
  const fromDate = toDateOnly(sevenDaysAgo);

  const [{ data: user, error: userError }, { data: moods, error: moodsError }, { count: journalCount, error: journalError }] =
    await Promise.all([
      supabase
        .from('mindmitra_users')
        .select('id, streak_count, longest_streak')
        .eq('id', userId)
        .single(),
      supabase
        .from('mood_entries')
        .select('mood_value, entry_date')
        .eq('user_id', userId)
        .gte('entry_date', fromDate)
        .order('entry_date', { ascending: false }),
      supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', `${fromDate}T00:00:00.000Z`),
    ]);

  if (userError || !user) {
    throw new Error('User not found while calculating wellness');
  }

  if (moodsError) {
    throw new Error(moodsError.message);
  }

  if (journalError) {
    throw new Error(journalError.message);
  }

  const recentMoodAverage = moods?.length
    ? moods.reduce((sum, mood) => sum + mood.mood_value, 0) / moods.length
    : 0;

  const summary = {
    streakCount: user.streak_count || 0,
    longestStreak: user.longest_streak || 0,
    recentMoodAverage: Number(recentMoodAverage.toFixed(2)),
    journalEntriesThisWeek: journalCount || 0,
  };

  const score = computeWellnessScore(summary);

  const { error: updateError } = await supabase
    .from('mindmitra_users')
    .update({
      wellness_score: score,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return {
    ...summary,
    score,
  };
}
