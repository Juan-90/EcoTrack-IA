import { create } from 'zustand'

type CompanyRole = 'founder_admin' | 'operations_manager' | 'support_analyst'

export type AuthUser = {
  name: string
  email: string
  role: CompanyRole
}

type AuthState = {
  user: AuthUser | null
  isAuthenticated: boolean
  hydrate: () => void
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>
  logout: () => void
}

const STORAGE_KEY = 'ecotrack-company-auth'

const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  'juan@ecotrack.com': {
    name: 'Juan Andrade',
    email: 'juan@ecotrack.com',
    role: 'founder_admin',
    password: '123456',
  },
  'operacoes@ecotrack.com': {
    name: 'Mauricio Ferreira',
    email: 'operacoes@ecotrack.com',
    role: 'operations_manager',
    password: '123456',
  },
  'suporte@ecotrack.com': {
    name: 'Nelson Sousa',
    email: 'suporte@ecotrack.com',
    role: 'support_analyst',
    password: '123456',
  },
}

function persistUser(user: AuthUser | null) {
  if (typeof window === 'undefined') return

  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  hydrate: () => {
    if (typeof window === 'undefined') return

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const user = JSON.parse(raw) as AuthUser
      set({ user, isAuthenticated: true })
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  },

  login: async (email, password) => {
    const normalized = email.trim().toLowerCase()
    const candidate = MOCK_USERS[normalized]

    await new Promise((resolve) => setTimeout(resolve, 300))

    if (!candidate || candidate.password !== password) {
      return { ok: false, message: 'Credenciais invalidas. Use uma conta mock da EcoTrack.' }
    }

    const user: AuthUser = {
      name: candidate.name,
      email: candidate.email,
      role: candidate.role,
    }

    persistUser(user)
    set({ user, isAuthenticated: true })
    return { ok: true }
  },

  logout: () => {
    persistUser(null)
    set({ user: null, isAuthenticated: false })
  },
}))
