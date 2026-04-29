import { useAuthStore } from '../../store/authStore'

type HeaderProps = {
  title: string
  subtitle: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuthStore()

  const roleLabel = user?.role === 'founder_admin'
    ? 'Founder Admin'
    : user?.role === 'operations_manager'
      ? 'Operations Manager'
      : 'Support Analyst'

  return (
    <header
      className="border-b px-6 py-5 md:px-8"
      style={{ background: 'rgba(255,255,255,0.72)', borderColor: 'var(--border)' }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="pl-14 lg:pl-0">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
            Plataforma Corporativa
          </p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        </div>

        <div
          className="rounded-2xl border px-4 py-3 text-left lg:text-right"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
            Sessao
          </p>
          <p className="mt-1 text-sm font-semibold">{user?.name ?? 'Equipe EcoTrack'}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {roleLabel}
          </p>
        </div>
      </div>
    </header>
  )
}
