import { create } from 'zustand';

type AuthState = {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  init: () => void;
  login: (token: string) => void;
  setUser: (user: any) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
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

  setUser: (user) => {
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
