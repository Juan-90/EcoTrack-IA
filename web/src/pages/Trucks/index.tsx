// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Trucks Page
// ─────────────────────────────────────────────────────────
import { FillBar, StatusBadge, Card, LoadingSpinner } from '../../components/ui';
import { TRUCK_STATUS_COLOR, TRUCK_STATUS_LABEL, formatKg } from '../../utils/helpers';
import { useTrucks, useTodayRoutes } from '../../hooks/useEcoTrack';

export default function Trucks() {
  const { data: trucks, isLoading } = useTrucks();
  const { data: routes }            = useTodayRoutes();

  if (isLoading) return <LoadingSpinner message="Carregando frota..." />;

  const getRoute = (id: number | null) => routes?.find(r => r.id === id);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['em_rota','retornando','aguardando','manutencao'] as const).map(s => (
          <div key={s} className="rounded-xl p-4 border" style={{ background: '#1b4332', borderColor: '#2d6a4f' }}>
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: '#9ca3af' }}>{TRUCK_STATUS_LABEL[s]}</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {trucks?.filter(t => t.status === s).length ?? 0}
            </p>
          </div>
        ))}
      </div>

      <Card title="Frota Completa" noPad>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: '#2d6a4f' }}>
                {['Placa','Motorista','Rota Atual','Carga','Capacidade','Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest" style={{ color: '#9ca3af' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trucks?.map(truck => {
                const route = getRoute(truck.current_route_id);
                const pct   = truck.capacity_kg > 0 ? Math.round((truck.current_load_kg / truck.capacity_kg) * 100) : 0;
                return (
                  <tr key={truck.id} className="border-b" style={{ borderColor: 'rgba(45,106,79,0.3)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(27,67,50,0.5)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-4 py-3 font-mono text-green-400 text-xs">{truck.plate}</td>
                    <td className="px-4 py-3 text-white text-xs">{truck.driver}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: '#9ca3af' }}>
                      {route ? `Rota #${route.id}` : '—'}
                    </td>
                    <td className="px-4 py-3 w-32">
                      {truck.current_load_kg > 0 ? <FillBar level={pct} /> : <span className="text-xs" style={{ color: '#9ca3af' }}>—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: '#9ca3af' }}>{formatKg(truck.capacity_kg)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={TRUCK_STATUS_LABEL[truck.status]} className={TRUCK_STATUS_COLOR[truck.status]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
