import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header  from './Header';

const PAGES: Record<string, { title: string; subtitle: string }> = {
  '/':           { title: 'Dashboard',        subtitle: 'Visão geral da cidade — Administração Pública' },
  '/bins':       { title: 'Lixeiras',         subtitle: 'Monitoramento por nível de ocupação'           },
  '/trucks':     { title: 'Frota',            subtitle: 'Caminhões e motoristas em operação'            },
  '/routes':     { title: 'Rotas',            subtitle: 'Rotas de coleta do dia'                        },
  '/analytics':  { title: 'Analytics',        subtitle: 'Indicadores de performance e eficiência'       },
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const meta = PAGES[pathname] ?? { title: 'EcoTrack-IA', subtitle: '' };

  return (
    <div className="flex min-h-screen" style={{ background: '#08130D', color: '#fff' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
