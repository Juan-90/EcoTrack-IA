import React, { createContext, ReactNode, useEffect, useState } from "react";
import { api, registerUnauthorizedHandler } from "@/src/services/api";
import {
  getToken,
  removeToken,
  saveToken,
} from "@/src/utils/tokenStorage";

interface AuthContextData {
  userToken: string | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await getToken();

        if (token) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          setUserToken(token);
        }
      } catch (error) {
        console.log("Erro ao restaurar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(async () => {
      await signOut();
    });

    return () => {
      registerUnauthorizedHandler(null);
    };
  }, []);

  async function signIn(email: string, password: string) {
    try {
      setIsSigningIn(true);

      const formData = new URLSearchParams();
      formData.append("username", email.trim());
      formData.append("password", password);

      const response = await api.post("/login", formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const accessToken = response.data?.access_token;

      if (!accessToken) {
        throw new Error("Token de acesso não retornado pela API.");
      }

      await saveToken(accessToken);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      setUserToken(accessToken);
    } catch (error: any) {
      console.log(
        "Erro no login:",
        error?.response?.data || error?.message || error
      );
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  }

  async function signOut() {
    try {
      await removeToken();
    } catch (error) {
      console.log("Erro ao remover token:", error);
    } finally {
      delete api.defaults.headers.common.Authorization;
      setUserToken(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userToken,
        isLoading,
        isSigningIn,
        isAuthenticated: Boolean(userToken),
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
