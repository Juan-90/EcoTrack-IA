// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Página Lixeiras
//  Prioridade: 🔴 Alta >80% | 🟡 Média 50-79% | 🟢 Baixa <50%
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import { Search } from 'lucide-react';
import { FillBar, StatusBadge, Card, LoadingSpinner } from '../../components/ui';
import { PRIORITY_EMOJI, PRIORITY_LABEL, PRIORITY_COLOR, BIN_STATUS_COLOR, BIN_STATUS_LABEL, formatDate, predictFillTime } from '../../utils/helpers';
import { useBins } from '../../hooks/useEcoTrack';
import type { Priority } from '../../types';

const FILTERS: { label: string; value: Priority | 'all' }[] = [
  { label: 'Todas',          value: 'all'   },
  { label: '🔴 Alta (>80%)',  value: 'alta'  },
  { label: '🟡 Média (50-79%)',value: 'media' },
  { label: '🟢 Baixa (<50%)', value: 'baixa' },
];

export default function Bins() {
  const { data: bins, isLoading } = useBins();
  const [search, setSearch]       = useState('');
  const [priority, setPriority]   = useState<Priority | 'all'>('all');

  if (isLoading) return <LoadingSpinner message="Carregando lixeiras..." />;

  const filtered = (bins ?? [])
    .filter(b => priority === 'all' || b.priority === priority)
    .filter(b => !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.level - a.level);

  return (
    <div className="space-y-5">

      {/* Filtros */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Buscar por nome ou localização..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none border"
              style={{ background: '#1b4332', borderColor: '#2d6a4f' }}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setPriority(f.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all border"
                style={priority === f.value
                  ? { background: 'rgba(74,222,128,0.15)', color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }
                  : { background: '#1b4332', color: '#9ca3af', borderColor: '#2d6a4f' }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono ml-auto" style={{ color: '#9ca3af' }}>{filtered.length} lixeiras</span>
        </div>
      </Card>

      {/* Tabela */}
      <Card noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#2d6a4f' }}>
                {['Prioridade', 'Nome / Local', 'Nível', 'Status', 'Previsão de Enchimento', 'Última Coleta'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest" style={{ color: '#9ca3af' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(bin => (
                <tr key={bin.id} className="border-b transition-colors" style={{ borderColor: 'rgba(45,106,79,0.3)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(27,67,50,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-3">
                    <span className="text-lg">{PRIORITY_EMOJI[bin.priority]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-white">{bin.name}</p>
                    <p className="text-[10px]" style={{ color: '#9ca3af' }}>{bin.location}</p>
                    {bin.zone && <p className="text-[10px]" style={{ color: '#4ade80', opacity: 0.7 }}>{bin.zone}</p>}
                  </td>
                  <td className="px-4 py-3 w-36">
                    <FillBar level={bin.level} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={BIN_STATUS_LABEL[bin.status]} className={BIN_STATUS_COLOR[bin.status]} />
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: bin.level > 80 ? '#facc15' : '#9ca3af' }}>
                    {bin.level > 50 ? `~${predictFillTime(bin.level)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: '#9ca3af' }}>
                    {formatDate(bin.last_collected)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-xs font-mono" style={{ color: '#9ca3af' }}>Nenhuma lixeira encontrada</p>
          )}
        </div>
      </Card>
    </div>
  );
}
