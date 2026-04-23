import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { companyClients } from '../services/mockData'
import type { CompanyClient } from '../types'

function statusVariant(status: CompanyClient['status']): 'success' | 'warning' | 'danger' | 'neutral' | 'info' {
  if (status === 'Ativo') return 'success'
  if (status === 'Onboarding') return 'info'
  if (status === 'Atenção') return 'warning'
  if (status === 'Inativo') return 'danger'
  return 'neutral'
}

function deploymentVariant(status: CompanyClient['deploymentStatus']): 'success' | 'warning' | 'danger' {
  if (status === 'Online') return 'success'
  if (status === 'Degradado') return 'warning'
  return 'danger'
}

export default function Clients() {
  return (
    <Card
      title="Base de clientes"
      description="Prefeituras e operadores privados atendidos pela EcoTrack."
    >
      <Table
        data={companyClients}
        columns={[
          {
            key: 'client',
            header: 'Cliente',
            render: (client) => (
              <div>
                <p className="font-semibold">{client.name}</p>
                <p style={{ color: 'var(--text-muted)' }}>
                  {client.city}/{client.state}
                </p>
              </div>
            ),
          },
          {
            key: 'type',
            header: 'Tipo',
            render: (client) => client.type,
          },
          {
            key: 'plan',
            header: 'Plano',
            render: (client) => client.plan,
          },
          {
            key: 'status',
            header: 'Status',
            render: (client) => <Badge variant={statusVariant(client.status)}>{client.status}</Badge>,
          },
          {
            key: 'deployment',
            header: 'Deployment',
            render: (client) => (
              <Badge variant={deploymentVariant(client.deploymentStatus)}>
                {client.deploymentStatus}
              </Badge>
            ),
          },
          {
            key: 'revenue',
            header: 'MRR',
            render: (client) =>
              client.monthlyRevenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }),
          },
          {
            key: 'action',
            header: 'Ação',
            render: (client) => (
              <Link to={`/clients/${client.slug}`} style={{ color: 'var(--accent)' }}>
                Ver detalhes
              </Link>
            ),
          },
        ]}
      />
    </Card>
  )
}
