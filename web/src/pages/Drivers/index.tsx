// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Drivers Page (Coletores e Motoristas)
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  UserPlus, Phone, MapPin, Award, TrendingUp,
  Truck, Calendar, X, Search, ChevronRight
} from 'lucide-react';
import { Card, StatusBadge, FillBar } from '../../components/ui';
import { MOCK_DRIVERS, MOCK_DRIVER_METRICS } from '../../services/mockData';
import type { Driver, DriverStatus, CNHCategory } from '../../types';

// ── Config visual ─────────────────────────────────────────
const STATUS_STYLE: Record<DriverStatus, { label: string; className: string }> = {
  ativo:    { label: 'Disponível', className: 'text-green-400 bg-green-400/10'  },
  em_rota:  { label: 'Em Rota',    className: 'text-blue-400 bg-blue-400/10'    },
  folga:    { label: 'Folga',      className: 'text-yellow-400 bg-yellow-400/10'},
  afastado: { label: 'Afastado',   className: 'text-red-400 bg-red-400/10'      },
};

const AVATAR_COLORS = [
  '#4ade80', '#60a5fa', '#f87171', '#facc15',
  '#a78bfa', '#fb923c', '#34d399', '#f472b6',
];

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function isCNHExpiring(expiry: string) {
  const days = Math.floor((new Date(expiry).getTime() - Date.now()) / 86400000);
  return days < 90;
}

// ── Modal de cadastro ─────────────────────────────────────
function DriverModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: '', cnh: '', cnh_category: 'D' as CNHCategory,
    cnh_expiry: '', phone: '', address: '', zone: '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-lg rounded-2xl border p-6 space-y-4"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Novo Coletor</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Nome completo', key: 'name',      col: 2, placeholder: 'Ex: João da Silva' },
            { label: 'Nº da CNH',    key: 'cnh',       col: 1, placeholder: '00000000000'       },
            { label: 'Validade CNH', key: 'cnh_expiry',col: 1, placeholder: '', type: 'date'    },
            { label: 'Telefone',     key: 'phone',     col: 1, placeholder: '(11) 99999-9999'   },
            { label: 'Zona',         key: 'zone',      col: 1, placeholder: 'Centro, Norte...'  },
            { label: 'Endereço',     key: 'address',   col: 2, placeholder: 'Rua, número, bairro' },
          ].map(f => (
            <div key={f.key} style={{ gridColumn: `span ${f.col}` }}>
              <label className="block text-[10px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                {f.label.toUpperCase()}
              </label>
              <input
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
          ))}

          {/* Categoria CNH */}
          <div>
            <label className="block text-[10px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
              CATEGORIA CNH
            </label>
            <div className="flex gap-1 flex-wrap">
              {(['B', 'C', 'D', 'E'] as CNHCategory[]).map(cat => (
                <button key={cat}
                  onClick={() => setForm(p => ({ ...p, cnh_category: cat }))}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                  style={form.cnh_category === cat
                    ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                    : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Painel de performance ─────────────────────────────────
function DriverPanel({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  const metrics = MOCK_DRIVER_METRICS.find(m => m.driver_id === driver.id);
  const color   = AVATAR_COLORS[driver.id % AVATAR_COLORS.length];
  const s       = STATUS_STYLE[driver.status];
  const cnhExpiring = isCNHExpiring(driver.cnh_expiry);

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-96 border-l shadow-2xl overflow-y-auto"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

      {/* Header do painel */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>PERFIL DO COLETOR</span>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: color + '20', color, border: `2px solid ${color}40` }}>
            {getInitials(driver.name)}
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>{driver.name}</h2>
            <StatusBadge label={s.label} className={s.className} />
          </div>
        </div>
      </div>

      {/* Dados pessoais */}
      <div className="p-5 space-y-4">
        <div className="space-y-3">
          {[
            { icon: Phone,    label: 'Telefone',  value: driver.phone                     },
            { icon: MapPin,   label: 'Endereço',  value: driver.address                   },
            { icon: MapPin,   label: 'Zona',      value: driver.zone                      },
            { icon: Calendar, label: 'Admissão',  value: formatDate(driver.hired_at)      },
            { icon: Truck,    label: 'Caminhão',  value: driver.truck_id ? `#${driver.truck_id}` : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              <div>
                <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{label.toUpperCase()}</p>
                <p className="text-xs" style={{ color: 'var(--text)' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CNH */}
        <div className="p-3 rounded-xl border" style={{
          background: cnhExpiring ? 'rgba(250,204,21,0.05)' : 'var(--card)',
          borderColor: cnhExpiring ? 'rgba(250,204,21,0.3)' : 'var(--border)'
        }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5" style={{ color: cnhExpiring ? 'var(--warning)' : 'var(--accent)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                CNH Categoria {driver.cnh_category}
              </span>
            </div>
            {cnhExpiring && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: 'rgba(250,204,21,0.15)', color: 'var(--warning)' }}>
                Vencendo em breve
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Nº {driver.cnh} · Validade: {formatDate(driver.cnh_expiry)}
          </p>
        </div>

        {/* Métricas de performance */}
        {metrics && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-widest pt-2"
              style={{ color: 'var(--text)' }}>
              Performance
            </h3>

            {/* KPIs do dia */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Coletas hoje',   value: metrics.collections_today, unit: ''    },
                { label: 'Km hoje',        value: metrics.km_today,          unit: ' km' },
                { label: 'Coletas/mês',    value: metrics.collections_month, unit: ''    },
                { label: 'Km/mês',         value: metrics.km_month,          unit: ' km' },
                { label: 'Tempo médio',    value: metrics.avg_collection_min,unit: ' min'},
              ].map(k => (
                <div key={k.label} className="p-3 rounded-xl border"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <p className="text-[9px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                    {k.label.toUpperCase()}
                  </p>
                  <p className="text-lg font-bold font-mono" style={{ color: 'var(--text)' }}>
                    {k.value}<span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{k.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Barras de eficiência */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text)' }}>Eficiência geral</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
                    {metrics.efficiency_pct}%
                  </span>
                </div>
                <FillBar level={metrics.efficiency_pct} showLabel={false} />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: 'var(--text)' }}>Rotas no prazo</span>
                  <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
                    {metrics.on_time_pct}%
                  </span>
                </div>
                <FillBar level={metrics.on_time_pct} showLabel={false} />
              </div>
            </div>

            {/* Badge de desempenho */}
            <div className="p-3 rounded-xl text-center border" style={{
              background: metrics.efficiency_pct >= 90
                ? 'rgba(74,222,128,0.05)' : 'rgba(250,204,21,0.05)',
              borderColor: metrics.efficiency_pct >= 90
                ? 'rgba(74,222,128,0.2)' : 'rgba(250,204,21,0.2)',
            }}>
              <TrendingUp className="w-5 h-5 mx-auto mb-1" style={{
                color: metrics.efficiency_pct >= 90 ? 'var(--accent)' : 'var(--warning)'
              }} />
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                {metrics.efficiency_pct >= 95 ? '⭐ Motorista Destaque'
                  : metrics.efficiency_pct >= 85 ? '✅ Bom Desempenho'
                  : '⚠️ Necessita Atenção'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────
export default function Drivers() {
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState<DriverStatus | 'all'>('all');
  const [selected, setSelected] = useState<Driver | null>(null);
  const [showModal,setModal]    = useState(false);

  const filtered = MOCK_DRIVERS
    .filter(d => status === 'all' || d.status === status)
    .filter(d => !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.zone.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-5">
      {/* Resumo por status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['em_rota', 'ativo', 'folga', 'afastado'] as DriverStatus[]).map(s => {
          const count = MOCK_DRIVERS.filter(d => d.status === s).length;
          const cfg   = STATUS_STYLE[s];
          return (
            <div key={s} className="rounded-xl p-4 border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-muted)' }}>
                {cfg.label}
              </p>
              <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filtros + Botão cadastrar */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: 'var(--text-muted)' }} />
            <input
              type="text" placeholder="Buscar por nome ou zona..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg pl-9 pr-4 py-2 text-sm border focus:outline-none"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'em_rota', 'ativo', 'folga', 'afastado'] as const).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                style={status === s
                  ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                  : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                }
              >
                {s === 'all' ? 'Todos' : STATUS_STYLE[s].label}
              </button>
            ))}
          </div>

          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ml-auto"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            <UserPlus className="w-4 h-4" />
            Novo Coletor
          </button>
        </div>
      </Card>

      {/* Tabela compacta */}
      <Card noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Coletor', 'Telefone', 'CNH', 'Zona', 'Caminhão', 'Coletas/mês', 'Eficiência', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(driver => {
                const metrics    = MOCK_DRIVER_METRICS.find(m => m.driver_id === driver.id);
                const color      = AVATAR_COLORS[driver.id % AVATAR_COLORS.length];
                const s          = STATUS_STYLE[driver.status];
                const cnhExpire  = isCNHExpiring(driver.cnh_expiry);
                const isSelected = selected?.id === driver.id;

                return (
                  <tr key={driver.id}
                    className="border-b transition-colors cursor-pointer"
                    style={{
                      borderColor: 'rgba(var(--border-rgb), 0.3)',
                      background: isSelected ? 'rgba(74,222,128,0.05)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--card)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                    onClick={() => setSelected(isSelected ? null : driver)}
                  >
                    {/* Avatar + nome */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: color + '20', color }}>
                          {getInitials(driver.name)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{driver.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            desde {formatDate(driver.hired_at)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {driver.phone}
                    </td>

                    {/* CNH com alerta de vencimento */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono" style={{ color: 'var(--text)' }}>
                          Cat. {driver.cnh_category}
                        </span>
                        {cnhExpire && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                            style={{ background: 'rgba(250,204,21,0.15)', color: 'var(--warning)' }}>
                            ⚠ Vence {formatDate(driver.cnh_expiry)}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text)' }}>{driver.zone}</td>

                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {driver.truck_id ? `#${driver.truck_id}` : '—'}
                    </td>

                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text)' }}>
                      {metrics?.collections_month ?? '—'}
                    </td>

                    <td className="px-4 py-3 w-28">
                      {metrics
                        ? <FillBar level={metrics.efficiency_pct} />
                        : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                      }
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge label={s.label} className={s.className} />
                    </td>

                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4" style={{
                        color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                        transform: isSelected ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s',
                      }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center py-12 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Nenhum coletor encontrado
            </p>
          )}
        </div>
      </Card>

      {/* Painel lateral de performance */}
      {selected && <DriverPanel driver={selected} onClose={() => setSelected(null)} />}

      {/* Modal de cadastro */}
      {showModal && <DriverModal onClose={() => setModal(false)} />}
    </div>
  );
}