'use client';

import { useState, useEffect } from 'react';
import styles from '../shared.module.css';

const PROMPTS = [
  'What made you smile today?',
  'Name one person you appreciate and why.',
  'What is something you did well recently?',
  'Describe a place that brings you peace.',
  'What lesson did today teach you?',
  'What are you looking forward to?',
  'Name a small comfort that made your day better.',
  'What strength got you through a hard time?',
];

export default function GratitudePage() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    setEntries(JSON.parse(localStorage.getItem('mindmitra-gratitude') || '[]'));
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const add = () => {
    if (!text.trim()) return;
    const entry = { id: Date.now(), text, date: new Date().toISOString() };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('mindmitra-gratitude', JSON.stringify(updated));
    setText('');
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const remove = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('mindmitra-gratitude', JSON.stringify(updated));
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Gratitude</h2>
      <p className={styles.sub}>{prompt}</p>

      <div className={styles.inputRow}>
        <input className="input" placeholder="I'm grateful for..." value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="btn btn-primary btn-sm" onClick={add} disabled={!text.trim()}>Add</button>
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>Your gratitude wall is empty. Add your first one above.</p>
      ) : (
        entries.map(e => (
          <div key={e.id} className={styles.card}>
            <p>{e.text}</p>
            <span className={styles.cardDate}>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
          </div>
        ))
      )}
    </div>
  );
}
