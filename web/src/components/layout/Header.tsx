// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Header
// ─────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { RefreshCw, Bell } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface HeaderProps { title: string; subtitle?: string; }

export default function Header({ title, subtitle }: HeaderProps) {
  const [time, setTime]         = useState(new Date());
  const [spinning, setSpinning] = useState(false);
  const qc                      = useQueryClient();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const refresh = async () => {
    setSpinning(true);
    await qc.invalidateQueries();
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <header
      className="flex items-center justify-between px-6 h-14 border-b flex-shrink-0"
      style={{ background: '#08130D', borderColor: '#2d6a4f' }}
    >
      <div>
        <h1 className="text-sm font-bold text-white tracking-wide">{title}</h1>
        {subtitle && <p className="text-[11px]" style={{ color: '#9ca3af' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Live */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] font-mono text-green-400 tracking-widest">AO VIVO</span>
        </div>

        {/* Clock */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-mono text-white">
            {time.toLocaleTimeString('pt-BR')}
          </p>
          <p className="text-[10px] capitalize" style={{ color: '#9ca3af' }}>
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
        </div>

        <button onClick={refresh} className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-all" style={{ background: 'rgba(45,106,79,0.3)' }}>
          <RefreshCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
        </button>
        <button className="relative p-1.5 rounded-lg text-gray-400 hover:text-white transition-all" style={{ background: 'rgba(45,106,79,0.3)' }}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
