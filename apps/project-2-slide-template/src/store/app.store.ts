import { create } from 'zustand';

interface AppState {
  isOnline: () => boolean;
}

export const useAppStore = create<AppState>(() => ({
  isOnline: () => typeof window === 'undefined' || window.navigator.onLine,
}));

