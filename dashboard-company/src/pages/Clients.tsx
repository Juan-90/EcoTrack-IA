import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { companyApi } from '../services/api'
import type { CompanyClient } from '../types'
import { formatCurrency } from '../utils/format'

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
  const { data: clients = [] } = useQuery({
    queryKey: ['company-clients'],
    queryFn: companyApi.getClients,
  })

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Todos' | CompanyClient['status']>('Todos')
  const [planFilter, setPlanFilter] = useState<'Todos' | CompanyClient['plan']>('Todos')
  const [typeFilter, setTypeFilter] = useState<'Todos' | CompanyClient['type']>('Todos')

  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return clients.filter((client) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        client.name.toLowerCase().includes(normalizedSearch) ||
        client.city.toLowerCase().includes(normalizedSearch) ||
        client.state.toLowerCase().includes(normalizedSearch) ||
        client.internalOwner.toLowerCase().includes(normalizedSearch)

      const matchesStatus = statusFilter === 'Todos' || client.status === statusFilter
      const matchesPlan = planFilter === 'Todos' || client.plan === planFilter
      const matchesType = typeFilter === 'Todos' || client.type === typeFilter

      return matchesSearch && matchesStatus && matchesPlan && matchesType
    })
  }, [clients, planFilter, search, statusFilter, typeFilter])

  const summary = useMemo(() => {
    const totalMrr = filteredClients.reduce((acc, client) => acc + client.monthlyRevenue, 0)
    const activeClients = filteredClients.filter((client) => client.status === 'Ativo').length
    const attentionClients = filteredClients.filter((client) => client.status === 'Atenção').length
    const onlineDeployments = filteredClients.filter((client) => client.deploymentStatus === 'Online').length

    return {
      totalMrr,
      activeClients,
      attentionClients,
      onlineDeployments,
    }
  }, [filteredClients])

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Clientes filtrados">
          <p className="text-3xl font-bold">{filteredClients.length}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Base visivel apos filtros
          </p>
        </Card>

        <Card title="Clientes ativos">
          <p className="text-3xl font-bold">{summary.activeClients}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Operacao estavel na carteira
          </p>
        </Card>

        <Card title="Contas em atencao">
          <p className="text-3xl font-bold">{summary.attentionClients}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Exigem acao do time interno
          </p>
        </Card>

        <Card title="MRR da selecao">
          <p className="text-3xl font-bold">{formatCurrency(summary.totalMrr)}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Deployments online: {summary.onlineDeployments}
          </p>
        </Card>
      </div>

      <Card
        title="Base de clientes"
        description="Prefeituras e operadores privados atendidos pela EcoTrack."
      >
        <div className="mb-6 grid gap-4 lg:grid-cols-[2fr,1fr,1fr,1fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
            placeholder="Buscar por cliente, cidade ou responsavel interno"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'Todos' | CompanyClient['status'])}
            className="rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
          >
            <option value="Todos">Todos os status</option>
            <option value="Ativo">Ativo</option>
            <option value="Atenção">Atencao</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Inativo">Inativo</option>
          </select>

          <select
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value as 'Todos' | CompanyClient['plan'])}
            className="rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
          >
            <option value="Todos">Todos os planos</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as 'Todos' | CompanyClient['type'])}
            className="rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
          >
            <option value="Todos">Todos os tipos</option>
            <option value="Prefeitura">Prefeitura</option>
            <option value="Empresa de coleta">Empresa de coleta</option>
          </select>
        </div>

        <Table<CompanyClient>
          data={filteredClients}
          emptyMessage="Nenhum cliente corresponde aos filtros aplicados."
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
              render: (client) => formatCurrency(client.monthlyRevenue),
            },
            {
              key: 'action',
              header: 'Acao',
              render: (client) => (
                <Link to={`/clients/${client.slug}`} style={{ color: 'var(--accent)' }}>
                  Ver detalhes
                </Link>
              ),
            },
          ]}
        />
      </Card>
    </section>
  )
}
