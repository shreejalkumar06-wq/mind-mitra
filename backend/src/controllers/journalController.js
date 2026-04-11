import { supabase } from '../config/supabase.js';
import { updateDailyCheckIn } from '../services/streakService.js';
import { calculateWellnessSummary } from '../services/wellnessService.js';

export async function createJournalEntry(req, res) {
  const { userId } = req.params;
  const title = req.body?.title?.trim() || 'Untitled';
  const content = req.body?.content?.trim();

  if (!content) {
    const error = new Error('content is required');
    error.statusCode = 400;
    throw error;
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      title,
      content,
      is_private: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const streak = await updateDailyCheckIn(userId);
  const wellness = await calculateWellnessSummary(userId);

  res.status(201).json({
    journalEntry: data,
    streak,
    wellness,
  });
}

export async function listJournalEntries(req, res) {
  const { userId } = req.params;
  const limit = Number(req.query.limit || 50);

  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, title, content, is_private, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  res.json({
    entries: data,
  });
}

export async function getJournalEntry(req, res) {
  const { userId, entryId } = req.params;

  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, title, content, is_private, created_at, updated_at')
    .eq('id', entryId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Journal entry not found');
  }

  res.json({
    entry: data,
  });
}

export async function deleteJournalEntry(req, res) {
  const { userId, entryId } = req.params;

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  const wellness = await calculateWellnessSummary(userId);

  res.json({
    success: true,
    wellness,
  });
}
