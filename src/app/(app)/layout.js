'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CrisisBanner from '@/components/CrisisBanner';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingLogo}>
          <svg width="48" height="48" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" fill="var(--accent)" opacity="0.15"/>
            <path d="M40 18C36 22 28 30 28 40C28 46 32 52 40 56C48 52 52 46 52 40C52 30 44 22 40 18Z" fill="var(--accent)"/>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <div className={styles.mainArea}>
        <CrisisBanner />
        <Header />
        <main className={styles.content}>
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
