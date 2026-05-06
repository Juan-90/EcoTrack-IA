import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../services/api';
import { useTenantStore } from './tenantStore';

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
          const tenant = useTenantStore.getState().tenant;

          if (!tenant) {
            set({ error: 'Valide a organização antes de entrar.', isLoading: false });
            throw new Error('Tenant não validado');
          }

          const data = await authApi.login(tenant.id, email, password);
          const token = data.access_token;

          localStorage.setItem('ecotrack_token', token);

          set({
            user: { id: 0, email, token },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({ error: 'Email, senha ou tenant incorretos.', isLoading: false });
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
