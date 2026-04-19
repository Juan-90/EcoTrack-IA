import axios, { AxiosError } from "axios";
import { getToken, removeSession } from "@/src/utils/tokenStorage";

const DEFAULT_API_URL = "http://192.168.1.103:5000";

let onUnauthorized: (() => void | Promise<void>) | null = null;

export interface TenantResolveResponse {
  exists: boolean;
  tenant_id?: number;
  tenant_code?: string;
  tenant_name?: string;
  tenant_type?: string;
  status?: "active" | "inactive";
  message?: string;
}

export function registerUnauthorizedHandler(
  handler: (() => void | Promise<void>) | null
) {
  onUnauthorized = handler;
}

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await removeSession();

      if (onUnauthorized) {
        await onUnauthorized();
      }
    }

    return Promise.reject(error);
  }
);

export async function resolveTenant(
  tenant: string
): Promise<TenantResolveResponse> {
  const response = await api.post<TenantResolveResponse>("/tenant/resolve", {
    tenant,
  });

  return response.data;
}
