export default function Analytics() {
  return (
    <section
      className="rounded-[28px] border p-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xl font-bold">Analytics globais</h3>
      <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
        Aqui entrarão gráficos consolidados de operação, adoção, receita e expansão da plataforma.
      </p>
    </section>
  )
}
