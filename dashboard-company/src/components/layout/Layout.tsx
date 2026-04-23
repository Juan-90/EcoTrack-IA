import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard Company',
    subtitle: 'Visão consolidada da operação EcoTrack.',
  },
  '/clients': {
    title: 'Clientes',
    subtitle: 'Gestão de prefeituras e empresas de coleta.',
  },
  '/deployments': {
    title: 'Deployments',
    subtitle: 'Saúde, versão e disponibilidade das instâncias.',
  },
  '/analytics': {
    title: 'Analytics',
    subtitle: 'Indicadores globais de adoção, operação e receita.',
  },
  '/plans': {
    title: 'Planos e Licenças',
    subtitle: 'Controle comercial e operacional dos contratos.',
  },
  '/settings': {
    title: 'Configurações',
    subtitle: 'Usuários internos, permissões e integrações.',
  },
}

export default function Layout() {
  const { pathname } = useLocation()

  const meta =
    pageMeta[pathname] ??
    (pathname.startsWith('/clients/')
      ? {
          title: 'Cliente',
          subtitle: 'Visão detalhada de um tenant da plataforma.',
        }
      : {
          title: 'EcoTrack Company',
          subtitle: 'Painel corporativo da plataforma.',
        })

  return (
    <div
      className="flex min-h-screen"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
