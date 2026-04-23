import { Building2, ChartColumn, LayoutDashboard, RadioTower, Settings, ShieldCheck } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clientes', icon: Building2 },
  { to: '/deployments', label: 'Deployments', icon: RadioTower },
  { to: '/analytics', label: 'Analytics', icon: ChartColumn },
  { to: '/plans', label: 'Planos', icon: ShieldCheck },
  { to: '/settings', label: 'Configurações', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside
      className="hidden min-h-screen w-72 shrink-0 border-r lg:flex lg:flex-col"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
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
        <p className="text-sm font-semibold">EcoTrack HQ</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Controle multi-tenant da plataforma
        </p>
      </div>
    </aside>
  )
}
