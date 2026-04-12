// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Reports Page
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  FileText, Download, Table, TrendingUp,
  Truck, MapPin, Calendar, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, FillBar, StatusBadge } from '../../components/ui';
import { MOCK_REPORT_DATA } from '../../services/mockData';
import { exportPDF, exportExcel } from '../../utils/exportReport';

type Period = 'diario' | 'semanal' | 'mensal';

const PERIOD_CONFIG = {
  diario:  { label: 'Diário',   days: 1  },
  semanal: { label: 'Semanal',  days: 7  },
  mensal:  { label: 'Mensal',   days: 30 },
};

const EcoTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-xs font-mono border"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <p className="mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? 'var(--accent)' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Reports() {
  const [period,    setPeriod]    = useState<Period>('mensal');
  const [activeTab, setActiveTab] = useState<'coletas' | 'motoristas' | 'rotas'>('coletas');
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const days = PERIOD_CONFIG[period].days;
  const data = {
    collections: MOCK_REPORT_DATA.collections_daily.slice(-days),
    drivers:     MOCK_REPORT_DATA.driver_performance,
    routes:      MOCK_REPORT_DATA.route_efficiency,
    kpis:        MOCK_REPORT_DATA.monthly_kpis,
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setExporting(format);
    await new Promise(r => setTimeout(r, 300));
    if (format === 'pdf')   exportPDF(period, data);
    if (format === 'excel') await exportExcel(period, data);  
    setExporting(null);
  };

  return (
    <div className="space-y-5">

      {/* ── Controles ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Período */}
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(Object.keys(PERIOD_CONFIG) as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono transition-all"
              style={period === p
                ? { background: 'var(--accent)', color: 'var(--bg)' }
                : { background: 'var(--card)',   color: 'var(--text-muted)' }
              }
            >
              <Calendar className="w-3 h-3" />
              {PERIOD_CONFIG[p].label}
            </button>
          ))}
        </div>

        {/* Exportar */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50"
            style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
          >
            <FileText className="w-3.5 h-3.5" />
            {exporting === 'pdf' ? 'Gerando...' : 'Exportar PDF'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={exporting !== null}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50"
            style={{ background: 'rgba(74,222,128,0.1)', color: 'var(--accent)', borderColor: 'rgba(74,222,128,0.3)' }}
          >
            <Table className="w-3.5 h-3.5" />
            {exporting === 'excel' ? 'Gerando...' : 'Exportar Excel'}
          </button>
        </div>
      </div>

      {/* ── KPIs do período ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Coletas',        value: data.kpis.total_collections.toLocaleString('pt-BR'), icon: BarChart2 },
          { label: 'Kg coletados',   value: `${(data.kpis.total_kg/1000).toFixed(1)}t`,          icon: Download  },
          { label: 'Km rodados',     value: `${data.kpis.total_km.toLocaleString('pt-BR')} km`,  icon: MapPin    },
          { label: 'Eficiência',     value: `${data.kpis.avg_efficiency}%`,                       icon: TrendingUp},
          { label: 'Lixeiras evit.', value: data.kpis.full_bins_avoided.toString(),               icon: Truck     },
          { label: 'Economia',       value: `R$${(data.kpis.cost_saved_brl/1000).toFixed(1)}k`,  icon: FileText  },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <k.icon className="w-4 h-4 mb-2" style={{ color: 'var(--accent)' }} />
            <p className="text-[9px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
              {k.label}
            </p>
            <p className="text-lg font-bold font-mono" style={{ color: 'var(--text)' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border)' }}>
        {([
          { key: 'coletas',     label: 'Coletas por Dia',     icon: BarChart2  },
          { key: 'motoristas',  label: 'Performance Motoristas', icon: Truck   },
          { key: 'rotas',       label: 'Eficiência das Rotas', icon: MapPin    },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all"
            style={activeTab === t.key
              ? { borderColor: 'var(--accent)', color: 'var(--accent)' }
              : { borderColor: 'transparent',   color: 'var(--text-muted)' }
            }
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Aba: Coletas por dia ── */}
      {activeTab === 'coletas' && (
        <div className="space-y-5">
          <Card title="Coletas por Dia" badge={`últimos ${days} dias`}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.collections}>
                <defs>
                  {['total','zona_centro','zona_norte','zona_sul'].map((k, i) => (
                    <linearGradient key={k} id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={['#4ade80','#60a5fa','#facc15','#f87171'][i]} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={['#4ade80','#60a5fa','#facc15','#f87171'][i]} stopOpacity={0}    />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip content={<EcoTooltip />} />
                <Area type="monotone" dataKey="total"       name="Total"   stroke="#4ade80" strokeWidth={2} fill="url(#g0)" />
                <Area type="monotone" dataKey="zona_centro" name="Centro"  stroke="#60a5fa" strokeWidth={1.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="zona_norte"  name="Norte"   stroke="#facc15" strokeWidth={1.5} fill="url(#g2)" />
                <Area type="monotone" dataKey="zona_sul"    name="Sul"     stroke="#f87171" strokeWidth={1.5} fill="url(#g3)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Volume Coletado (kg)" badge={`últimos ${days} dias`}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.collections}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <Tooltip content={<EcoTooltip />} />
                <Bar dataKey="kg_total" name="Kg coletados" fill="var(--accent)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* ── Aba: Performance motoristas ── */}
      {activeTab === 'motoristas' && (
        <Card title="Performance por Motorista" badge={PERIOD_CONFIG[period].label} noPad>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['Motorista','Coletas','Km rodados','Eficiência','No Prazo','Tempo médio','Avaliação'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.drivers
                  .sort((a, b) => b.efficiency - a.efficiency)
                  .map((d, i) => (
                  <tr key={d.name} className="border-b transition-colors"
                    style={{ borderColor: 'rgba(45,106,79,0.2)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--card)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono w-5 text-center"
                          style={{ color: i < 3 ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {i + 1}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text)' }}>{d.collections}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text)' }}>{d.km} km</td>
                    <td className="px-4 py-3 w-28"><FillBar level={d.efficiency} /></td>
                    <td className="px-4 py-3 w-28"><FillBar level={d.on_time} /></td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{d.avg_min} min</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={d.efficiency >= 95 ? '⭐ Destaque' : d.efficiency >= 85 ? '✅ Bom' : '⚠ Atenção'}
                        className={d.efficiency >= 95
                          ? 'text-yellow-400 bg-yellow-400/10'
                          : d.efficiency >= 85
                          ? 'text-green-400 bg-green-400/10'
                          : 'text-red-400 bg-red-400/10'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Aba: Eficiência das rotas ── */}
      {activeTab === 'rotas' && (
        <div className="space-y-5">
          <Card title="Eficiência das Rotas" badge={PERIOD_CONFIG[period].label} noPad>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    {['Rota','Execuções','No Prazo','Paradas médias','Km médio','Conclusão'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.routes.map(r => (
                    <tr key={r.route} className="border-b transition-colors"
                      style={{ borderColor: 'rgba(45,106,79,0.2)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--card)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: 'var(--text)' }}>{r.route}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text)' }}>{r.total_runs}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text)' }}>
                        {r.on_time}/{r.total_runs}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text)' }}>{r.avg_stops}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text)' }}>{r.avg_km} km</td>
                      <td className="px-4 py-3 w-28"><FillBar level={r.completion} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Comparativo de Conclusão por Rota">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.routes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="route" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<EcoTooltip />} />
                <Bar dataKey="completion" name="Conclusão %" radius={[0,3,3,0]}>
                  {data.routes.map((r, i) => (
                    <rect key={i} fill={r.completion >= 95 ? '#4ade80' : r.completion >= 85 ? '#facc15' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

    </div>
  );
}