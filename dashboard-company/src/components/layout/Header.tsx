type HeaderProps = {
  title: string
  subtitle: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="border-b px-6 py-5 md:px-8"
      style={{ background: 'rgba(255,255,255,0.72)', borderColor: 'var(--border)' }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            Plataforma Corporativa
          </p>
          <h2 className="mt-2 text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        </div>

        <div
          className="rounded-2xl border px-4 py-3 text-right"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Ambiente
          </p>
          <p className="mt-1 text-sm font-semibold">Operação Interna EcoTrack</p>
        </div>
      </div>
    </header>
  )
}
