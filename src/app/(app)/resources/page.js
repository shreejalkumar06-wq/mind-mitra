'use client';

import { useState } from 'react';
import styles from './page.module.css';

const RESOURCES = [
  {
    name: 'CBT Thought Record',
    desc: 'Challenge negative thinking patterns',
    tag: 'CBT',
    detail: 'Cognitive Behavioral Therapy (CBT) thought records help you identify, evaluate, and restructure negative automatic thoughts.\n\n**How to use:**\n1. Describe the situation\n2. Note your automatic thought\n3. Identify the emotion (and rate 0-100)\n4. Look for evidence FOR and AGAINST\n5. Create a balanced alternative thought\n6. Re-rate your emotion',
  },
  {
    name: 'Grounding 5-4-3-2-1',
    desc: 'Sensory technique for anxiety relief',
    tag: 'Anxiety',
    detail: 'The 5-4-3-2-1 grounding technique uses your senses to bring you back to the present moment during anxiety or panic.\n\n**Steps:**\n• 5 — things you can SEE\n• 4 — things you can TOUCH\n• 3 — things you can HEAR\n• 2 — things you can SMELL\n• 1 — thing you can TASTE\n\nTake slow breaths between each step.',
  },
  {
    name: 'DBT Distress Tolerance',
    desc: 'Skills for handling emotional crises',
    tag: 'DBT',
    detail: 'TIPP skills from Dialectical Behavior Therapy for rapid emotion regulation:\n\n**T** — Temperature: Splash cold water on your face\n**I** — Intense exercise: Run, jump, do pushups for 10 mins\n**P** — Paced breathing: Breathe out longer than you breathe in\n**P** — Progressive muscle relaxation: Tense and release each muscle group',
  },
  {
    name: 'Sleep Hygiene Guide',
    desc: 'Evidence-based tips for better sleep',
    tag: 'Sleep',
    detail: 'Research-backed practices for better sleep quality:\n\n1. Keep a consistent sleep schedule (even weekends)\n2. Avoid screens 1 hour before bed\n3. Keep your room cool (65-68°F / 18-20°C)\n4. Limit caffeine after 2 PM\n5. Use your bed only for sleep\n6. Try a body scan meditation before bed\n7. Avoid heavy meals 2-3 hours before sleep',
  },
  {
    name: 'Cognitive Distortions',
    desc: 'Identify and reframe thinking traps',
    tag: 'CBT',
    detail: 'Common thinking traps that fuel anxiety and depression:\n\n• **All-or-nothing**: Seeing things as black or white\n• **Catastrophizing**: Expecting the worst outcome\n• **Mind reading**: Assuming you know what others think\n• **Should statements**: Rigid rules about how things must be\n• **Emotional reasoning**: "I feel it, so it must be true"\n• **Personalization**: Blaming yourself for everything\n\nOnce you spot the pattern, you can challenge it.',
  },
  {
    name: 'Mindful Body Scan',
    desc: 'Progressive relaxation technique',
    tag: 'Mindfulness',
    detail: 'A guided body scan for releasing tension:\n\n1. Lie down comfortably. Close your eyes.\n2. Start at your toes — notice any sensation without judging\n3. Slowly move attention upward: feet → calves → knees → thighs\n4. Continue: hips → belly → chest → hands → arms → shoulders\n5. Finish: neck → jaw → face → top of head\n6. Take 3 deep breaths and gently open your eyes\n\nDuration: 10-20 minutes. Best done before bed.',
  },
];

export default function ResourcesPage() {
  const [active, setActive] = useState(null);

  if (active !== null) {
    const r = RESOURCES[active];
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => setActive(null)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Resources
        </button>
        <div className={styles.detailCard}>
          <span className={styles.detailTag}>{r.tag}</span>
          <h2 className={styles.detailTitle}>{r.name}</h2>
          <p className={styles.detailSub}>{r.desc}</p>
          <div className={styles.detailBody}>
            {r.detail.split('\n').map((line, i) => {
              if (!line.trim()) return <br key={i} />;
              const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              return <p key={i} className={styles.detailLine} dangerouslySetInnerHTML={{ __html: bold }} />;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Therapy Resources</h2>
      <p className={styles.sub}>Evidence-based tools curated by professionals</p>

      <div className={styles.section}>
        <h3>Exercises & Worksheets</h3>
        <div className={styles.list}>
          {RESOURCES.map((r, i) => (
            <button key={i} className={styles.listItem} onClick={() => setActive(i)}>
              <div className={styles.listIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div className={styles.listText}>
                <p className={styles.listTitle}>{r.name}</p>
                <p className={styles.listSub}>{r.desc}</p>
              </div>
              <span className={styles.listTag}>{r.tag}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="2" className={styles.arrow}><path d="M9 18l6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
