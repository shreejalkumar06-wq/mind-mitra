'use client';

import { useState, useEffect } from 'react';
import styles from '../shared.module.css';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setGoals(JSON.parse(localStorage.getItem('mindmitra-goals') || '[]'));
  }, []);

  const save = (updated) => {
    setGoals(updated);
    localStorage.setItem('mindmitra-goals', JSON.stringify(updated));
  };

  const addGoal = () => {
    if (!title.trim()) return;
    const goal = { id: Date.now(), title, progress: 0, date: new Date().toISOString() };
    save([goal, ...goals]);
    setTitle('');
    setIsAdding(false);
  };

  const updateProgress = (id, delta) => {
    save(goals.map(g => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + delta)) } : g));
  };

  const removeGoal = (id) => save(goals.filter(g => g.id !== id));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Goals</h2>
          <p className={styles.sub}>Small steps lead to big changes</p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary btn-sm" onClick={() => setIsAdding(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Goal
          </button>
        )}
      </div>

      {isAdding && (
        <div className={styles.inputRow}>
          <input className="input" placeholder="What do you want to achieve?" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGoal()} autoFocus />
          <button className="btn btn-primary btn-sm" onClick={addGoal}>Add</button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setIsAdding(false); setTitle(''); }}>Cancel</button>
        </div>
      )}

      {goals.length === 0 && !isAdding ? (
        <p className={styles.empty}>No goals yet. Set your first one to start tracking progress.</p>
      ) : (
        goals.map(g => (
          <div key={g.id} className={styles.card}>
            <h4>{g.title}</h4>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${g.progress}%` }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFeatureSettings: "'tnum'" }}>{g.progress}%</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => updateProgress(g.id, 10)}>+10%</button>
                <button className="btn btn-ghost btn-sm" onClick={() => removeGoal(g.id)} style={{ color: 'var(--danger)' }}>Remove</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
