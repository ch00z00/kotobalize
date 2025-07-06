import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/generated/models';
import Cookies from 'js-cookie';

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
      login: (token, user) => {
        // 1. Update Zustand state
        set({ token, user });
        // 2. Set Cookie for server component authentication
        // path: '/' for site-wide validity
        Cookies.set('token', token, { path: '/', expires: 7 }); // 7 days
      },
      logout: () => {
        // 1. Clear Zustand state
        set({ token: null, user: null });
        // 2. Clear Cookie
        Cookies.remove('token', { path: '/' });
      },
    }),
    {
      name: 'auth-storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
