// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Auth Store
//  User model alinhado com backend real:
//  { id: number, email: string, token: string }
// ─────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(email, password);
          const token = data.access_token;
          localStorage.setItem('ecotrack_token', token);
          // Backend retorna só o token — email vem do formulário
          set({
            user: { id: 0, email, token },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({ error: 'Email ou senha incorretos.', isLoading: false });
          throw new Error('Credenciais inválidas');
        }
      },

      logout: () => {
        localStorage.removeItem('ecotrack_token');
        set({ user: null, isAuthenticated: false });
        window.location.href = '/login';
      },
    }),
    {
      name: 'ecotrack-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);
