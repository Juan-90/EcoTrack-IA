import React, { createContext, ReactNode, useEffect, useState } from "react";
import {
  api,
  registerUnauthorizedHandler,
  resolveTenant,
  TenantResolveResponse,
} from "@/src/services/api";
import {
  AuthSession,
  getSession,
  removeSession,
  saveSession,
} from "@/src/utils/tokenStorage";

interface SignInPayload {
  tenant: string;
  email: string;
  password: string;
}

interface AuthContextData {
  session: AuthSession | null;
  userToken: string | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isAuthenticated: boolean;
  validateTenant: (tenant: string) => Promise<TenantResolveResponse>;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedSession = await getSession();

        if (storedSession?.accessToken) {
          api.defaults.headers.common.Authorization = `Bearer ${storedSession.accessToken}`;
          setSession(storedSession);
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

  async function validateTenant(tenant: string) {
    const normalized = tenant.trim().replace(/\D/g, "").length === 14
      ? tenant.trim().replace(/\D/g, "")
      : tenant.trim();

    if (normalized === "001") {
      return {
        exists: true,
        tenant_id: 1,
        tenant_code: "001",
        tenant_name: "EcoTrack Demo",
        tenant_type: "empresa",
        status: "active" as const,
      };
    }

    if (normalized === "46395000000139") {
      return {
        exists: true,
        tenant_id: 2,
        tenant_code: "46395000000139",
        tenant_name: "Prefeitura de São Paulo",
        tenant_type: "prefeitura",
        status: "active" as const,
      };
    }

    return resolveTenant(normalized);
  }



  async function signIn({ tenant, email, password }: SignInPayload) {
    try {
      setIsSigningIn(true);

      const formData = new URLSearchParams();
      formData.append("tenant", tenant.trim());
      formData.append("username", email.trim());
      formData.append("password", password);

      const response = await api.post("/login", formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const accessToken = response.data?.access_token;
      const user = response.data?.user;
      const tenantData = response.data?.tenant;

      console.log("LOGIN_RESPONSE", response.data);

      if (!accessToken) {
        throw new Error("Token de acesso não retornado.");
      }

      if (!user) {
        throw new Error("Usuário não retornado pelo backend.");
      }

      if (!tenantData) {
        throw new Error("Tenant não retornado pelo backend.");
      }


      const nextSession: AuthSession = {
        accessToken,
        user,
        tenant: tenantData,
      };

      await saveSession(nextSession);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      setSession(nextSession);
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
      await removeSession();
    } catch (error) {
      console.log("Erro ao remover sessão:", error);
    } finally {
      delete api.defaults.headers.common.Authorization;
      setSession(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        userToken: session?.accessToken ?? null,
        isLoading,
        isSigningIn,
        isAuthenticated: Boolean(session?.accessToken),
        validateTenant,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
