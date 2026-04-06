'use client';

import { useState } from 'react';
import styles from './page.module.css';

const CIRCLES = [
  { id: 'anxiety', name: 'Anxiety Warriors', desc: 'Supporting each other through anxious moments', members: 142, icon: '🛡️' },
  { id: 'mindful', name: 'Mindful Living', desc: 'Sharing tips for staying present', members: 98, icon: '🧘' },
  { id: 'recovery', name: 'Recovery Road', desc: 'Celebrating progress, big and small', members: 67, icon: '🌱' },
  { id: 'welcome', name: 'New Here', desc: 'Welcome! Start your journey with others', members: 234, icon: '👋' },
  { id: 'gratitude', name: 'Gratitude Circle', desc: 'Daily sharing of things we appreciate', members: 89, icon: '💛' },
  { id: 'sleep', name: 'Better Sleep', desc: 'Tips, routines, and support for restful nights', members: 56, icon: '🌙' },
];

const SAMPLE_POSTS = {
  anxiety: [
    { user: 'Calm River', text: 'Tried box breathing during a meeting today and it actually helped! 4-4-4-4. Give it a try.', likes: 12, time: '2h ago' },
    { user: 'Bright Star', text: 'Reminder: anxiety lies to you. You ARE capable. You HAVE done hard things before. 💙', likes: 24, time: '5h ago' },
  ],
  mindful: [
    { user: 'Gentle Breeze', text: 'Today I noticed the sunlight on my hands while making coffee. Such a small thing, but it grounded me.', likes: 18, time: '1h ago' },
  ],
  recovery: [
    { user: 'Warm Light', text: '30 days free from self-destructive habits. Never thought I\'d get here. One day at a time. 🌟', likes: 45, time: '3h ago' },
  ],
  welcome: [
    { user: 'Kind Soul', text: 'Just joined! Feeling nervous but hopeful. Happy to be here with all of you.', likes: 31, time: '30m ago' },
    { user: 'Soft Dawn', text: 'Welcome everyone! This is the most supportive corner of the internet. You\'re safe here. ❤️', likes: 52, time: '1h ago' },
  ],
  gratitude: [
    { user: 'Peaceful Cloud', text: 'Grateful for this community. Knowing I\'m not alone makes all the difference.', likes: 19, time: '4h ago' },
  ],
  sleep: [
    { user: 'Quiet Moon', text: 'Switching to warm lights after 8pm changed everything for me. Melatonin naturally kicks in now.', likes: 15, time: '6h ago' },
  ],
};

export default function CommunityPage() {
  const [activeCircle, setActiveCircle] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const toggleLike = (circleId, idx) => {
    const key = `${circleId}-${idx}`;
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (activeCircle) {
    const circle = CIRCLES.find(c => c.id === activeCircle);
    const posts = SAMPLE_POSTS[activeCircle] || [];

    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => setActiveCircle(null)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Circles
        </button>

        <div className={styles.circleHeader}>
          <span className={styles.circleIconLg}>{circle.icon}</span>
          <div>
            <h2 className={styles.title}>{circle.name}</h2>
            <p className={styles.sub}>{circle.desc} · {circle.members} members</p>
          </div>
        </div>

        <div className={styles.posts}>
          {posts.map((p, i) => {
            const isLiked = likedPosts.has(`${activeCircle}-${i}`);
            return (
              <div key={i} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <span className={styles.postUser}>{p.user}</span>
                  <span className={styles.postTime}>{p.time}</span>
                </div>
                <p className={styles.postText}>{p.text}</p>
                <div className={styles.postActions}>
                  <button className={`${styles.likeBtn} ${isLiked ? styles.liked : ''}`} onClick={() => toggleLike(activeCircle, i)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {p.likes + (isLiked ? 1 : 0)}
                  </button>
                  <button className={styles.replyBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Community</h2>
      <p className={styles.sub}>Find people who understand</p>

      <div className={styles.section}>
        <h3>Peer Circles</h3>
        <div className={styles.grid}>
          {CIRCLES.map(c => (
            <button key={c.id} className={styles.gridCard} onClick={() => setActiveCircle(c.id)}>
              <span className={styles.gridIcon}>{c.icon}</span>
              <h4>{c.name}</h4>
              <p>{c.desc}</p>
              <div className={styles.gridFooter}>
                <span className={styles.tag}>{c.members} members</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
