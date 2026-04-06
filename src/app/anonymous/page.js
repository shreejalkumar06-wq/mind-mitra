'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

const AVATARS = [
  { src: '/avatars/lotus.svg', name: 'Lotus' },
  { src: '/avatars/leaf.svg', name: 'Leaf' },
  { src: '/avatars/sun.svg', name: 'Sun' },
  { src: '/avatars/moon.svg', name: 'Moon' },
  { src: '/avatars/star.svg', name: 'Star' },
  { src: '/avatars/cloud.svg', name: 'Cloud' },
  { src: '/avatars/wave.svg', name: 'Wave' },
  { src: '/avatars/bird.svg', name: 'Bird' },
];

export default function AnonymousEntryPage() {
  const router = useRouter();
  const { loginAnonymous, shuffleIdentity } = useAuth();
  const [identity, setIdentity] = useState(shuffleIdentity());
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isEntering, setIsEntering] = useState(false);

  const handleShuffle = () => setIdentity(shuffleIdentity());

  const handleEnter = () => {
    setIsEntering(true);
    loginAnonymous(identity.displayName, AVATARS[selectedAvatar].src);
    setTimeout(() => router.push('/dashboard'), 500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button className={`btn btn-ghost btn-sm ${styles.back}`} onClick={() => router.push('/')} aria-label="Back to home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back
        </button>

        <div className={styles.header}>
          <div className={styles.shield}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Enter your safe space</h3>
          <p>Pick an avatar and alias. Nothing else needed.</p>
        </div>

        <div className={styles.section}>
          <label className="label">Avatar</label>
          <div className={styles.avatarGrid}>
            {AVATARS.map((a, i) => (
              <button
                key={i}
                className={`${styles.avatarBtn} ${selectedAvatar === i ? styles.avatarActive : ''}`}
                onClick={() => setSelectedAvatar(i)}
                aria-label={`Select ${a.name}`}
              >
                <img src={a.src} alt={a.name} width={36} height={36} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className="label">Your alias</label>
          <div className={styles.aliasRow}>
            <div className={styles.aliasDisplay}>
              <img src={AVATARS[selectedAvatar].src} alt="" width={24} height={24} style={{borderRadius:'50%'}} />
              <span>{identity.displayName}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleShuffle} aria-label="Shuffle alias">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              Shuffle
            </button>
          </div>
        </div>

        <div className={styles.promises}>
          {['No email or phone', 'Data stays on device', 'Leave anytime'].map((p, i) => (
            <div key={i} className={styles.promiseRow}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{p}</span>
            </div>
          ))}
        </div>

        <button
          className={`btn btn-primary btn-lg w-full`}
          onClick={handleEnter}
          disabled={isEntering}
          id="enter-safe-space"
        >
          {isEntering ? <span className={styles.spinner} /> : (
            <>
              Enter Safe Space
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
