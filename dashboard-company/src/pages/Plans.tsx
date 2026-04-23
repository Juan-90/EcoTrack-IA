export default function Plans() {
  return (
    <section
      className="rounded-[28px] border p-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xl font-bold">Planos e licenças</h3>
      <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
        Esta seção concentrará catálogo comercial, contratos ativos, vencimentos e limites por tenant.
      </p>
    </section>
  )
}
