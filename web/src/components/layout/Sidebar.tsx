// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Sidebar
// ─────────────────────────────────────────────────────────
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Trash2, Truck, Map,
  BarChart3, Clock, Bell, LogOut, Leaf
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Users } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Wrench } from 'lucide-react';
import { Settings } from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bins', icon: Trash2, label: 'Lixeiras' },
  { to: '/trucks', icon: Truck, label: 'Caminhões' },
  { to: '/routes', icon: Map, label: 'Rotas' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/shifts', icon: Clock, label: 'Turnos' },
  { to: '/alerts', icon: Bell, label: 'Alertas' },
  { to: '/drivers', icon: Users, label: 'Coletores' },
  { to: '/reports', icon: FileText, label: 'Relatórios' },
  { to: '/fleet', icon: Wrench, label: 'Manutenção' },
  { to: '/zones', icon: Map, label: 'Zonas' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  return (
    <aside
      className="flex flex-col w-56 min-h-screen border-r transition-colors duration-200 flex-shrink-0"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-5 py-5 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: isDark ? 'rgba(74,222,128,0.15)' : 'rgba(22,163,74,0.1)' }}
        >
          <Leaf className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide" style={{ color: 'var(--text)' }}>
            EcoTrack-IA
          </p>
          <p className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--accent)', opacity: 0.7 }}>
            Smart City
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p
          className="px-2 mb-3 text-[9px] font-mono tracking-widest uppercase"
          style={{ color: 'var(--accent)', opacity: 0.5 }}
        >
          Painel de Controle
        </p>

        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={({ isActive }) => isActive
              ? {
                background: isDark ? 'rgba(74,222,128,0.1)' : 'rgba(22,163,74,0.1)',
                color: 'var(--accent)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(74,222,128,0.3)' : 'rgba(22,163,74,0.3)',
              }
              : {
                color: 'var(--text-muted)',
                border: '1px solid transparent',
              }
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-3 py-4 border-t space-y-1"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>

        {user && (
          <div
            className="px-3 pt-3 mt-2 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>
              {user.email}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--accent)', opacity: 0.7 }}>
              Administração Pública
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}