import {
  Building2,
  ChartColumn,
  LayoutDashboard,
  LogOut,
  Menu,
  RadioTower,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clientes', icon: Building2 },
  { to: '/deployments', label: 'Deployments', icon: RadioTower },
  { to: '/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/plans', label: 'Planos', icon: ShieldCheck },
  { to: '/settings', label: 'Configuracoes', icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuthStore()

  return (
    <>
      <div className="border-b px-6 py-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(31, 143, 95, 0.12)' }}
          >
            <Building2 className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
              EcoTrack
            </p>
            <h1 className="text-lg font-bold">Company</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition"
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'rgba(31, 143, 95, 0.10)',
                    borderColor: 'rgba(31, 143, 95, 0.22)',
                    color: 'var(--accent)',
                  }
                : {
                    background: 'transparent',
                    borderColor: 'transparent',
                    color: 'var(--text-muted)',
                  }
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t px-6 py-5" style={{ borderColor: 'var(--border)' }}>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold">{user?.name ?? 'EcoTrack HQ'}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {user?.email ?? 'Controle multi-tenant da plataforma'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              logout()
              onNavigate?.()
            }}
            className="flex w-full items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </div>
    </>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-2xl border p-3 lg:hidden"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside
        className="hidden min-h-screen w-72 shrink-0 border-r lg:flex lg:flex-col"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="w-72 border-r"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-end px-4 py-4">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border p-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex h-[calc(100%-64px)] flex-col">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>

          <button
            type="button"
            className="flex-1 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  )
}
