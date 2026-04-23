const cards = [
  { label: 'Clientes ativos', value: '24' },
  { label: 'Deployments saudáveis', value: '21' },
  { label: 'MRR consolidado', value: 'R$ 148.000' },
  { label: 'Alertas críticos', value: '3' },
]

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[24px] border p-5"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div
        className="rounded-[28px] border p-6"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <h3 className="text-xl font-bold">Visão geral</h3>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          Na próxima parte vamos preencher esta tela com métricas globais, alertas e distribuição de tenants.
        </p>
      </div>
    </section>
  )
}
