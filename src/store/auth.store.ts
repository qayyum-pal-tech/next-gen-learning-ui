import { create } from 'zustand';

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  init: () => void;
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isInitialized: false,

  init: () => {
    const token = localStorage.getItem('token');

    set({
      token,
      isAuthenticated: !!token,
      isInitialized: true,
    });
  },

  login: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
}));
