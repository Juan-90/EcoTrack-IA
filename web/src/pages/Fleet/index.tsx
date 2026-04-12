// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Fleet Maintenance Page
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  Wrench, Plus, AlertTriangle, CheckCircle,
  Clock, X, ChevronDown, ChevronUp, DollarSign,
  Gauge, Calendar, Building2, User
} from 'lucide-react';
import { Card, StatusBadge } from '../../components/ui';
import { MOCK_MAINTENANCE, MOCK_MAINTENANCE_ALERTS } from '../../services/mockData';
import type {
  Maintenance, MaintenanceType,
  MaintenanceStatus, MaintenancePart
} from '../../types';

// ── Config visual ─────────────────────────────────────────
const TYPE_STYLE: Record<MaintenanceType, { label: string; className: string }> = {
  preventiva:  { label: 'Preventiva',  className: 'text-blue-400 bg-blue-400/10'   },
  corretiva:   { label: 'Corretiva',   className: 'text-orange-400 bg-orange-400/10'},
  preditiva:   { label: 'Preditiva',   className: 'text-purple-400 bg-purple-400/10'},
  emergencial: { label: 'Emergencial', className: 'text-red-400 bg-red-400/10'     },
};

const STATUS_STYLE: Record<MaintenanceStatus, { label: string; className: string }> = {
  agendada:     { label: 'Agendada',     className: 'text-yellow-400 bg-yellow-400/10'},
  em_andamento: { label: 'Em Andamento', className: 'text-blue-400 bg-blue-400/10'   },
  concluida:    { label: 'Concluída',    className: 'text-green-400 bg-green-400/10' },
  cancelada:    { label: 'Cancelada',    className: 'text-zinc-400 bg-zinc-400/10'   },
};

const URGENCY_STYLE = {
  critica: { border: 'rgba(248,113,113,0.3)', color: '#f87171', bg: 'rgba(248,113,113,0.05)' },
  alta:    { border: 'rgba(251,146,60,0.3)',  color: '#fb923c', bg: 'rgba(251,146,60,0.05)'  },
  media:   { border: 'rgba(250,204,21,0.3)',  color: '#facc15', bg: 'rgba(250,204,21,0.05)'  },
};

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function totalCost(m: Maintenance) {
  const parts = m.parts.reduce((acc, p) => acc + p.cost_brl * p.quantity, 0);
  return m.labor_cost_brl + parts;
}

function formatCurrency(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ── Modal de registro ─────────────────────────────────────
function MaintenanceModal({ onClose }: { onClose: () => void }) {
  const [detailed, setDetailed] = useState(false);
  const [parts, setParts]       = useState<MaintenancePart[]>([]);
  const [form, setForm]         = useState({
    truck_plate: '', type: 'preventiva' as MaintenanceType,
    description: '', scheduled_date: '',
    workshop: '', mechanic: '',
    labor_cost_brl: '', next_km: '', next_date: '', notes: '',
  });

  const addPart = () => setParts(p => [...p, { name: '', quantity: 1, cost_brl: 0 }]);
  const removePart = (i: number) => setParts(p => p.filter((_, idx) => idx !== i));
  const updatePart = (i: number, field: keyof MaintenancePart, value: any) =>
    setParts(p => p.map((part, idx) => idx === i ? { ...part, [field]: value } : part));

  const partsTotal = parts.reduce((acc, p) => acc + (p.cost_brl * p.quantity), 0);
  const grandTotal = partsTotal + Number(form.labor_cost_brl || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-2xl rounded-2xl border my-4"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            Registrar Manutenção
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDetailed(!detailed)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
              style={detailed
                ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
              }
            >
              {detailed ? 'Detalhado ✓' : 'Modo Detalhado'}
            </button>
            <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Campos básicos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono mb-1"
                style={{ color: 'var(--text-muted)' }}>PLACA DO VEÍCULO</label>
              <input value={form.truck_plate}
                onChange={e => setForm(p => ({ ...p, truck_plate: e.target.value }))}
                placeholder="ABC-1234"
                className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
            </div>

            <div>
              <label className="block text-[10px] font-mono mb-1"
                style={{ color: 'var(--text-muted)' }}>DATA AGENDADA</label>
              <input type="date" value={form.scheduled_date}
                onChange={e => setForm(p => ({ ...p, scheduled_date: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)', colorScheme: 'dark' }} />
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-mono mb-1"
                style={{ color: 'var(--text-muted)' }}>DESCRIÇÃO</label>
              <input value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Ex: Revisão geral — 50.000 km"
                className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
            </div>

            {/* Tipo */}
            <div className="col-span-2">
              <label className="block text-[10px] font-mono mb-1.5"
                style={{ color: 'var(--text-muted)' }}>TIPO</label>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(TYPE_STYLE) as MaintenanceType[]).map(t => (
                  <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                    style={form.type === t
                      ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                      : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
                    }>
                    {TYPE_STYLE[t].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Campos detalhados */}
          {detailed && (
            <div className="space-y-4 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: 'var(--accent)', opacity: 0.7 }}>Informações Detalhadas</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono mb-1"
                    style={{ color: 'var(--text-muted)' }}>OFICINA</label>
                  <input value={form.workshop}
                    onChange={e => setForm(p => ({ ...p, workshop: e.target.value }))}
                    placeholder="Nome da oficina"
                    className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="block text-[10px] font-mono mb-1"
                    style={{ color: 'var(--text-muted)' }}>MECÂNICO</label>
                  <input value={form.mechanic}
                    onChange={e => setForm(p => ({ ...p, mechanic: e.target.value }))}
                    placeholder="Nome do mecânico"
                    className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="block text-[10px] font-mono mb-1"
                    style={{ color: 'var(--text-muted)' }}>MÃO DE OBRA (R$)</label>
                  <input type="number" value={form.labor_cost_brl}
                    onChange={e => setForm(p => ({ ...p, labor_cost_brl: e.target.value }))}
                    placeholder="0,00"
                    className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="block text-[10px] font-mono mb-1"
                    style={{ color: 'var(--text-muted)' }}>PRÓXIMA REVISÃO (KM)</label>
                  <input type="number" value={form.next_km}
                    onChange={e => setForm(p => ({ ...p, next_km: e.target.value }))}
                    placeholder="60000"
                    className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                </div>
                <div>
                  <label className="block text-[10px] font-mono mb-1"
                    style={{ color: 'var(--text-muted)' }}>PRÓXIMA REVISÃO (DATA)</label>
                  <input type="date" value={form.next_date}
                    onChange={e => setForm(p => ({ ...p, next_date: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)', colorScheme: 'dark' }} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono mb-1"
                    style={{ color: 'var(--text-muted)' }}>OBSERVAÇÕES</label>
                  <textarea value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    rows={2} placeholder="Observações adicionais..."
                    className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none resize-none"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                </div>
              </div>

              {/* Peças */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)' }}>PEÇAS UTILIZADAS</label>
                  <button onClick={addPart}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono border"
                    style={{ color: 'var(--accent)', borderColor: 'rgba(74,222,128,0.3)' }}>
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                </div>
                {parts.map((part, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input value={part.name}
                      onChange={e => updatePart(i, 'name', e.target.value)}
                      placeholder="Nome da peça"
                      className="flex-1 rounded-lg px-3 py-1.5 text-xs border focus:outline-none"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                    <input type="number" value={part.quantity}
                      onChange={e => updatePart(i, 'quantity', Number(e.target.value))}
                      placeholder="Qtd"
                      className="w-16 rounded-lg px-2 py-1.5 text-xs border focus:outline-none"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                    <input type="number" value={part.cost_brl}
                      onChange={e => updatePart(i, 'cost_brl', Number(e.target.value))}
                      placeholder="R$"
                      className="w-24 rounded-lg px-2 py-1.5 text-xs border focus:outline-none"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                    <button onClick={() => removePart(i)} style={{ color: 'var(--danger)' }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {parts.length > 0 && (
                  <div className="flex justify-end mt-2">
                    <div className="text-xs font-mono p-2 rounded-lg border"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                      Peças: {formatCurrency(partsTotal)} + M.O.: {formatCurrency(Number(form.labor_cost_brl || 0))}
                      <span className="ml-2 font-bold" style={{ color: 'var(--accent)' }}>
                        = {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <button onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Cancelar
            </button>
            <button onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-bold"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
              Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Linha expansível da tabela ────────────────────────────
function MaintenanceRow({ m }: { m: Maintenance }) {
  const [expanded, setExpanded] = useState(false);
  const cost = totalCost(m);

  return (
    <>
      <tr className="border-b transition-colors cursor-pointer"
        style={{ borderColor: 'rgba(45,106,79,0.2)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--card)')}
        onMouseLeave={e => (e.currentTarget.style.background = expanded ? 'var(--card)' : 'transparent')}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {expanded
              ? <ChevronUp   className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            }
            <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
              {m.truck_plate}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <StatusBadge label={TYPE_STYLE[m.type].label} className={TYPE_STYLE[m.type].className} />
        </td>
        <td className="px-4 py-3 text-xs" style={{ color: 'var(--text)' }}>{m.description}</td>
        <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {formatDate(m.scheduled_date)}
        </td>
        <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {m.km_at_service > 0 ? `${m.km_at_service.toLocaleString('pt-BR')} km` : '—'}
        </td>
        <td className="px-4 py-3 text-xs font-mono font-bold"
          style={{ color: cost > 0 ? 'var(--text)' : 'var(--text-muted)' }}>
          {cost > 0 ? formatCurrency(cost) : '—'}
        </td>
        <td className="px-4 py-3">
          <StatusBadge label={STATUS_STYLE[m.status].label} className={STATUS_STYLE[m.status].className} />
        </td>
      </tr>

      {/* Detalhes expandidos */}
      {expanded && (
        <tr style={{ background: 'var(--surface)' }}>
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {m.workshop && (
                <div className="flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="font-mono" style={{ color: 'var(--text-muted)' }}>OFICINA</p>
                    <p style={{ color: 'var(--text)' }}>{m.workshop}</p>
                  </div>
                </div>
              )}
              {m.mechanic && (
                <div className="flex items-start gap-2">
                  <User className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="font-mono" style={{ color: 'var(--text-muted)' }}>MECÂNICO</p>
                    <p style={{ color: 'var(--text)' }}>{m.mechanic}</p>
                  </div>
                </div>
              )}
              {m.next_km && (
                <div className="flex items-start gap-2">
                  <Gauge className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="font-mono" style={{ color: 'var(--text-muted)' }}>PRÓXIMA REVISÃO</p>
                    <p style={{ color: 'var(--text)' }}>{m.next_km.toLocaleString('pt-BR')} km</p>
                  </div>
                </div>
              )}
              {m.next_date && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="font-mono" style={{ color: 'var(--text-muted)' }}>DATA PRÓXIMA</p>
                    <p style={{ color: 'var(--text)' }}>{formatDate(m.next_date)}</p>
                  </div>
                </div>
              )}
              {m.labor_cost_brl > 0 && (
                <div className="flex items-start gap-2">
                  <DollarSign className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="font-mono" style={{ color: 'var(--text-muted)' }}>MÃO DE OBRA</p>
                    <p style={{ color: 'var(--text)' }}>{formatCurrency(m.labor_cost_brl)}</p>
                  </div>
                </div>
              )}
              {m.parts.length > 0 && (
                <div className="col-span-2">
                  <p className="font-mono mb-1" style={{ color: 'var(--text-muted)' }}>PEÇAS</p>
                  <div className="space-y-1">
                    {m.parts.map((p, i) => (
                      <div key={i} className="flex justify-between">
                        <span style={{ color: 'var(--text)' }}>{p.name} × {p.quantity}</span>
                        <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                          {formatCurrency(p.cost_brl * p.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1 border-t font-bold"
                      style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--text)' }}>Total peças</span>
                      <span style={{ color: 'var(--accent)' }}>
                        {formatCurrency(m.parts.reduce((a, p) => a + p.cost_brl * p.quantity, 0))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {m.notes && (
                <div className="col-span-2">
                  <p className="font-mono mb-1" style={{ color: 'var(--text-muted)' }}>OBSERVAÇÕES</p>
                  <p style={{ color: 'var(--text)' }}>{m.notes}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Página principal ──────────────────────────────────────
export default function Fleet() {
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'all'>('all');
  const [typeFilter,   setTypeFilter]   = useState<MaintenanceType | 'all'>('all');
  const [showModal,    setShowModal]    = useState(false);

  const filtered = MOCK_MAINTENANCE
    .filter(m => statusFilter === 'all' || m.status === statusFilter)
    .filter(m => typeFilter   === 'all' || m.type   === typeFilter)
    .sort((a, b) => new Date(b.scheduled_date).getTime() - new Date(a.scheduled_date).getTime());

  // KPIs
  const totalCostAll   = MOCK_MAINTENANCE.reduce((acc, m) => acc + totalCost(m), 0);
  const inProgress     = MOCK_MAINTENANCE.filter(m => m.status === 'em_andamento').length;
  const scheduled      = MOCK_MAINTENANCE.filter(m => m.status === 'agendada').length;
  const concluded      = MOCK_MAINTENANCE.filter(m => m.status === 'concluida').length;

  return (
    <div className="space-y-5">

      {/* ── Alertas preventivos ── */}
      {MOCK_MAINTENANCE_ALERTS.length > 0 && (
        <div className="space-y-2">
          {MOCK_MAINTENANCE_ALERTS.map((alert, i) => {
            const s = URGENCY_STYLE[alert.urgency];
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{ background: s.bg, borderColor: s.border }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
                <div className="flex-1">
                  <span className="text-xs font-semibold" style={{ color: s.color }}>
                    {alert.truck_plate}
                  </span>
                  <span className="text-xs ml-2" style={{ color: 'var(--text)' }}>
                    {alert.message}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                  style={{ background: s.color + '20', color: s.color }}>
                  {alert.type === 'km' ? `${alert.due_km?.toLocaleString('pt-BR')} km` : formatDate(alert.due_date!)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Custo Total',     value: formatCurrency(totalCostAll), icon: DollarSign, color: 'var(--accent)'  },
          { label: 'Em Andamento',    value: inProgress,                   icon: Wrench,     color: '#60a5fa'        },
          { label: 'Agendadas',       value: scheduled,                    icon: Clock,      color: '#facc15'        },
          { label: 'Concluídas',      value: concluded,                    icon: CheckCircle,color: '#4ade80'        },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <k.icon className="w-4 h-4 mb-2" style={{ color: k.color }} />
            <p className="text-[9px] font-mono uppercase tracking-wider mb-1"
              style={{ color: 'var(--text-muted)' }}>{k.label}</p>
            <p className="text-lg font-bold font-mono" style={{ color: 'var(--text)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filtros + Botão ── */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'agendada', 'em_andamento', 'concluida', 'cancelada'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                style={statusFilter === s
                  ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                  : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
                }>
                {s === 'all' ? 'Todos' : STATUS_STYLE[s].label}
              </button>
            ))}
          </div>

          <div className="w-px h-4" style={{ background: 'var(--border)' }} />

          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'preventiva', 'corretiva', 'preditiva', 'emergencial'] as const).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                style={typeFilter === t
                  ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                  : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
                }>
                {t === 'all' ? 'Todos' : TYPE_STYLE[t].label}
              </button>
            ))}
          </div>

          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold ml-auto"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            <Plus className="w-3.5 h-3.5" />
            Registrar Manutenção
          </button>
        </div>
      </Card>

      {/* ── Tabela ── */}
      <Card noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Veículo', 'Tipo', 'Descrição', 'Data', 'Km', 'Custo Total', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => <MaintenanceRow key={m.id} m={m} />)}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Nenhuma manutenção encontrada
            </p>
          )}
        </div>
      </Card>

      {showModal && <MaintenanceModal onClose={() => setShowModal(false)} />}
    </div>
  );
}