// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Rotas
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import { Card, StatusBadge, LoadingSpinner } from '../../components/ui';
import { useTodayRoutes, useBins, useTrucks } from '../../hooks/useEcoTrack';
import { formatDate, PRIORITY_EMOJI } from '../../utils/helpers';
import type { Route } from '../../types';

const ROUTE_STATUS_STYLE = {
  ativa:     'text-green-400 bg-green-400/10',
  planejada: 'text-yellow-400 bg-yellow-400/10',
  concluida: 'text-gray-400 bg-gray-400/10',
};
const ROUTE_STATUS_LABEL = { ativa: 'Ativa', planejada: 'Planejada', concluida: 'Concluída' };

export default function Routes() {
  const { data: routes,  isLoading } = useTodayRoutes();
  const { data: bins }               = useBins();
  const { data: trucks }             = useTrucks();
  const [selected, setSelected]      = useState<Route | null>(null);

  if (isLoading) return <LoadingSpinner message="Carregando rotas..." />;

  const active = selected ?? routes?.[0] ?? null;
  const truck  = trucks?.find(t => t.id === active?.truck_id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="space-y-4">
        <Card title="Rotas de Hoje" badge={`${routes?.length ?? 0} rotas`}>
          <div className="space-y-2">
            {routes?.map(route => (
              <button key={route.id} onClick={() => setSelected(route)}
                className="w-full text-left p-3 rounded-lg border transition-all"
                style={active?.id === route.id
                  ? { background: 'rgba(74,222,128,0.05)', borderColor: 'rgba(74,222,128,0.3)' }
                  : { background: '#1b4332', borderColor: '#2d6a4f' }
                }
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-white">Rota #{route.id}</span>
                  <StatusBadge label={ROUTE_STATUS_LABEL[route.status]} className={ROUTE_STATUS_STYLE[route.status]} />
                </div>
                <p className="text-[10px] font-mono" style={{ color: '#9ca3af' }}>{route.stops.length} paradas</p>
                {route.total_distance_km && (
                  <p className="text-[10px] font-mono" style={{ color: '#4ade80', opacity: 0.7 }}>{route.total_distance_km} km</p>
                )}
              </button>
            ))}
            {!routes?.length && <p className="text-xs font-mono text-center py-6" style={{ color: '#9ca3af' }}>Nenhuma rota hoje</p>}
          </div>
        </Card>

        {active && (
          <Card title="Detalhes" badge={`Rota #${active.id}`}>
            <div className="space-y-3 text-xs">
              {truck && (
                <div className="p-2.5 rounded-lg" style={{ background: '#1b4332' }}>
                  <p className="font-mono mb-1" style={{ color: '#4ade80', opacity: 0.7 }}>CAMINHÃO</p>
                  <p className="text-white">{truck.plate} — {truck.driver}</p>
                </div>
              )}
              <div className="p-2.5 rounded-lg" style={{ background: '#1b4332' }}>
                <p className="font-mono mb-1" style={{ color: '#4ade80', opacity: 0.7 }}>INÍCIO</p>
                <p className="text-white font-mono">{formatDate(active.start_time)}</p>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {active.stops.sort((a,b) => a.order - b.order).map(stop => {
                  const bin = bins?.find(b => b.id === stop.bin_id);
                  return (
                    <div key={stop.bin_id} className="flex items-center gap-2 p-2 rounded text-[10px] font-mono" style={{ background: 'rgba(27,67,50,0.5)' }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: '#2d6a4f' }}>{stop.order}</span>
                      {bin && <span>{PRIORITY_EMOJI[bin.priority]}</span>}
                      <span className="text-white">{bin?.name ?? `Bin #${stop.bin_id}`}</span>
                      {stop.collected_at && <span className="ml-auto text-green-400">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Painel visual da rota */}
      <div className="lg:col-span-2">
        <Card title="Visualização da Rota" badge={active ? `Rota #${active.id} — ${active.stops.length} paradas` : 'Selecione uma rota'}>
          <div className="rounded-lg flex items-center justify-center border" style={{ height: '500px', background: '#08130D', borderColor: '#2d6a4f' }}>
            <div className="text-center space-y-3">
              <p className="text-4xl">🗺️</p>
              <p className="text-sm font-mono" style={{ color: '#4ade80' }}>Mapa Leaflet</p>
              <p className="text-xs font-mono" style={{ color: '#9ca3af' }}>
                Instalar: npm install react-leaflet leaflet<br />
                Ver: src/components/map/CityMap.tsx
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
