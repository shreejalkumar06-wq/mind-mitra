'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import styles from './page.module.css';

function normalizeEntry(entry) {
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    date: entry.created_at,
  };
}

export default function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEntries = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const response = await apiRequest(`/users/${user.id}/journal?limit=50`);
        setEntries(response.entries.map(normalizeEntry));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load your journal entries.');
      }
    };

    loadEntries();
  }, [user?.id]);

  const saveEntry = async () => {
    if (!content.trim() || !user?.id) {
      return;
    }

    try {
      setError('');
      const response = await apiRequest(`/users/${user.id}/journal`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const entry = normalizeEntry(response.journalEntry);
      setEntries((currentEntries) => [entry, ...currentEntries]);
      setTitle('');
      setContent('');
      setIsWriting(false);
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this journal entry.');
    }
  };

  const deleteEntry = async (entryId) => {
    if (!user?.id) {
      return;
    }

    try {
      setError('');
      await apiRequest(`/users/${user.id}/journal/${entryId}`, {
        method: 'DELETE',
      });
      setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== entryId));
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete this journal entry.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Journal</h2>
          <p className={styles.sub}>Your private space for thoughts</p>
        </div>
        {!isWriting && (
          <button className="btn btn-primary btn-sm" onClick={() => setIsWriting(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Entry
          </button>
        )}
      </div>

      {isWriting && (
        <div className={styles.editor}>
          <input className="input" placeholder="Title (optional)" value={title} onChange={(event) => setTitle(event.target.value)} />
          <textarea className={`input ${styles.textarea}`} placeholder="What's on your mind?" value={content} onChange={(event) => setContent(event.target.value)} rows={6} autoFocus />
          <div className={styles.editorActions}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setIsWriting(false); setTitle(''); setContent(''); }}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={saveEntry} disabled={!content.trim()}>Save</button>
          </div>
        </div>
      )}

      {error && <p className={styles.sub}>{error}</p>}

      {entries.length === 0 && !isWriting ? (
        <div className={styles.emptyState}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="1"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          <p>No journal entries yet</p>
          <button className="btn btn-primary btn-sm" onClick={() => setIsWriting(true)}>Write your first entry</button>
        </div>
      ) : (
        <div className={styles.entries}>
          {entries.map((entry) => (
            <div key={entry.id} className={styles.entryCard}>
              <div className={styles.entryHeader}>
                <h4>{entry.title}</h4>
                <span className={styles.entryDate}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className={styles.entryContent}>{entry.content}</p>
              <button className={styles.deleteBtn} onClick={() => deleteEntry(entry.id)} aria-label="Delete entry">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
