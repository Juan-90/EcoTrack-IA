export default function Deployments() {
  return (
    <section
      className="rounded-[28px] border p-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xl font-bold">Monitoramento de deployments</h3>
      <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
        Esta área exibirá disponibilidade, uptime, versão e incidentes por cliente.
      </p>
    </section>
  )
}
