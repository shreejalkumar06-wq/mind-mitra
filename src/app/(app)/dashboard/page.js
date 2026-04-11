'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import Link from 'next/link';
import styles from './page.module.css';

const AFFIRMATIONS = [
  'You are worthy of love and belonging.',
  "It's okay to not be okay sometimes.",
  'Every small step forward is still progress.',
  'You are stronger than you think.',
  'Your feelings are valid and important.',
  'Today is a new beginning full of possibilities.',
  "Be gentle with yourself. You're doing the best you can.",
  'You deserve rest and peace of mind.',
  "Growth isn't always visible, but it's always happening.",
  'You are enough, exactly as you are right now.',
];

const MOODS = [
  { icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
  ), label: 'Terrible', value: 1, color: 'var(--mood-bad)' },
  { icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1-1.5-4-1.5S8 16 8 16" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
  ), label: 'Low', value: 2, color: 'var(--mood-low)' },
  { icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="8" y1="15" x2="16" y2="15" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
  ), label: 'Okay', value: 3, color: 'var(--mood-okay)' },
  { icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
  ), label: 'Good', value: 4, color: 'var(--mood-good)' },
  { icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /><path d="M12 17v.01" /></svg>
  ), label: 'Great', value: 5, color: 'var(--mood-great)' },
];

const ACTIONS = [
  { title: 'Write', sub: 'Journal entry', href: '/journal', color: 'accent',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  },
  { title: 'Meditate', sub: 'Find calm', href: '/meditate', color: 'secondary',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  },
  { title: 'Talk', sub: 'Anonymous chat', href: '/chat', color: 'accent',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  },
  { title: 'Gratitude', sub: "What's good?", href: '/gratitude', color: 'secondary',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  },
];

export default function DashboardPage() {
  const { user, updateUser } = useAuth();
  const [affirmation, setAffirmation] = useState('');
  const [todayMood, setTodayMood] = useState(null);
  const [moodLogged, setMoodLogged] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const [summaryResponse, todayMoodResponse] = await Promise.all([
          apiRequest(`/users/${user.id}/summary`),
          apiRequest(`/users/${user.id}/moods/today`),
        ]);

        setWellnessScore(summaryResponse.wellness.score || 0);
        setStreakDays(summaryResponse.wellness.streakCount || 0);
        updateUser({
          streakCount: summaryResponse.wellness.streakCount || 0,
          wellnessScore: summaryResponse.wellness.score || 0,
        });

        if (todayMoodResponse.mood) {
          setTodayMood(todayMoodResponse.mood.mood_value);
          setMoodLogged(true);
        } else {
          setTodayMood(null);
          setMoodLogged(false);
        }
      } catch (loadError) {
        setError(loadError.message || 'Unable to load your dashboard.');
      }
    };

    loadDashboard();
  }, [user?.id, updateUser]);

  const handleMoodLog = async (value) => {
    if (!user?.id) {
      return;
    }

    try {
      const response = await apiRequest(`/users/${user.id}/moods`, {
        method: 'POST',
        body: JSON.stringify({
          moodValue: value,
        }),
      });

      setTodayMood(value);
      setMoodLogged(true);
      setWellnessScore(response.wellness.score || 0);
      setStreakDays(response.streak.streakCount || 0);
      updateUser({
        streakCount: response.streak.streakCount || 0,
        wellnessScore: response.wellness.score || 0,
      });
      setError('');
    } catch (saveError) {
      setError(saveError.message || 'Unable to log your mood right now.');
    }
  };

  return (
    <div className={styles.dash}>
      <div className={styles.bento}>
        <div className={styles.affirmation}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)" opacity="0.6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          <p>&ldquo;{affirmation}&rdquo;</p>
        </div>

        <div className={styles.scoreCard}>
          <div className={styles.scoreRing}>
            <svg viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" strokeWidth="2.5" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray={`${wellnessScore}, 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            </svg>
            <span className={styles.scoreNum}>{wellnessScore}</span>
          </div>
          <div>
            <p className={styles.scoreLabel}>Wellness</p>
            <p className={styles.scoreSub}>Mood + streak + journaling</p>
          </div>
        </div>

        <div className={styles.streakCard}>
          <span className={styles.streakNum}>{streakDays}</span>
          <p className={styles.scoreLabel}>Day streak</p>
          <p className={styles.scoreSub}>{streakDays > 0 ? 'Keep it up' : 'Start today'}</p>
        </div>
      </div>

      <div className={styles.moodCard}>
        <div className={styles.moodHeader}>
          <h3>{moodLogged ? "Today's check-in" : 'How are you feeling?'}</h3>
          {moodLogged && (
            <span className={styles.moodCheck}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Logged
            </span>
          )}
        </div>
        <div className={styles.moodRow}>
          {MOODS.map((mood) => (
            <button
              key={mood.value}
              className={`${styles.moodBtn} ${todayMood === mood.value ? styles.moodActive : ''}`}
              onClick={() => handleMoodLog(mood.value)}
              aria-label={`Log mood: ${mood.label}`}
              style={{ '--mc': mood.color }}
            >
              <span className={styles.moodIcon}>{mood.icon}</span>
              <span className={styles.moodLabel}>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className={styles.scoreSub}>{error}</p>}

      <div className={styles.actionsSection}>
        <h3>Quick actions</h3>
        <div className={styles.actionsGrid}>
          {ACTIONS.map((action, index) => (
            <Link key={index} href={action.href} className={styles.actionCard}>
              <div className={`${styles.actionIcon} ${styles[`icon_${action.color}`]}`}>{action.icon}</div>
              <div>
                <p className={styles.actionTitle}>{action.title}</p>
                <p className={styles.actionSub}>{action.sub}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="2" className={styles.actionArrow}><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.breathCard}>
        <div className={styles.breathText}>
          <h3>Take a breath</h3>
          <p>2 minutes of breathing reduces stress by 44%.</p>
          <Link href="/meditate" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>Start exercise</Link>
        </div>
        <div className={styles.breathVisual}>
          <div className={styles.breathRing} />
          <div className={styles.breathRing2} />
        </div>
      </div>
    </div>
  );
}
