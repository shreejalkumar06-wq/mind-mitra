'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

const EXERCISES = [
  { name: 'Box Breathing', desc: '4-4-4-4 pattern to calm your nervous system', in: 4, hold: 4, out: 4, holdOut: 4 },
  { name: '4-7-8 Relaxation', desc: 'Slow breathing for deep relaxation', in: 4, hold: 7, out: 8, holdOut: 0 },
  { name: 'Simple Calm', desc: 'Easy 4-4 in-out for beginners', in: 4, hold: 0, out: 4, holdOut: 0 },
];

const SOUNDS = ['Rain', 'Ocean', 'Forest', 'Wind', 'Fire'];

export default function MeditatePage() {
  const [active, setActive] = useState(null);
  const [phase, setPhase] = useState('');
  const [timer, setTimer] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const start = (ex) => {
    setActive(ex);
    setElapsed(0);
    setPhase('Breathe in');
    setTimer(ex.in);
  };

  const stop = () => {
    setActive(null);
    setPhase('');
    setTimer(0);
    setElapsed(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!active) return;
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setPhase(p => {
            if (p === 'Breathe in') { setTimer(active.hold || active.out); return active.hold ? 'Hold' : 'Breathe out'; }
            if (p === 'Hold') { setTimer(active.out); return 'Breathe out'; }
            if (p === 'Breathe out') { setTimer(active.holdOut || active.in); return active.holdOut ? 'Hold' : 'Breathe in'; }
            return 'Breathe in';
          });
          return 0;
        }
        return t - 1;
      });
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Meditate</h2>
      <p className={styles.sub}>Find calm through guided breathing</p>

      {active ? (
        <div className={styles.activeSession}>
          <div className={styles.breathContainer}>
            <div className={styles.breathCircle} data-phase={phase}>
              <span className={styles.phaseText}>{phase}</span>
              <span className={styles.timerText}>{timer}</span>
            </div>
          </div>
          <p className={styles.exerciseName}>{active.name}</p>
          <p className={styles.elapsed}>{mins}:{secs.toString().padStart(2,'0')}</p>
          <button className="btn btn-secondary" onClick={stop}>End Session</button>
        </div>
      ) : (
        <>
          <div className={styles.section}>
            <h3>Breathing Exercises</h3>
            <div className={styles.exerciseList}>
              {EXERCISES.map((ex, i) => (
                <button key={i} className={styles.exerciseCard} onClick={() => start(ex)}>
                  <div className={styles.exIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div>
                    <p className={styles.exName}>{ex.name}</p>
                    <p className={styles.exDesc}>{ex.desc}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="2" className={styles.arrow}><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Ambient Sounds</h3>
            <div className={styles.soundGrid}>
              {SOUNDS.map(s => (
                <div key={s} className={styles.soundCard}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <p className={styles.comingSoon}>Audio playback coming soon</p>
          </div>
        </>
      )}
    </div>
  );
}
