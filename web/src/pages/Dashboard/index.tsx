// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Dashboard (Web)
//  Espelha o dashboard.tsx do mobile com os mesmos KPIs,
//  gráficos e lógica de previsão predictFillTime()
// ─────────────────────────────────────────────────────────
import { Trash2, Truck, Activity, Target, AlertTriangle } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { KpiCard, Card, FillBar, StatusBadge, LoadingSpinner } from '../../components/ui';
import { useDashboardStats, useBins, useTrucks } from '../../hooks/useEcoTrack';
import { predictFillTime, PRIORITY_EMOJI, PRIORITY_COLOR, PRIORITY_LABEL, TRUCK_STATUS_COLOR, TRUCK_STATUS_LABEL, getLevelColor } from '../../utils/helpers';

// Tooltip customizado na paleta EcoTrack
const EcoTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-xs font-mono border" style={{ background: '#1b4332', borderColor: '#2d6a4f' }}>
      <p className="mb-1" style={{ color: '#9ca3af' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? '#4ade80' }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { data: stats,  isLoading: sLoading } = useDashboardStats();
  const { data: bins,   isLoading: bLoading } = useBins();
  const { data: trucks, isLoading: tLoading } = useTrucks();

  if (sLoading || bLoading || tLoading) return <LoadingSpinner message="Carregando dados da cidade..." />;

  const fullBins     = bins?.filter(b => b.level > 80) ?? [];
  const activeTrucks = trucks?.filter(t => t.status === 'em_rota') ?? [];

  return (
    <div className="space-y-5">

      {/* Alerta lixeiras críticas */}
      {fullBins.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ background: 'rgba(248,113,113,0.05)', borderColor: 'rgba(248,113,113,0.2)' }}>
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm" style={{ color: '#fca5a5' }}>
            <strong>{fullBins.length} lixeira{fullBins.length > 1 ? 's' : ''}</strong> com nível acima de 80% — coleta prioritária necessária.
          </span>
        </div>
      )}

      {/* ── KPIs — idênticos ao mobile ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Lixeiras Monitoradas"
          value={stats?.total_bins ?? 42}
          sub={`${fullBins.length} precisam de coleta`}
          icon={Trash2}
        />
        <KpiCard
          label="Lixeiras Cheias"
          value={stats?.full_bins ?? 8}
          sub="nível acima de 80%"
          icon={AlertTriangle}
          iconColor="#f87171"
        />
        <KpiCard
          label="Coletas Hoje"
          value={stats?.collections_today ?? 17}
          sub="rotas concluídas"
          icon={Truck}
          iconColor="#60a5fa"
        />
        <KpiCard
          label="Eficiência"
          value={`${stats?.efficiency_pct ?? 91}%`}
          sub="meta: 95%"
          icon={Target}
          iconColor="#a78bfa"
          trend={{ value: 2, label: 'vs ontem' }}
        />
      </div>

      {/* ── Gráficos — idênticos ao mobile ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Nível Médio por hora — LineChart como no mobile */}
        <Card title="Nível Médio das Lixeiras" badge="hoje">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.level_by_hour ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d6a4f" />
              <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <YAxis unit="%" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<EcoTooltip />} />
              <Line
                type="monotone" dataKey="level" name="Nível %"
                stroke="#4ade80" strokeWidth={2}
                dot={{ fill: '#4ade80', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#4ade80' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Coletas por dia — BarChart como no mobile */}
        <Card title="Coletas na Semana" badge="últimos 7 dias">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.collections_per_day ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d6a4f" />
              <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <Tooltip content={<EcoTooltip />} />
              <Bar dataKey="count" name="Coletas" fill="#1b4332" radius={[3, 3, 0, 0]}>
                {stats?.collections_per_day?.map((_, i) => (
                  <rect key={i} fill="#4ade80" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Previsão de Enchimento (IA) + Lixeiras Críticas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Previsão — mesma lógica do predictFillTime() mobile */}
        <Card title="Previsão de Enchimento" badge="IA — taxa 10%/h">
          <div className="space-y-3">
            {(stats?.critical_bins ?? []).map((bin) => (
              <div key={bin.name} className="flex items-center justify-between p-3 rounded-xl border" style={{ background: '#1b4332', borderColor: '#2d6a4f' }}>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <div>
                    <p className="text-sm text-white font-medium">{bin.name}</p>
                    <p className="text-xs font-mono" style={{ color: '#9ca3af' }}>Nível atual: {bin.level}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-mono" style={{ color: '#facc15' }}>
                    ~{predictFillTime(bin.level)}
                  </p>
                  <p className="text-[10px]" style={{ color: '#9ca3af' }}>para encher</p>
                </div>
              </div>
            ))}
            <p className="text-[10px] font-mono text-center pt-1" style={{ color: '#4ade80', opacity: 0.6 }}>
              * Modelo linear — será substituído por IA real (ESP32 + histórico)
            </p>
          </div>
        </Card>

        {/* Ranking lixeiras críticas — igual ao mobile */}
        <Card title="Lixeiras Críticas" badge="ordenadas por nível">
          <div className="space-y-2">
            {bins
              ?.filter(b => b.level >= 50)
              .sort((a, b) => b.level - a.level)
              .slice(0, 6)
              .map((bin, i) => (
                <div key={bin.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: '#1b4332', borderColor: '#2d6a4f' }}>
                  <span className="text-sm font-mono font-bold w-5 text-center" style={{ color: '#9ca3af' }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm text-white truncate">{bin.name}</span>
                      <StatusBadge label={PRIORITY_LABEL[bin.priority]} className={PRIORITY_COLOR[bin.priority]} />
                    </div>
                    <FillBar level={bin.level} />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Status da frota */}
      <Card title="Status da Frota" badge={`${activeTrucks.length} em operação`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trucks?.map((truck) => (
            <div key={truck.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: '#1b4332', borderColor: '#2d6a4f' }}>
              <span className="text-xl">🚛</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-mono text-white">{truck.plate}</span>
                  <StatusBadge label={TRUCK_STATUS_LABEL[truck.status]} className={TRUCK_STATUS_COLOR[truck.status]} />
                </div>
                <p className="text-[10px] truncate" style={{ color: '#9ca3af' }}>{truck.driver}</p>
                {truck.current_load_kg > 0 && (
                  <div className="mt-1">
                    <FillBar level={Math.round((truck.current_load_kg / truck.capacity_kg) * 100)} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
