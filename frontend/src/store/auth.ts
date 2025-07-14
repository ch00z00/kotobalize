import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/generated/api';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: () => boolean;
  login: (token: string, user: User, rememberMe: boolean) => void;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => void;
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
      login: (token, user, rememberMe) => {
        // 1. Update Zustand state
        set({ token, user });
        // 2. Set Cookie for server component authentication
        // path: '/' for site-wide validity
        const cookieOptions: { path: string; expires?: number } = { path: '/' };
        if (rememberMe) {
          cookieOptions.expires = 30; // 30 days
        }
        Cookies.set('token', token, cookieOptions);
      },
      logout: () => {
        // 1. Clear Zustand state
        set({ token: null, user: null });
        // 2. Clear Cookie
        Cookies.remove('token', { path: '/' });
      },
      updateAvatar: (avatarUrl: string) => {
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl } : null,
        }));
      },
    }),
    {
      name: 'auth-storage', // localStorage key name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
