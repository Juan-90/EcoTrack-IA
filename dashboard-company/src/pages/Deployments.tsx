import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { companyApi } from '../services/api'
import type { CompanyDeployment, DeploymentStatus } from '../types'
import { formatDate } from '../utils/format'

type SortKey = 'clientName' | 'uptime' | 'latencyMs' | 'errorRate' | 'lastDeployAt'

function deploymentVariant(status: DeploymentStatus): 'success' | 'warning' | 'danger' {
  if (status === 'Online') return 'success'
  if (status === 'Degradado') return 'warning'
  return 'danger'
}

export default function Deployments() {
  const { data: deployments = [] } = useQuery({
    queryKey: ['company-deployments'],
    queryFn: companyApi.getDeployments,
  })

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Todos' | DeploymentStatus>('Todos')
  const [environmentFilter, setEnvironmentFilter] = useState<'Todos' | CompanyDeployment['environment']>('Todos')
  const [sortBy, setSortBy] = useState<SortKey>('uptime')

  const filteredDeployments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const result = deployments.filter((deployment) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        deployment.clientName.toLowerCase().includes(normalizedSearch) ||
        deployment.region.toLowerCase().includes(normalizedSearch) ||
        deployment.internalOwner.toLowerCase().includes(normalizedSearch)

      const matchesStatus = statusFilter === 'Todos' || deployment.status === statusFilter
      const matchesEnvironment = environmentFilter === 'Todos' || deployment.environment === environmentFilter

      return matchesSearch && matchesStatus && matchesEnvironment
    })

    result.sort((a, b) => {
      if (sortBy === 'clientName') return a.clientName.localeCompare(b.clientName)
      if (sortBy === 'uptime') return b.uptime - a.uptime
      if (sortBy === 'latencyMs') return a.latencyMs - b.latencyMs
      if (sortBy === 'errorRate') return a.errorRate - b.errorRate
      return new Date(b.lastDeployAt).getTime() - new Date(a.lastDeployAt).getTime()
    })

    return result
  }, [deployments, environmentFilter, search, sortBy, statusFilter])

  const summary = useMemo(() => {
    const online = filteredDeployments.filter((item) => item.status === 'Online').length
    const degraded = filteredDeployments.filter((item) => item.status === 'Degradado').length
    const avgLatency =
      filteredDeployments.length > 0
        ? Math.round(filteredDeployments.reduce((acc, item) => acc + item.latencyMs, 0) / filteredDeployments.length)
        : 0

    const avgUptime =
      filteredDeployments.length > 0
        ? (filteredDeployments.reduce((acc, item) => acc + item.uptime, 0) / filteredDeployments.length).toFixed(2)
        : '0.00'

    return {
      online,
      degraded,
      avgLatency,
      avgUptime,
    }
  }, [filteredDeployments])

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Deployments filtrados">
          <p className="text-3xl font-bold">{filteredDeployments.length}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Ambientes exibidos na visao atual
          </p>
        </Card>

        <Card title="Ambientes online">
          <p className="text-3xl font-bold">{summary.online}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Operando sem degradacao
          </p>
        </Card>

        <Card title="Ambientes degradados">
          <p className="text-3xl font-bold">{summary.degraded}</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Exigem acompanhamento do time
          </p>
        </Card>

        <Card title="Media operacional">
          <p className="text-3xl font-bold">{summary.avgUptime}%</p>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Latencia media: {summary.avgLatency} ms
          </p>
        </Card>
      </div>

      <Card
        title="Central de deployments"
        description="Monitore saude, latencia, versao e ultima implantacao por ambiente."
      >
        <div className="mb-6 grid gap-4 lg:grid-cols-[2fr,1fr,1fr,1fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
            placeholder="Buscar por cliente, regiao ou responsavel"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'Todos' | DeploymentStatus)}
            className="rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
          >
            <option value="Todos">Todos os status</option>
            <option value="Online">Online</option>
            <option value="Degradado">Degradado</option>
            <option value="Offline">Offline</option>
          </select>

          <select
            value={environmentFilter}
            onChange={(event) => setEnvironmentFilter(event.target.value as 'Todos' | CompanyDeployment['environment'])}
            className="rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
          >
            <option value="Todos">Todos os ambientes</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Pilot">Pilot</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortKey)}
            className="rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
          >
            <option value="uptime">Ordenar por uptime</option>
            <option value="latencyMs">Ordenar por latencia</option>
            <option value="errorRate">Ordenar por erro</option>
            <option value="lastDeployAt">Ordenar por ultimo deploy</option>
            <option value="clientName">Ordenar por cliente</option>
          </select>
        </div>

        <Table<CompanyDeployment>
          data={filteredDeployments}
          emptyMessage="Nenhum deployment corresponde aos filtros aplicados."
          columns={[
            {
              key: 'client',
              header: 'Cliente',
              render: (deployment) => (
                <div>
                  <p className="font-semibold">{deployment.clientName}</p>
                  <p style={{ color: 'var(--text-muted)' }}>{deployment.environment}</p>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (deployment) => (
                <Badge variant={deploymentVariant(deployment.status)}>
                  {deployment.status}
                </Badge>
              ),
            },
            {
              key: 'version',
              header: 'Versao',
              render: (deployment) => deployment.version,
            },
            {
              key: 'uptime',
              header: 'Uptime',
              render: (deployment) => `${deployment.uptime.toFixed(2)}%`,
            },
            {
              key: 'latency',
              header: 'Latencia',
              render: (deployment) => `${deployment.latencyMs} ms`,
            },
            {
              key: 'errorRate',
              header: 'Erro',
              render: (deployment) => `${deployment.errorRate.toFixed(2)}%`,
            },
            {
              key: 'deploy',
              header: 'Ultimo deploy',
              render: (deployment) => formatDate(deployment.lastDeployAt),
            },
            {
              key: 'owner',
              header: 'Responsavel',
              render: (deployment) => deployment.internalOwner,
            },
          ]}
        />
      </Card>
    </section>
  )
}
