// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — React Query Hooks
// ─────────────────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import { binsApi, trucksApi, routesApi, statsApi } from '../services/api';

const REALTIME = 15_000;  // 15s — posições e níveis
const NORMAL   = 30_000;  // 30s — listas

export const useBins = () =>
  useQuery({ queryKey: ['bins'], queryFn: binsApi.getAll, refetchInterval: REALTIME });

export const useBin = (id: number) =>
  useQuery({ queryKey: ['bins', id], queryFn: () => binsApi.getById(id), enabled: !!id });

export const useTrucks = () =>
  useQuery({ queryKey: ['trucks'], queryFn: trucksApi.getAll, refetchInterval: REALTIME });

export const useTodayRoutes = () =>
  useQuery({ queryKey: ['routes', 'today'], queryFn: routesApi.getToday, refetchInterval: NORMAL });

export const useRoutes = () =>
  useQuery({ queryKey: ['routes'], queryFn: routesApi.getAll, refetchInterval: NORMAL });

export const useDashboardStats = () =>
  useQuery({ queryKey: ['stats'], queryFn: statsApi.get, refetchInterval: NORMAL });
