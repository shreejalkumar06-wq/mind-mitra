'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const MOODS = [
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, label: 'Terrible', value: 1, color: 'var(--mood-bad)' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1-1.5-4-1.5S8 16 8 16"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, label: 'Low', value: 2, color: 'var(--mood-low)' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, label: 'Okay', value: 3, color: 'var(--mood-okay)' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, label: 'Good', value: 4, color: 'var(--mood-good)' },
  { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, label: 'Great', value: 5, color: 'var(--mood-great)' },
];

export default function MoodPage() {
  const [moods, setMoods] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mindmitra-moods') || '[]');
    setMoods(saved);
    const today = new Date().toDateString();
    const entry = saved.find(m => new Date(m.date).toDateString() === today);
    if (entry) setTodayMood(entry.value);
  }, []);

  const logMood = (value) => {
    setTodayMood(value);
    const saved = JSON.parse(localStorage.getItem('mindmitra-moods') || '[]');
    const filtered = saved.filter(m => new Date(m.date).toDateString() !== new Date().toDateString());
    const entry = { value, date: new Date().toISOString(), note };
    filtered.push(entry);
    localStorage.setItem('mindmitra-moods', JSON.stringify(filtered));
    setMoods(filtered);
    setNote('');
  };

  const last7 = moods.slice(-7);

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Mood Tracker</h2>
      <p className={styles.sub}>How are you feeling right now?</p>

      <div className={styles.moodGrid}>
        {MOODS.map((m) => (
          <button key={m.value} className={`${styles.moodBtn} ${todayMood === m.value ? styles.active : ''}`} onClick={() => logMood(m.value)} style={{'--mc': m.color}}>
            <span className={styles.moodIcon}>{m.icon}</span>
            <span className={styles.moodLabel}>{m.label}</span>
          </button>
        ))}
      </div>

      {todayMood && (
        <div className={styles.logged}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Mood logged for today
        </div>
      )}

      <div className={styles.section}>
        <h3>Recent History</h3>
        {last7.length === 0 ? (
          <p className={styles.empty}>No moods logged yet. Start tracking above.</p>
        ) : (
          <div className={styles.history}>
            {last7.map((m, i) => {
              const d = new Date(m.date);
              const day = d.toLocaleDateString('en-US', { weekday: 'short' });
              const mood = MOODS.find(x => x.value === m.value);
              return (
                <div key={i} className={styles.historyItem}>
                  <span className={styles.historyDay}>{day}</span>
                  <div className={styles.historyDot} style={{ background: mood?.color }} />
                  <span className={styles.historyLabel}>{mood?.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
