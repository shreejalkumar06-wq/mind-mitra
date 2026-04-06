'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ADJECTIVES = ['Calm', 'Gentle', 'Serene', 'Peaceful', 'Bright', 'Kind', 'Warm', 'Quiet', 'Soft', 'Hopeful', 'Brave', 'Tender', 'Golden', 'Misty', 'Crystal'];
const NOUNS = ['Ocean', 'River', 'Breeze', 'Meadow', 'Cloud', 'Dawn', 'Star', 'Moon', 'Petal', 'Feather', 'Willow', 'Harbor', 'Garden', 'Horizon', 'Sparrow'];
const AVATARS = [
  '/avatars/lotus.svg', '/avatars/leaf.svg', '/avatars/sun.svg',
  '/avatars/moon.svg', '/avatars/star.svg', '/avatars/cloud.svg',
  '/avatars/wave.svg', '/avatars/bird.svg',
];

function generateAlias() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj} ${noun} ${num}`;
}

function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mindmitra-user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('mindmitra-user');
      }
    }
    setLoading(false);
  }, []);

  const loginAnonymous = (customAlias, customAvatar) => {
    const newUser = {
      id: crypto.randomUUID(),
      displayName: customAlias || generateAlias(),
      avatarUrl: customAvatar || getRandomAvatar(),
      isAnonymous: true,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('mindmitra-user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mindmitra-user');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('mindmitra-user', JSON.stringify(updated));
  };

  const shuffleIdentity = () => {
    return {
      displayName: generateAlias(),
      avatarUrl: getRandomAvatar(),
    };
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginAnonymous,
      logout,
      updateUser,
      shuffleIdentity,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
