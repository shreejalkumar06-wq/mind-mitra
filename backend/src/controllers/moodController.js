import { supabase } from '../config/supabase.js';
import { updateDailyCheckIn } from '../services/streakService.js';
import { calculateWellnessSummary } from '../services/wellnessService.js';
import { toDateOnly } from '../utils/date.js';

export async function upsertMoodEntry(req, res) {
  const { userId } = req.params;
  const moodValue = Number(req.body?.moodValue);
  const note = req.body?.note?.trim() || null;
  const entryDate = toDateOnly(req.body?.entryDate || new Date());

  if (!Number.isInteger(moodValue) || moodValue < 1 || moodValue > 5) {
    const error = new Error('moodValue must be an integer between 1 and 5');
    error.statusCode = 400;
    throw error;
  }

  const { data, error } = await supabase
    .from('mood_entries')
    .upsert(
      {
        user_id: userId,
        mood_value: moodValue,
        note,
        entry_date: entryDate,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,entry_date',
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const streak = await updateDailyCheckIn(userId, entryDate);
  const wellness = await calculateWellnessSummary(userId);

  res.status(201).json({
    moodEntry: data,
    streak,
    wellness,
  });
}

export async function listMoodEntries(req, res) {
  const { userId } = req.params;
  const limit = Number(req.query.limit || 30);
  const from = req.query.from;
  const to = req.query.to;

  let query = supabase
    .from('mood_entries')
    .select('id, mood_value, note, entry_date, created_at, updated_at')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false })
    .limit(limit);

  if (from) {
    query = query.gte('entry_date', from);
  }

  if (to) {
    query = query.lte('entry_date', to);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  res.json({
    moods: data,
  });
}

export async function getTodayMood(req, res) {
  const { userId } = req.params;
  const today = toDateOnly();

  const { data, error } = await supabase
    .from('mood_entries')
    .select('id, mood_value, note, entry_date, created_at, updated_at')
    .eq('user_id', userId)
    .eq('entry_date', today)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  res.json({
    mood: data,
  });
}
