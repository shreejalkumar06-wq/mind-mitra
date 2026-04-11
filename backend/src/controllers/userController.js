import { supabase } from '../config/supabase.js';
import { generateAnonymousName } from '../utils/aliasGenerator.js';
import { calculateWellnessSummary } from '../services/wellnessService.js';

const DEFAULT_AVATARS = [
  '/avatars/lotus.svg',
  '/avatars/leaf.svg',
  '/avatars/sun.svg',
  '/avatars/moon.svg',
  '/avatars/star.svg',
  '/avatars/cloud.svg',
  '/avatars/wave.svg',
  '/avatars/bird.svg',
];

function getRandomAvatar() {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
}

export async function createAnonymousUser(req, res) {
  const displayName = req.body?.displayName?.trim() || generateAnonymousName();
  const avatarUrl = req.body?.avatarUrl?.trim() || getRandomAvatar();

  const { data, error } = await supabase
    .from('mindmitra_users')
    .insert({
      display_name: displayName,
      avatar_url: avatarUrl,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  res.status(201).json({
    user: {
      id: data.id,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      streakCount: data.streak_count,
      wellnessScore: data.wellness_score,
    },
  });
}

export async function getUserSummary(req, res) {
  const { userId } = req.params;

  const [{ data: user, error }, wellness] = await Promise.all([
    supabase
      .from('mindmitra_users')
      .select('id, display_name, avatar_url, created_at, streak_count, longest_streak, wellness_score, last_check_in_date')
      .eq('id', userId)
      .single(),
    calculateWellnessSummary(userId),
  ]);

  if (error || !user) {
    throw new Error('User not found');
  }

  res.json({
    user: {
      id: user.id,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      lastCheckInDate: user.last_check_in_date,
      streakCount: user.streak_count,
      longestStreak: user.longest_streak,
      wellnessScore: wellness.score,
    },
    wellness,
  });
}

export async function getUserStreak(req, res) {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from('mindmitra_users')
    .select('id, streak_count, longest_streak, last_check_in_date')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new Error('User not found');
  }

  res.json({
    userId: data.id,
    streakCount: data.streak_count || 0,
    longestStreak: data.longest_streak || 0,
    lastCheckInDate: data.last_check_in_date,
  });
}

export async function getUserWellness(req, res) {
  const { userId } = req.params;
  const summary = await calculateWellnessSummary(userId);
  res.json(summary);
}
