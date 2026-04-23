import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { companyApi } from '../services/api'
import { formatCurrency, formatDate, formatPercent } from '../utils/format'

function deploymentVariant(status: 'Online' | 'Degradado' | 'Offline'): 'success' | 'warning' | 'danger' {
  if (status === 'Online') return 'success'
  if (status === 'Degradado') return 'warning'
  return 'danger'
}

export default function ClientDetail() {
  const { clientId = '' } = useParams()

  const { data: client, isLoading } = useQuery({
    queryKey: ['company-client', clientId],
    queryFn: () => companyApi.getClientBySlug(clientId),
  })

  if (isLoading) {
    return (
      <Card title="Carregando cliente">
        <p style={{ color: 'var(--text-muted)' }}>Buscando dados da conta...</p>
      </Card>
    )
  }

  if (!client) {
    return (
      <Card title="Cliente não encontrado">
        <p style={{ color: 'var(--text-muted)' }}>
          Não foi possível localizar o tenant solicitado.
        </p>
      </Card>
    )
  }

  return (
    <section className="space-y-6">
      <Card
        title={client.name}
        description={`${client.city}/${client.state} · ${client.type}`}
        rightSlot={<Badge variant={deploymentVariant(client.deploymentStatus)}>{client.deploymentStatus}</Badge>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Plano</p>
            <p className="mt-2 text-xl font-bold">{client.plan}</p>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>MRR</p>
            <p className="mt-2 text-xl font-bold">{formatCurrency(client.monthlyRevenue)}</p>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Usuários ativos</p>
            <p className="mt-2 text-xl font-bold">{client.activeUsers}</p>
          </div>

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Lixeiras monitoradas</p>
            <p className="mt-2 text-xl font-bold">{client.monitoredBins}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Saúde operacional" description="Indicadores essenciais do tenant.">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Eficiência de coleta</span>
              <strong>{formatPercent(client.collectionEfficiency)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Uso de licenças</span>
              <strong>{formatPercent(client.licenseUsage)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Versão implantada</span>
              <strong>{client.version}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Uptime</span>
              <strong>{client.uptime}</strong>
            </div>
          </div>
        </Card>

        <Card title="Gestão comercial" description="Visão da conta e relacionamento.">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Status da conta</span>
              <strong>{client.status}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Ativação</span>
              <strong>{formatDate(client.activatedAt)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Fim do contrato</span>
              <strong>{formatDate(client.contractEndsAt)}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
              <span>Responsável interno</span>
              <strong>{client.internalOwner}</strong>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
