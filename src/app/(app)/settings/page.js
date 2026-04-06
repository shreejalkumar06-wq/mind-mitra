'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import styles from '../shared.module.css';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const clearData = () => {
    if (confirm('This will delete all your local data (moods, journal, goals, gratitude). Continue?')) {
      localStorage.removeItem('mindmitra-moods');
      localStorage.removeItem('mindmitra-journal');
      localStorage.removeItem('mindmitra-goals');
      localStorage.removeItem('mindmitra-gratitude');
      alert('All data cleared.');
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Settings</h2>
      <p className={styles.sub}>Manage your preferences</p>

      <div className={styles.section}>
        <h3>Profile</h3>
        <div className={styles.list}>
          <div className={styles.listItem} style={{ cursor: 'default' }}>
            <div className={`${styles.listIcon} ${styles.accent}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <p className={styles.listTitle}>{user?.displayName || 'Anonymous'}</p>
              <p className={styles.listSub}>Anonymous user</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Appearance</h3>
        <div className={styles.list}>
          <div className={styles.listItem} onClick={toggleTheme}>
            <div className={`${styles.listIcon} ${styles.secondary}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{theme === 'dark' ? <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></> : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}</svg>
            </div>
            <div>
              <p className={styles.listTitle}>Theme</p>
              <p className={styles.listSub}>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.arrow}><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Data</h3>
        <div className={styles.list}>
          <div className={styles.listItem} onClick={clearData}>
            <div className={`${styles.listIcon} ${styles.warn}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </div>
            <div>
              <p className={styles.listTitle}>Clear All Data</p>
              <p className={styles.listSub}>Delete moods, journal, goals, gratitude</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.arrow}><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <div className={styles.listItem} onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <div className={`${styles.listIcon}`} style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <div>
              <p className={styles.listTitle} style={{ color: 'var(--danger)' }}>Sign Out</p>
              <p className={styles.listSub}>Clear session and return to landing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
