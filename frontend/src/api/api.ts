import axios from "axios";
import { getToken, removeToken } from "../utils/tokenStorage";

export const api = axios.create({
  baseURL: "http://192.168.1.105:8000",
  timeout: 5000,
});


// 🔐 Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {

    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 🚨 Interceptor para logout automático se token expirar
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    if (error.response?.status === 401) {
      console.log("⚠️ Token inválido ou expirado");

      await removeToken();
    }

    return Promise.reject(error);
  }
);