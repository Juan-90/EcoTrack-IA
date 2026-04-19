import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "@ecotrack:session";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface SessionTenant {
  id: number;
  name: string;
  type: string;
  document: string;
}

export interface AuthSession {
  accessToken: string;
  user: SessionUser;
  tenant: SessionTenant;
}

export async function saveSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as AuthSession;
}

export async function removeSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}
