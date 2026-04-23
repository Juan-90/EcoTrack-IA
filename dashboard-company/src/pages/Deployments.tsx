import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { companyClients } from '../services/mockData'

function deploymentVariant(status: 'Online' | 'Degradado' | 'Offline'): 'success' | 'warning' | 'danger' {
  if (status === 'Online') return 'success'
  if (status === 'Degradado') return 'warning'
  return 'danger'
}

export default function Deployments() {
  return (
    <Card
      title="Monitoramento de deployments"
      description="Status consolidado das instâncias ativas por cliente."
    >
      <Table
        data={companyClients}
        columns={[
          { key: 'client', header: 'Cliente', render: (client) => client.name },
          {
            key: 'status',
            header: 'Status',
            render: (client) => (
              <Badge variant={deploymentVariant(client.deploymentStatus)}>
                {client.deploymentStatus}
              </Badge>
            ),
          },
          { key: 'version', header: 'Versão', render: (client) => client.version },
          { key: 'uptime', header: 'Uptime', render: (client) => client.uptime },
          { key: 'owner', header: 'Responsável', render: (client) => client.internalOwner },
        ]}
      />
    </Card>
  )
}
