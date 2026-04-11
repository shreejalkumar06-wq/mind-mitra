import { supabase } from '../config/supabase.js';
import { addDays, toDateOnly } from '../utils/date.js';

export async function updateDailyCheckIn(userId, entryDate = new Date()) {
  const currentDate = toDateOnly(entryDate);

  const { data: user, error } = await supabase
    .from('mindmitra_users')
    .select('id, last_check_in_date, streak_count, longest_streak')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new Error('User not found for streak update');
  }

  const lastDate = user.last_check_in_date;
  let streakCount = user.streak_count || 0;

  if (lastDate === currentDate) {
    return {
      streakCount,
      longestStreak: user.longest_streak || streakCount,
      lastCheckInDate: currentDate,
    };
  }

  if (!lastDate) {
    streakCount = 1;
  } else if (addDays(lastDate, 1) === currentDate) {
    streakCount += 1;
  } else {
    streakCount = 1;
  }

  const longestStreak = Math.max(user.longest_streak || 0, streakCount);

  const { error: updateError } = await supabase
    .from('mindmitra_users')
    .update({
      last_check_in_date: currentDate,
      streak_count: streakCount,
      longest_streak: longestStreak,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return {
    streakCount,
    longestStreak,
    lastCheckInDate: currentDate,
  };
}
