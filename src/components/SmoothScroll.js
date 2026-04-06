'use client';

// Fallback to native smooth scrolling as NPM registry is inaccessible
export default function SmoothScroll({ children }) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
  return <>{children}</>;
}
