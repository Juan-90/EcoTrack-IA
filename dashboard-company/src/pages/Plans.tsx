import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'

const plans = [
  {
    name: 'Basic',
    target: 'Operações menores',
    monthlyValue: 'R$ 6.000',
    sensors: 'Até 120 sensores',
    support: 'Horário comercial',
    status: 'Disponível',
  },
  {
    name: 'Pro',
    target: 'Prefeituras médias e operadores privados',
    monthlyValue: 'R$ 14.000 a R$ 18.000',
    sensors: 'Até 600 sensores',
    support: 'Prioritário',
    status: 'Mais vendido',
  },
  {
    name: 'Enterprise',
    target: 'Grandes cidades e contratos estratégicos',
    monthlyValue: 'Sob proposta',
    sensors: 'Escala personalizada',
    support: 'Dedicado',
    status: 'Estratégico',
  },
]

export default function Plans() {
  return (
    <section className="space-y-6">
      <Card
        title="Catálogo de planos"
        description="Estrutura comercial atual para contratos da EcoTrack."
      >
        <Table
          data={plans}
          columns={[
            { key: 'name', header: 'Plano', render: (plan) => <strong>{plan.name}</strong> },
            { key: 'target', header: 'Perfil', render: (plan) => plan.target },
            { key: 'value', header: 'Valor mensal', render: (plan) => plan.monthlyValue },
            { key: 'sensors', header: 'Limite', render: (plan) => plan.sensors },
            { key: 'support', header: 'Suporte', render: (plan) => plan.support },
            {
              key: 'status',
              header: 'Status',
              render: (plan) => (
                <Badge variant={plan.status === 'Mais vendido' ? 'success' : 'info'}>
                  {plan.status}
                </Badge>
              ),
            },
          ]}
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Basic">
          <p style={{ color: 'var(--text-muted)' }}>
            Entrada para contas menores com operação enxuta e onboarding acelerado.
          </p>
        </Card>

        <Card title="Pro">
          <p style={{ color: 'var(--text-muted)' }}>
            Equilíbrio entre escala operacional, analytics e suporte prioritário.
          </p>
        </Card>

        <Card title="Enterprise">
          <p style={{ color: 'var(--text-muted)' }}>
            Camada premium com governança, observabilidade e negociação personalizada.
          </p>
        </Card>
      </div>
    </section>
  )
}
