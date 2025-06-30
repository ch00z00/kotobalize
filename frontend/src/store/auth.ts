import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/generated/models';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: () => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

/**
 * A Zustand store for managing authentication state.
 * It persists the token and user information to localStorage.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoggedIn: () => !!get().token,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
