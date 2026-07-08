// ============================================================
// Anchor — Zustand Auth Store
// ============================================================

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  setError: (error) =>
    set({ error }),

  login: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),

  register: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      // Ignore errors during cleanup
    }
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        // Token exists — we'll verify it on app start by fetching the user
        set({ isInitialized: true });
        return;
      }
    } catch {
      // SecureStore unavailable (web/non-native)
    }
    set({ isInitialized: true, isAuthenticated: false });
  },
}));