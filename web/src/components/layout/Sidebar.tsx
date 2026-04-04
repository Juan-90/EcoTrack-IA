// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Sidebar
//  Paleta oficial: bg #08130D, cards #1b4332
// ─────────────────────────────────────────────────────────
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trash2, Truck, Map, BarChart3, LogOut, Leaf } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx';

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/bins',      icon: Trash2,          label: 'Lixeiras'   },
  { to: '/trucks',    icon: Truck,           label: 'Caminhões'  },
  { to: '/routes',    icon: Map,             label: 'Rotas'      },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics'  },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside
      className="flex flex-col w-56 min-h-screen border-r"
      style={{ background: '#08130D', borderColor: '#2d6a4f' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b" style={{ borderColor: '#2d6a4f' }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'rgba(74,222,128,0.15)' }}>
          <Leaf className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-wide">EcoTrack-IA</p>
          <p className="text-[10px] tracking-widest uppercase" style={{ color: '#4ade80', opacity: 0.7 }}>
            Smart City
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 mb-3 text-[9px] font-mono tracking-widest uppercase" style={{ color: '#4ade80', opacity: 0.5 }}>
          Painel de Controle
        </p>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'text-green-400 border'
                  : 'text-gray-400 hover:text-white'
              )
            }
            style={({ isActive }) => isActive
              ? { background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.3)' }
              : { borderColor: 'transparent' }
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: '#2d6a4f' }}>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: '#9ca3af' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
        {user && (
          <div className="px-3 pt-3 mt-2 border-t" style={{ borderColor: '#2d6a4f' }}>
            <p className="text-xs font-semibold text-white">{user.email}</p>
            <p className="text-[10px] text-green-400 opacity-70">Administração Pública</p>
          </div>
        )}
      </div>
    </aside>
  );
}
