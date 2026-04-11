'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

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
  return `${adj} ${noun}`;
}

function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

function persistUser(user) {
  localStorage.setItem('mindmitra-user', JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      const saved = localStorage.getItem('mindmitra-user');

      if (!saved) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);

        if (parsed?.id) {
          const { user: freshUser } = await apiRequest(`/users/${parsed.id}/summary`);
          const normalized = {
            id: freshUser.id,
            displayName: freshUser.displayName,
            avatarUrl: freshUser.avatarUrl,
            createdAt: freshUser.createdAt,
            streakCount: freshUser.streakCount,
            wellnessScore: freshUser.wellnessScore,
            isAnonymous: true,
          };
          setUser(normalized);
          persistUser(normalized);
        }
      } catch {
        localStorage.removeItem('mindmitra-user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const loginAnonymous = useCallback(async (customAlias, customAvatar) => {
    const response = await apiRequest('/users/anonymous', {
      method: 'POST',
      body: JSON.stringify({
        displayName: customAlias || generateAlias(),
        avatarUrl: customAvatar || getRandomAvatar(),
      }),
    });

    const newUser = {
      ...response.user,
      isAnonymous: true,
    };

    setUser(newUser);
    persistUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('mindmitra-user');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((currentUser) => {
      const updated = { ...currentUser, ...updates };
      persistUser(updated);
      return updated;
    });
  }, []);

  const shuffleIdentity = useCallback(() => {
    return {
      displayName: generateAlias(),
      avatarUrl: getRandomAvatar(),
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      loginAnonymous,
      logout,
      updateUser,
      shuffleIdentity,
      isAuthenticated: !!user,
    }}
    >
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
