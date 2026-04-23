export default function Settings() {
  return (
    <section
      className="rounded-[28px] border p-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xl font-bold">Configurações internas</h3>
      <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
        Aqui vamos organizar usuários internos, permissões, integrações e preferências da operação EcoTrack.
      </p>
    </section>
  )
}
