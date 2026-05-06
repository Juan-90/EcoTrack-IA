import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { Bin, Truck, Route, DashboardStats, LoginResponse, Tenant } from '../types';
import {
  MOCK_BINS, MOCK_TRUCKS, MOCK_ROUTES,
  MOCK_STATS, MOCK_TENANTS,
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const USE_MOCK  = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('ecotrack_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const tenantRaw = localStorage.getItem('ecotrack-tenant');
  if (tenantRaw) {
    try {
      const { state } = JSON.parse(tenantRaw);
      if (state?.tenant?.id && config.headers) {
        config.headers['X-Tenant-ID'] = state.tenant.id;
      }
    } catch {}
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ecotrack_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const tenantApi = {
  validate: async (tenantId: string): Promise<Tenant> => {
    if (USE_MOCK) {
      await delay(600);
      const clean = tenantId.replace(/\D/g, '');
      const found = MOCK_TENANTS.find(
        t => t.id.replace(/\D/g, '') === clean || t.id === tenantId
      );
      if (!found) throw new Error('Tenant não encontrado');
      if (!found.active) throw new Error('Tenant inativo');
      return found;
    }
    const { data } = await api.post<Tenant>('/tenants/validate', { tenant_id: tenantId });
    return data;
  },
};

export const authApi = {
  login: async (tenantId: string, email: string, password: string): Promise<LoginResponse> => {
    const form = new URLSearchParams();
    form.append('tenant', tenantId);
    form.append('username', email);
    form.append('password', password);

    const { data } = await api.post<LoginResponse>('/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  },
};

export const binsApi = {
  getAll: async (): Promise<Bin[]> => {
    if (USE_MOCK) { await delay(); return MOCK_BINS; }
    const { data } = await api.get<Bin[]>('/bins/');
    return data;
  },
  getById: async (id: number): Promise<Bin> => {
    if (USE_MOCK) { await delay(); return MOCK_BINS.find(b => b.id === id)!; }
    const { data } = await api.get<Bin>(`/bins/${id}`);
    return data;
  },
};

export const trucksApi = {
  getAll: async (): Promise<Truck[]> => {
    if (USE_MOCK) { await delay(); return MOCK_TRUCKS; }
    const { data } = await api.get<Truck[]>('/trucks/');
    return data;
  },
};

export const routesApi = {
  getToday: async (): Promise<Route[]> => {
    if (USE_MOCK) { await delay(); return MOCK_ROUTES; }
    const { data } = await api.get<Route[]>('/routes/today');
    return data;
  },
  getAll: async (): Promise<Route[]> => {
    if (USE_MOCK) { await delay(); return MOCK_ROUTES; }
    const { data } = await api.get<Route[]>('/routes/');
    return data;
  },
};

export const statsApi = {
  get: async (): Promise<DashboardStats> => {
    if (USE_MOCK) { await delay(); return MOCK_STATS; }
    const { data } = await api.get<DashboardStats>('/analytics/');
    return data;
  },
};

export default api;
