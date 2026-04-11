'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import styles from './page.module.css';

const MOODS = [
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>, label: 'Terrible', value: 1, color: 'var(--mood-bad)' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M16 16s-1-1.5-4-1.5S8 16 8 16" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>, label: 'Low', value: 2, color: 'var(--mood-low)' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="8" y1="15" x2="16" y2="15" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>, label: 'Okay', value: 3, color: 'var(--mood-okay)' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>, label: 'Good', value: 4, color: 'var(--mood-good)' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>, label: 'Great', value: 5, color: 'var(--mood-great)' },
];

function normalizeMood(entry) {
  return {
    id: entry.id,
    value: entry.mood_value,
    note: entry.note,
    date: entry.entry_date,
  };
}

export default function MoodPage() {
  const { user } = useAuth();
  const [moods, setMoods] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMoods = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const response = await apiRequest(`/users/${user.id}/moods?limit=30`);
        const normalized = response.moods.map(normalizeMood);
        setMoods(normalized);
        const today = new Date().toISOString().slice(0, 10);
        const entry = normalized.find((mood) => mood.date === today);
        if (entry) {
          setTodayMood(entry.value);
          setNote(entry.note || '');
        }
      } catch (loadError) {
        setError(loadError.message || 'Unable to load mood history.');
      }
    };

    loadMoods();
  }, [user?.id]);

  const logMood = async (value) => {
    if (!user?.id) {
      return;
    }

    try {
      setError('');
      const response = await apiRequest(`/users/${user.id}/moods`, {
        method: 'POST',
        body: JSON.stringify({
          moodValue: value,
          note,
        }),
      });

      const moodEntry = normalizeMood(response.moodEntry);
      setTodayMood(moodEntry.value);
      setNote(moodEntry.note || '');
      setMoods((currentMoods) => {
        const filtered = currentMoods.filter((entry) => entry.date !== moodEntry.date);
        return [moodEntry, ...filtered];
      });
    } catch (saveError) {
      setError(saveError.message || 'Unable to save your mood right now.');
    }
  };

  const last7 = moods.slice(0, 7);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Mood Tracker</h2>
      <p className={styles.sub}>How are you feeling right now?</p>

      <div className={styles.moodGrid}>
        {MOODS.map((m) => (
          <button key={m.value} className={`${styles.moodBtn} ${todayMood === m.value ? styles.active : ''}`} onClick={() => logMood(m.value)} style={{ '--mc': m.color }}>
            <span className={styles.moodIcon}>{m.icon}</span>
            <span className={styles.moodLabel}>{m.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.section}>
        <h3>Reflection note</h3>
        <textarea
          className="input"
          rows={3}
          placeholder="Add a private note for today's mood"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </div>

      {todayMood && (
        <div className={styles.logged}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          Mood logged for today
        </div>
      )}

      {error && <p className={styles.empty}>{error}</p>}

      <div className={styles.section}>
        <h3>Recent History</h3>
        {last7.length === 0 ? (
          <p className={styles.empty}>No moods logged yet. Start tracking above.</p>
        ) : (
          <div className={styles.history}>
            {last7.map((mood) => {
              const day = new Date(`${mood.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
              const moodMeta = MOODS.find((item) => item.value === mood.value);
              return (
                <div key={mood.id} className={styles.historyItem}>
                  <span className={styles.historyDay}>{day}</span>
                  <div className={styles.historyDot} style={{ background: moodMeta?.color }} />
                  <span className={styles.historyLabel}>{moodMeta?.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
