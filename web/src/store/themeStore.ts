// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Theme Store
//  3 temas: dark | light | eco
// ─────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'eco';

interface ThemeState {
  theme: Theme;
  cycleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const CYCLE: Theme[] = ['dark', 'light', 'eco'];

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      cycleTheme: () => {
        const current = get().theme;
        const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
        set({ theme: next });
      },
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ecotrack-theme' }
  )
);