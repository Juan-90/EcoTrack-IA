// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Header
// ─────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useThemeStore } from '../../store/themeStore';
import { RefreshCw, Bell, Sun, Moon, Leaf } from 'lucide-react';

interface HeaderProps { title: string; subtitle?: string; }

export default function Header({ title, subtitle }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [spinning, setSpinning] = useState(false);
  const qc = useQueryClient();
  const { theme, cycleTheme } = useThemeStore();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const refresh = async () => {
    setSpinning(true);
    await qc.invalidateQueries();
    setTimeout(() => setSpinning(false), 800);
  };

  const THEME_CONFIG = {
    dark: { icon: <Sun className="w-4 h-4" style={{ color: 'var(--warning)' }} />, title: 'Modo claro' },
    light: { icon: <Leaf className="w-4 h-4" style={{ color: 'var(--accent)' }} />, title: 'Modo eco' },
    eco: { icon: <Moon className="w-4 h-4" style={{ color: 'var(--info)' }} />, title: 'Modo escuro' },
  };

  return (
    <header
      className="flex items-center justify-between px-6 h-14 border-b flex-shrink-0 transition-colors duration-200"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div>
        <h1 className="text-sm font-bold tracking-wide" style={{ color: 'var(--text)' }}>{title}</h1>
        {subtitle && <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Live */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] font-mono tracking-widest" style={{ color: 'var(--accent)' }}>AO VIVO</span>
        </div>

        {/* Clock */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-mono" style={{ color: 'var(--text)' }}>
            {time.toLocaleTimeString('pt-BR')}
          </p>
          <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
        </div>

        {/* Refresh */}
        <button
          onClick={refresh}
          className="p-1.5 rounded-lg transition-all"
          style={{ background: 'var(--card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          <RefreshCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
        </button>

        {/* Tema claro/escuro/eco */}
        <button
          onClick={cycleTheme}
          className="p-1.5 rounded-lg transition-all"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          title={THEME_CONFIG[theme].title}
        >
          {THEME_CONFIG[theme].icon}
        </button>

        {/* Notificações */}
        <button
          className="relative p-1.5 rounded-lg transition-all"
          style={{ background: 'var(--card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}