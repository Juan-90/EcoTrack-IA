// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Tenant Store
//  Persiste o tenant ativo em localStorage
//  Injetado como X-Tenant-ID em todas as requisições
// ─────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tenant } from '../types';

interface TenantState {
  tenant:      Tenant | null;
  isValidating:boolean;
  error:       string | null;
  setTenant:   (tenant: Tenant) => void;
  clearTenant: () => void;
  setError:    (error: string | null) => void;
  setValidating:(v: boolean) => void;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      tenant:       null,
      isValidating: false,
      error:        null,
      setTenant:    (tenant) => set({ tenant, error: null }),
      clearTenant:  () => set({ tenant: null }),
      setError:     (error) => set({ error }),
      setValidating:(isValidating) => set({ isValidating }),
    }),
    {
      name: 'ecotrack-tenant',
      partialize: (s) => ({ tenant: s.tenant }),
    }
  )
);