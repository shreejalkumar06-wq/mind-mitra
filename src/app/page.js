'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
      </svg>
    ),
    title: 'Mood Tracking',
    desc: 'Track emotions daily. Discover patterns and insights into your mental wellness.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Meditation',
    desc: 'Guided sessions, breathing exercises, and ambient soundscapes.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Anonymous Chat',
    desc: 'Talk openly in safe, moderated rooms — completely anonymously.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Community',
    desc: 'Connect with people who understand. Zero judgement.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: 'Therapy Tools',
    desc: 'Evidence-based CBT and DBT exercises curated by professionals.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: 'Healing Pathways',
    desc: 'Structured multi-week programs to guide your growth.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const updateParallax = () => {
      if (heroRef.current) {
        heroRef.current.style.setProperty('--scroll-y', `${window.scrollY}px`);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial call
    updateParallax();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* Crisis Strip */}
      <div className={styles.crisisStrip}>
        <span>Need immediate support?</span>
        <a href="tel:988" className={styles.crisisLink}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          988 Lifeline
        </a>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 80 80" fill="none">
              <path d="M40 14C34 20 24 30 24 42C24 50 30 58 40 62C50 58 56 50 56 42C56 30 46 20 40 14Z" fill="var(--accent)"/>
              <path d="M40 26C37 31 33 36 33 42C33 47 36 51 40 53C44 51 47 47 47 42C47 36 43 31 40 26Z" fill="var(--accent)" opacity="0.4"/>
            </svg>
            <span>MindMitra</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#stories" className={styles.navLink}>Stories</a>
          </div>
          <div className={styles.navActions}>
            <button className="btn btn-ghost btn-sm" onClick={() => router.push('/auth')}>Log in</button>
            <button className="btn btn-primary btn-sm" onClick={() => router.push('/anonymous')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          {/* Left — Copy */}
          <div className={styles.heroCopy}>
            <div className={styles.heroBadge}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Private & Anonymous
            </div>
            <h1>
              Your safe space to heal, grow,
              <span className={styles.heroAccent}> and thrive.</span>
            </h1>
            <p className={styles.heroSub}>
              Track your mood, meditate, journal, and connect with
              supportive people — all without sharing your identity.
            </p>
            <div className={styles.heroCtas}>
              {isAuthenticated ? (
                <button className="btn btn-primary btn-lg" onClick={() => router.push('/anonymous')} id="hero-enter">
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
              ) : (
                <>
                  <button className="btn btn-primary btn-lg" onClick={() => router.push('/anonymous')} id="hero-enter">
                    Enter Anonymously
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={() => router.push('/auth')} id="hero-account">Create Account</button>
                </>
              )}
            </div>
            {!isAuthenticated && <p className={styles.heroNote}>No email required. No data collected.</p>}
          </div>

          {/* Right — Floating Cards (Finpay-inspired composition) */}
          <div className={styles.heroVisual} ref={heroRef}>
            <div className={styles.heroPattern} />
            {/* Main Card */}
            <div className={styles.parallaxWrapper} style={{ '--speed': -0.15 }}>
              <div className={styles.cardMain}>
                <div className={styles.cardMainHeader}>
                  <div className={styles.cardMainAvatar}>
                    <img src="/avatars/lotus.svg" alt="User avatar" width={32} height={32} />
                  </div>
                  <div>
                    <p className={styles.cardMainName}>Serene Cloud</p>
                    <p className={styles.cardMainSub}>anonymous user</p>
                  </div>
                </div>
                <div className={styles.cardMainBody}>
                  <p className={styles.cardMainLabel}>Wellness Score</p>
                  <p className={styles.cardMainValue}>86<span>/100</span></p>
                  <p className={styles.cardMainDate}>April 6, 2026</p>
                </div>
              </div>
            </div>

            {/* Floating Card — Mood */}
            <div className={styles.parallaxWrapper} style={{ '--speed': -0.3 }}>
              <div className={styles.cardFloat1}>
                <div className={styles.moodPill}>
                  <span>😊</span>
                  <span className={styles.moodPillText}>Good</span>
                </div>
                <div className={styles.moodPill}>
                  <span>🧘</span>
                  <span className={styles.moodPillText}>Calm</span>
                </div>
                <div className={styles.moodPill}>
                  <span>💪</span>
                  <span className={styles.moodPillText}>Strong</span>
                </div>
              </div>
            </div>

            {/* Floating Card — Streak */}
            <div className={styles.parallaxWrapper} style={{ '--speed': -0.5 }}>
              <div className={styles.cardFloat2}>
                <div className={styles.streakIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9 12l2 2 4-4"/></svg>
                </div>
                <div>
                  <p className={styles.streakNum}>14 days</p>
                  <p className={styles.streakLabel}>streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className={styles.proof}>
        <div className={styles.proofInner}>
          <p className={styles.proofLabel}>Trusted by thousands finding their path to wellness</p>
          <div className={styles.proofStats}>
            <div className={styles.proofStat}><strong>24k+</strong><span>Anonymous Users</span></div>
            <div className={styles.proofDot} />
            <div className={styles.proofStat}><strong>180k+</strong><span>Moods Logged</span></div>
            <div className={styles.proofDot} />
            <div className={styles.proofStat}><strong>4.9★</strong><span>Community Rating</span></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <div className={styles.featuresInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionTag}>Features</p>
            <h2>Everything you need<br/>for your wellness journey</h2>
            <p>Designed with empathy. Built with privacy.</p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.stories} id="stories">
        <div className={styles.storiesInner}>
          <div className={styles.sectionHead}>
            <p className={styles.sectionTag}>Stories</p>
            <h2>Shared anonymously,<br/>felt universally</h2>
          </div>
          <div className={styles.storyGrid}>
            {[
              { text: 'This app helped me understand my anxiety patterns. For the first time, I feel like I have control.', alias: 'Peaceful Cloud' },
              { text: "The anonymous chat rooms are everything. I can talk to people who understand — without being judged.", alias: 'Gentle Breeze' },
              { text: "The 21-day gratitude challenge genuinely changed how I start my mornings. I feel lighter.", alias: 'Bright Star' },
            ].map((s, i) => (
              <div key={i} className={styles.storyCard}>
                <p className={styles.storyText}>&ldquo;{s.text}&rdquo;</p>
                <div className={styles.storyAuthor}>
                  <div className={styles.storyDot} />
                  <span>{s.alias}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2>Begin your journey today</h2>
          <p>No sign-up required. Enter anonymously and start healing.</p>
          <button className="btn btn-primary btn-lg" onClick={() => router.push('/anonymous')} style={{marginTop:'20px'}}>
            Start Now — Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.logo} style={{fontSize:'1rem'}}>
              <svg width="20" height="20" viewBox="0 0 80 80" fill="none"><path d="M40 14C34 20 24 30 24 42C24 50 30 58 40 62C50 58 56 50 56 42C56 30 46 20 40 14Z" fill="var(--accent)"/></svg>
              <span>MindMitra</span>
            </div>
            <p>Your safe space to heal, grow, and thrive.</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">About</a>
            <a href="tel:988">Crisis: 988</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 MindMitra. Built with empathy.</p>
        </div>
      </footer>
    </div>
  );
}
