import { useQuery } from '@tanstack/react-query'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { companyApi } from '../services/api'
import type { InternalUser, PermissionProfile } from '../types'
import { formatDate } from '../utils/format'

function userStatusVariant(status: InternalUser['status']): 'success' | 'warning' | 'danger' {
  if (status === 'Ativo') return 'success'
  if (status === 'Convidado') return 'warning'
  return 'danger'
}

export default function Settings() {
  const { data: users = [] } = useQuery({
    queryKey: ['company-internal-users'],
    queryFn: companyApi.getInternalUsers,
  })

  const { data: profiles = [] } = useQuery({
    queryKey: ['company-permission-profiles'],
    queryFn: companyApi.getPermissionProfiles,
  })

  const { data: cards = [] } = useQuery({
    queryKey: ['company-operational-cards'],
    queryFn: companyApi.getOperationalCards,
  })

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} title={card.label}>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              {card.detail}
            </p>
          </Card>
        ))}
      </div>

      <Card
        title="Usuarios internos"
        description="Equipe interna com acesso ao painel corporativo."
      >
        <Table<InternalUser>
          data={users}
          columns={[
            {
              key: 'name',
              header: 'Nome',
              render: (user) => (
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p style={{ color: 'var(--text-muted)' }}>{user.scope}</p>
                </div>
              ),
            },
            { key: 'role', header: 'Funcao', render: (user) => user.role },
            { key: 'email', header: 'Email', render: (user) => user.email },
            {
              key: 'status',
              header: 'Status',
              render: (user) => (
                <Badge variant={userStatusVariant(user.status)}>{user.status}</Badge>
              ),
            },
            {
              key: 'lastAccessAt',
              header: 'Ultimo acesso',
              render: (user) => formatDate(user.lastAccessAt),
            },
          ]}
        />
      </Card>

      <Card
        title="Perfis e permissoes"
        description="Mock inicial para governanca interna da EcoTrack."
      >
        <Table<PermissionProfile>
          data={profiles}
          columns={[
            { key: 'name', header: 'Perfil', render: (profile) => <strong>{profile.name}</strong> },
            { key: 'description', header: 'Descricao', render: (profile) => profile.description },
            { key: 'members', header: 'Membros', render: (profile) => profile.members },
            {
              key: 'capabilities',
              header: 'Permissoes',
              render: (profile) => (
                <div className="flex flex-wrap gap-2">
                  {profile.capabilities.map((capability) => (
                    <Badge key={capability} variant="info">
                      {capability}
                    </Badge>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Integracoes prioritarias">
          <p style={{ color: 'var(--text-muted)' }}>
            Evolucao sugerida: billing, observabilidade, mensageria, CRM e autenticacao corporativa.
          </p>
        </Card>

        <Card title="Governanca operacional">
          <p style={{ color: 'var(--text-muted)' }}>
            Evolucao sugerida: trilha de auditoria, grupos de acesso por squad e playbooks por incidente.
          </p>
        </Card>
      </div>
    </section>
  )
}
