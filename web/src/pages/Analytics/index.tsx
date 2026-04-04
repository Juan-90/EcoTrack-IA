// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Analytics
// ─────────────────────────────────────────────────────────
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, LoadingSpinner } from '../../components/ui';
import { useDashboardStats, useBins } from '../../hooks/useEcoTrack';
import { PRIORITY_EMOJI } from '../../utils/helpers';

const COLORS = ['#4ade80', '#facc15', '#f87171', '#60a5fa'];
const EcoTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-xs font-mono border" style={{ background: '#1b4332', borderColor: '#2d6a4f' }}>
      <p className="mb-1" style={{ color: '#9ca3af' }}>{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color ?? '#4ade80' }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

const composicao = [
  { name: 'Alta >80%',    value: 19 },
  { name: 'Média 50-79%', value: 38 },
  { name: 'Baixa <50%',   value: 43 },
];

export default function Analytics() {
  const { data: stats, isLoading: sLoading } = useDashboardStats();
  const { data: bins,  isLoading: bLoading } = useBins();

  if (sLoading || bLoading) return <LoadingSpinner message="Carregando analytics..." />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Coletas Hoje',  value: stats?.collections_today ?? 17 },
          { label: 'Nível Médio',   value: `${stats?.avg_level ?? 63}%`   },
          { label: 'Cheias',        value: stats?.full_bins ?? 8           },
          { label: 'Eficiência',    value: `${stats?.efficiency_pct ?? 91}%` },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border" style={{ background: '#1b4332', borderColor: '#2d6a4f' }}>
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#9ca3af' }}>{k.label}</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Nível Médio por Hora" badge="hoje">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.level_by_hour ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d6a4f" />
              <XAxis dataKey="label" tick={{ fill:'#9ca3af', fontSize:10, fontFamily:'monospace' }} axisLine={false} tickLine={false} />
              <YAxis unit="%" tick={{ fill:'#9ca3af', fontSize:10, fontFamily:'monospace' }} axisLine={false} tickLine={false} domain={[0,100]} />
              <Tooltip content={<EcoTip />} />
              <Line type="monotone" dataKey="level" name="Nível %" stroke="#4ade80" strokeWidth={2} dot={{ fill:'#4ade80', r:3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Coletas por Dia" badge="semana">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats?.collections_per_day ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d6a4f" />
              <XAxis dataKey="label" tick={{ fill:'#9ca3af', fontSize:10, fontFamily:'monospace' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#9ca3af', fontSize:10, fontFamily:'monospace' }} axisLine={false} tickLine={false} />
              <Tooltip content={<EcoTip />} />
              <Bar dataKey="count" name="Coletas" fill="#4ade80" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Distribuição por Prioridade">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={composicao} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {composicao.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background:'#1b4332', border:'1px solid #2d6a4f', borderRadius:8, fontFamily:'monospace', fontSize:11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {composicao.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                    <span className="text-xs text-white">{d.name}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: COLORS[i] }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Top 5 Lixeiras Críticas" badge="por nível">
          <div className="space-y-2 pt-1">
            {bins?.sort((a,b) => b.level - a.level).slice(0,5).map((bin, i) => (
              <div key={bin.id} className="flex items-center gap-3 p-2.5 rounded-lg border" style={{ background:'#1b4332', borderColor:'#2d6a4f' }}>
                <span className="text-xs font-mono font-bold w-4" style={{ color:'#9ca3af' }}>{i+1}</span>
                <span>{PRIORITY_EMOJI[bin.priority]}</span>
                <span className="flex-1 text-xs text-white">{bin.name}</span>
                <span className="text-xs font-mono font-bold" style={{ color: bin.level > 80 ? '#f87171' : bin.level >= 50 ? '#facc15' : '#4ade80' }}>
                  {bin.level}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
