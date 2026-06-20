import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '../types';

interface AuthState {
  role: UserRole | null;
  userId: string;
  isDarkMode: boolean;
  setRole: (role: UserRole) => void;
  setUserId: (userId: string) => void;
  toggleDarkMode: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      userId: '',
      isDarkMode: false,
      setRole: (role) => set({ role }),
      setUserId: (userId) => set({ userId }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      logout: () => set({ role: null, userId: '' }),
    }),
    {
      name: 'medichain-auth',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

// Apply dark mode class on mount
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('medichain-auth');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed?.state?.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }
}
