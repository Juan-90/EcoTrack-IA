// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Zones Page (Zonas e Bairros)
// ─────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import {
  MapPin, Trash2, TrendingUp, Clock,
  FileText, Route, Filter, AlertTriangle
} from 'lucide-react';
import {
  MapContainer, TileLayer, Circle, Popup, useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Card, FillBar, StatusBadge } from '../../components/ui';
import { MOCK_ZONES, MOCK_BINS } from '../../services/mockData';
import { exportPDF } from '../../utils/exportReport';
import type { Zone } from '../../types';

// ── Utilitários ───────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 3600)  return `${Math.floor(diff / 60)}min atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

function getCriticalityLabel(avgLevel: number) {
  if (avgLevel >= 70) return { label: 'Crítica',  className: 'text-red-400 bg-red-400/10'    };
  if (avgLevel >= 50) return { label: 'Moderada', className: 'text-yellow-400 bg-yellow-400/10' };
  return               { label: 'Normal',   className: 'text-green-400 bg-green-400/10'  };
}

// ── Componente: foco no mapa ──────────────────────────────
function MapFocus({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);
  return null;
}

// ── Componente: card de zona ──────────────────────────────
function ZoneCard({
  zone, selected, onClick
}: { zone: Zone; selected: boolean; onClick: () => void }) {
  const criticality = getCriticalityLabel(zone.avg_level);
  const fillPct     = Math.round((zone.full_bins / zone.total_bins) * 100);

  return (
    <div
      onClick={onClick}
      className="rounded-xl border p-4 cursor-pointer transition-all"
      style={{
        background:  selected ? `${zone.color}10` : 'var(--card)',
        borderColor: selected ? zone.color        : 'var(--border)',
        borderWidth: selected ? '2px'             : '1px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: zone.color }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            {zone.name}
          </h3>
        </div>
        <StatusBadge label={criticality.label} className={criticality.className} />
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Lixeiras', value: zone.total_bins,        icon: Trash2     },
          { label: 'Cheias',   value: zone.full_bins,         icon: AlertTriangle },
          { label: 'Coletas/sem', value: zone.collections_week, icon: TrendingUp },
        ].map(m => (
          <div key={m.label} className="text-center">
            <m.icon className="w-3 h-3 mx-auto mb-1" style={{ color: zone.color }} />
            <p className="text-base font-bold font-mono" style={{ color: 'var(--text)' }}>{m.value}</p>
            <p className="text-[9px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* Nível médio */}
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            Nível médio
          </span>
          <span className="text-[10px] font-mono font-bold" style={{ color: zone.color }}>
            {zone.avg_level}%
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${zone.avg_level}%`, background: zone.color }} />
        </div>
      </div>

      {/* Última coleta + frequência */}
      <div className="flex justify-between text-[10px] font-mono"
        style={{ color: 'var(--text-muted)' }}>
        <span>⏱ {timeAgo(zone.last_collection)}</span>
        <span>📅 a cada {zone.avg_collection_freq_days}d</span>
      </div>

      {/* Lixeiras críticas */}
      {zone.critical_bins.length > 0 && (
        <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[9px] font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
            CRÍTICAS
          </p>
          <div className="flex flex-wrap gap-1">
            {zone.critical_bins.map(b => (
              <span key={b} className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: `${zone.color}20`, color: zone.color }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Exportar relatório de zona ────────────────────────────
function exportZoneReport(zone: Zone) {
  const data = {
    collections: MOCK_ZONES.map(z => ({
      label: z.name, total: z.collections_week,
      zona_centro: 0, zona_norte: 0, zona_sul: 0,
      zona_leste: 0, zona_oeste: 0, kg_total: z.avg_level * 100,
    })),
    drivers: [],
    routes:  [],
    kpis: {
      total_collections:  zone.collections_month,
      total_kg:           zone.collections_month * 180,
      total_km:           zone.collections_month * 4,
      avg_efficiency:     Math.round(100 - zone.avg_level * 0.2),
      full_bins_avoided:  zone.collections_month * 2,
      cost_saved_brl:     zone.collections_month * 85,
    },
  };
  exportPDF('mensal', data);
}

// ── Página principal ──────────────────────────────────────
export default function Zones() {
  const [selected,   setSelected]   = useState<Zone | null>(null);
  const [sortBy,     setSortBy]     = useState<'level' | 'name' | 'collections'>('level');
  const [mapCenter,  setMapCenter]  = useState<[number, number] | null>(null);
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string;

  const sorted = [...MOCK_ZONES].sort((a, b) => {
    if (sortBy === 'level')       return b.avg_level - a.avg_level;
    if (sortBy === 'collections') return b.collections_week - a.collections_week;
    return a.name.localeCompare(b.name);
  });

  // Lixeiras da zona selecionada
  const zoneBins = selected
    ? MOCK_BINS.filter(b => b.zone === selected.name)
    : MOCK_BINS;

  const handleSelectZone = (zone: Zone) => {
    if (selected?.id === zone.id) {
      setSelected(null);
      setMapCenter(null);
    } else {
      setSelected(zone);
      setMapCenter(zone.center);
    }
  };

  // Dados para gráfico
  const chartData = sorted.map(z => ({
    name:  z.name.split(' ')[0], // primeira palavra
    level: z.avg_level,
    color: z.color,
  }));

  const EcoTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg p-2 text-xs font-mono border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <p style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p style={{ color: payload[0]?.payload?.color ?? 'var(--accent)' }}>
          Nível: {payload[0]?.value}%
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-5">

      {/* ── KPIs gerais ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Zonas Monitoradas',
            value: MOCK_ZONES.length,
            sub:   `${MOCK_ZONES.filter(z => z.avg_level >= 70).length} críticas`,
            icon:  MapPin,
          },
          {
            label: 'Total de Lixeiras',
            value: MOCK_ZONES.reduce((a, z) => a + z.total_bins, 0),
            sub:   `${MOCK_ZONES.reduce((a, z) => a + z.full_bins, 0)} cheias`,
            icon:  Trash2,
          },
          {
            label: 'Coletas na Semana',
            value: MOCK_ZONES.reduce((a, z) => a + z.collections_week, 0),
            sub:   'todas as zonas',
            icon:  TrendingUp,
          },
          {
            label: 'Freq. Média',
            value: `${(MOCK_ZONES.reduce((a, z) => a + z.avg_collection_freq_days, 0) / MOCK_ZONES.length).toFixed(1)}d`,
            sub:   'entre coletas',
            icon:  Clock,
          },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4 border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <k.icon className="w-4 h-4 mb-2" style={{ color: 'var(--accent)' }} />
            <p className="text-[9px] font-mono uppercase tracking-wider mb-1"
              style={{ color: 'var(--text-muted)' }}>{k.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: 'var(--text)' }}>{k.value}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Mapa + Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Mapa de calor */}
        <div className="lg:col-span-3">
          <Card title="Mapa de Calor por Zona"
            badge={selected ? `Filtrando: ${selected.name}` : 'Todas as zonas'}>
            <div style={{ height: '460px', borderRadius: '8px', overflow: 'hidden',
              border: '1px solid var(--border)' }}>
              <MapContainer
                center={[-23.5505, -46.6333]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
                  attribution='© MapTiler © OSM'
                  tileSize={512}
                  zoomOffset={-1}
                />

                {mapCenter && <MapFocus center={mapCenter} />}

                {/* Círculos de calor por zona */}
                {MOCK_ZONES.map(zone => (
                  <Circle
                    key={zone.id}
                    center={zone.center}
                    radius={zone.avg_level * 25}  // raio proporcional ao nível
                    pathOptions={{
                      fillColor:   zone.color,
                      fillOpacity: selected?.id === zone.id ? 0.5 : 0.25,
                      color:       zone.color,
                      weight:      selected?.id === zone.id ? 3 : 1,
                      opacity:     0.8,
                    }}
                    eventHandlers={{ click: () => handleSelectZone(zone) }}
                  >
                    <Popup>
                      <div style={{
                        background: '#0d1f14', color: '#fff',
                        padding: '10px', borderRadius: '8px',
                        minWidth: '160px', fontFamily: 'sans-serif',
                      }}>
                        <p style={{ fontSize: '13px', fontWeight: 'bold',
                          color: zone.color, marginBottom: '6px' }}>
                          📍 {zone.name}
                        </p>
                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                          Nível médio: <strong style={{ color: '#fff' }}>{zone.avg_level}%</strong>
                        </p>
                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                          Lixeiras: <strong style={{ color: '#fff' }}>{zone.total_bins}</strong>
                          ({zone.full_bins} cheias)
                        </p>
                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                          Coletas/semana: <strong style={{ color: '#fff' }}>{zone.collections_week}</strong>
                        </p>
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </div>
          </Card>
        </div>

        {/* Ranking lateral */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ordenação */}
          <div className="flex gap-1.5">
            {([
              { key: 'level',       label: 'Nível'     },
              { key: 'collections', label: 'Coletas'   },
              { key: 'name',        label: 'Nome'      },
            ] as const).map(s => (
              <button key={s.key} onClick={() => setSortBy(s.key)}
                className="flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all"
                style={sortBy === s.key
                  ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                  : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
                }>
                {s.label}
              </button>
            ))}
          </div>

          {/* Cards das zonas */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {sorted.map((zone, i) => (
              <div key={zone.id} className="relative">
                {sortBy === 'level' && (
                  <span className="absolute -left-1 -top-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center z-10"
                    style={{ background: zone.color, color: '#fff' }}>
                    {i + 1}
                  </span>
                )}
                <ZoneCard
                  zone={zone}
                  selected={selected?.id === zone.id}
                  onClick={() => handleSelectZone(zone)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gráfico comparativo + Ações ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Gráfico */}
        <div className="lg:col-span-2">
          <Card title="Nível Médio por Zona" badge="comparativo">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%"
                  tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={80}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={<EcoTooltip />} />
                <Bar dataKey="level" name="Nível médio" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Ações por zona */}
        <Card title="Ações" badge={selected ? selected.name : 'Selecione uma zona'}>
          {selected ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border" style={{ background: `${selected.color}10`, borderColor: `${selected.color}40` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: selected.color }} />
                  <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{selected.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p style={{ color: 'var(--text-muted)' }}>Lixeiras</p>
                    <p className="font-bold font-mono" style={{ color: 'var(--text)' }}>{selected.total_bins}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)' }}>Nível médio</p>
                    <p className="font-bold font-mono" style={{ color: selected.color }}>{selected.avg_level}%</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)' }}>Coletas/mês</p>
                    <p className="font-bold font-mono" style={{ color: 'var(--text)' }}>{selected.collections_month}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)' }}>Cheias</p>
                    <p className="font-bold font-mono" style={{ color: selected.full_bins > 0 ? '#f87171' : 'var(--accent)' }}>
                      {selected.full_bins}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão filtrar no mapa */}
              <button
                onClick={() => setMapCenter(selected.center)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                style={{ background: `${selected.color}10`, color: selected.color, borderColor: `${selected.color}30` }}
              >
                <Filter className="w-3.5 h-3.5" />
                Centralizar no Mapa
              </button>

              {/* Botão gerar rota */}
              <button
                onClick={() => alert(`Gerando rota otimizada para ${selected.name}...\n\n${selected.total_bins} lixeiras incluídas.\nPrioridade: ${selected.full_bins} cheias.`)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                style={{ background: 'rgba(74,222,128,0.1)', color: 'var(--accent)', borderColor: 'rgba(74,222,128,0.3)' }}
              >
                <Route className="w-3.5 h-3.5" />
                Gerar Rota Otimizada
              </button>

              {/* Botão exportar */}
              <button
                onClick={() => exportZoneReport(selected)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
              >
                <FileText className="w-3.5 h-3.5" />
                Exportar Relatório PDF
              </button>

              {/* Lixeiras críticas da zona */}
              {selected.critical_bins.length > 0 && (
                <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-[10px] font-mono uppercase tracking-wider mb-2"
                    style={{ color: 'var(--text-muted)' }}>
                    Lixeiras críticas
                  </p>
                  {selected.critical_bins.map(b => (
                    <div key={b} className="flex items-center gap-2 py-1.5 border-b last:border-0"
                      style={{ borderColor: 'var(--border)' }}>
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: '#f87171' }} />
                      <span className="text-xs" style={{ color: 'var(--text)' }}>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <MapPin className="w-8 h-8" style={{ color: 'var(--border)' }} />
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                Clique em um card ou no mapa para ver as ações disponíveis
              </p>
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}