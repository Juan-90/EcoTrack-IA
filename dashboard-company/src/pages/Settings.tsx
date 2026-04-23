import Card from '../components/ui/Card'
import Table from '../components/ui/Table'

const internalUsers = [
  { name: 'Juan Andrade', role: 'Founder Admin', email: 'juan@ecotrack.com', status: 'Ativo' },
  { name: 'Caio Mattos', role: 'Backend Lead', email: 'caio@ecotrack.com', status: 'Ativo' },
  { name: 'Mauricio Ferreira', role: 'IoT Operations', email: 'mauricio@ecotrack.com', status: 'Ativo' },
  { name: 'Nelson Sousa', role: 'QA / Supervisão', email: 'nelson@ecotrack.com', status: 'Convidado' },
]

export default function Settings() {
  return (
    <section className="space-y-6">
      <Card
        title="Usuários internos"
        description="Equipe interna com acesso ao painel corporativo."
      >
        <Table
          data={internalUsers}
          columns={[
            { key: 'name', header: 'Nome', render: (user) => user.name },
            { key: 'role', header: 'Função', render: (user) => user.role },
            { key: 'email', header: 'Email', render: (user) => user.email },
            { key: 'status', header: 'Status', render: (user) => user.status },
          ]}
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Integrações">
          <p style={{ color: 'var(--text-muted)' }}>
            Futuramente: billing, observabilidade, mensageria, CRM e autenticação corporativa.
          </p>
        </Card>

        <Card title="Governança">
          <p style={{ color: 'var(--text-muted)' }}>
            Futuramente: perfis de acesso, trilha de auditoria e políticas multi-tenant.
          </p>
        </Card>
      </div>
    </section>
  )
}
