import axios, { AxiosError } from "axios";
import { getToken, removeToken } from "@/src/utils/tokenStorage";

const DEFAULT_API_URL = "http://192.168.1.103:5000";

let onUnauthorized: (() => void | Promise<void>) | null = null;

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
    const status = error.response?.status;

    if (status === 401) {
      await removeToken();

      if (onUnauthorized) {
        await onUnauthorized();
      }
    }

    return Promise.reject(error);
  }
);
