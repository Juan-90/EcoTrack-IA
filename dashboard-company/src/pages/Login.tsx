export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div
        className="w-full max-w-md rounded-[28px] border p-8"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
          EcoTrack Company
        </p>

        <h1 className="mt-3 text-3xl font-bold">Acesso corporativo</h1>

        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Painel interno para gestão de clientes, contratos, licenças e deployments.
        </p>

        <div className="mt-8 space-y-4">
          <input
            className="w-full rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
            placeholder="seu-email@ecotrack.com"
          />
          <input
            type="password"
            className="w-full rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
            placeholder="Senha"
          />
          <button
            className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}
