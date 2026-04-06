'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className={styles.header}>
      <div className={styles.greeting}>
        <h2>{greeting()}</h2>
        {user && <p>Welcome back, {user.displayName}</p>}
      </div>

      <div className={styles.actions}>


        {user && (
          <div className={styles.userChip}>
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              width={28}
              height={28}
              className={styles.avatar}
            />
            <span className={styles.userName}>{user.displayName}</span>
          </div>
        )}
      </div>
    </header>
  );
}
