// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Rotas
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import { Card, StatusBadge, LoadingSpinner } from '../../components/ui';
import CityMap from '../../components/map/CityMap';
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

  const active     = selected ?? routes?.[0] ?? null;
  const routeTruck = trucks?.find(t => t.id === active?.truck_id);

  // Filtra só as lixeiras da rota selecionada
  const routeBins = active
    ? bins?.filter(b => active.stops.some(s => s.bin_id === b.id)) ?? []
    : bins ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* ── Lista de rotas + Detalhes ── */}
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
                <p className="text-[10px] font-mono" style={{ color: '#9ca3af' }}>
                  {route.stops.length} paradas
                </p>
                {route.total_distance_km && (
                  <p className="text-[10px] font-mono" style={{ color: '#4ade80', opacity: 0.7 }}>
                    {route.total_distance_km} km
                  </p>
                )}
              </button>
            ))}
            {!routes?.length && (
              <p className="text-xs font-mono text-center py-6" style={{ color: '#9ca3af' }}>
                Nenhuma rota hoje
              </p>
            )}
          </div>
        </Card>

        {/* Detalhes da rota selecionada */}
        {active && (
          <Card title="Detalhes" badge={`Rota #${active.id}`}>
            <div className="space-y-3 text-xs">
              {routeTruck && (
                <div className="p-2.5 rounded-lg" style={{ background: '#1b4332' }}>
                  <p className="font-mono mb-1" style={{ color: '#4ade80', opacity: 0.7 }}>CAMINHÃO</p>
                  <p className="text-white">{routeTruck.plate} — {routeTruck.driver}</p>
                </div>
              )}
              <div className="p-2.5 rounded-lg" style={{ background: '#1b4332' }}>
                <p className="font-mono mb-1" style={{ color: '#4ade80', opacity: 0.7 }}>INÍCIO</p>
                <p className="text-white font-mono">{formatDate(active.start_time)}</p>
              </div>

              {/* Lista de paradas ordenadas */}
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {active.stops
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map(stop => {
                    const bin = bins?.find(b => b.id === stop.bin_id);
                    return (
                      <div
                        key={stop.bin_id}
                        className="flex items-center gap-2 p-2 rounded text-[10px] font-mono"
                        style={{ background: 'rgba(27,67,50,0.5)' }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                          style={{ background: '#2d6a4f' }}
                        >
                          {stop.order}
                        </span>
                        {bin && <span>{PRIORITY_EMOJI[bin.priority]}</span>}
                        <span className="text-white truncate">
                          {bin?.name ?? `Bin #${stop.bin_id}`}
                        </span>
                        {stop.collected_at && (
                          <span className="ml-auto text-green-400 flex-shrink-0">✓</span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ── Mapa Leaflet ── */}
      <div className="lg:col-span-2">
        <Card
          title="Mapa da Rota"
          badge={active
            ? `Rota #${active.id} — ${active.stops.length} paradas`
            : 'Selecione uma rota'
          }
        >
          <CityMap
            bins={routeBins}
            trucks={routeTruck ? [routeTruck] : []}
            routes={active ? [active] : []}
            height="560px"
          />
        </Card>
      </div>

    </div>
  );
}