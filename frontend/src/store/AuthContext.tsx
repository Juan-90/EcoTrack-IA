import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "../api/api";
import { getToken, saveToken, removeToken } from "../utils/tokenStorage";

interface AuthContextData {
  userToken: string | null;
  isLoading: boolean;
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

  // 🔄 Carrega token salvo ao iniciar o app
  useEffect(() => {
    async function loadStoredToken() {
      try {
        const token = await getToken();

        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUserToken(token);
        }
      } catch (error) {
        console.log("Erro ao carregar token:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredToken();
  }, []);

  // 🔐 LOGIN (OAuth2PasswordRequestForm)
  async function signIn(email: string, password: string) {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post("/login", formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;

      // Salva no storage
      await saveToken(access_token);

      // Define header padrão
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;

      setUserToken(access_token);
    } catch (error: any) {
      console.log("Erro no login:", error?.response?.data || error.message);
      throw error;
    }
  }

  // 🚪 LOGOUT
  async function signOut() {
    try {
      await removeToken();
      setUserToken(null);
      delete api.defaults.headers.common["Authorization"];
    } catch (error) {
      console.log("Erro no logout:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userToken,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}