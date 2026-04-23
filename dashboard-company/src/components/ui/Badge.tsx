type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

type BadgeProps = {
  children: React.ReactNode
  variant?: BadgeVariant
}

const styles: Record<BadgeVariant, { background: string; color: string; borderColor: string }> = {
  success: {
    background: 'rgba(31, 143, 95, 0.10)',
    color: '#176947',
    borderColor: 'rgba(31, 143, 95, 0.22)',
  },
  warning: {
    background: 'rgba(212, 160, 23, 0.12)',
    color: '#9a7410',
    borderColor: 'rgba(212, 160, 23, 0.24)',
  },
  danger: {
    background: 'rgba(200, 75, 49, 0.12)',
    color: '#a33b27',
    borderColor: 'rgba(200, 75, 49, 0.24)',
  },
  neutral: {
    background: 'rgba(95, 116, 101, 0.10)',
    color: '#516457',
    borderColor: 'rgba(95, 116, 101, 0.20)',
  },
  info: {
    background: 'rgba(38, 99, 235, 0.10)',
    color: '#1d4ed8',
    borderColor: 'rgba(38, 99, 235, 0.22)',
  },
}

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  const style = styles[variant]

  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
      style={style}
    >
      {children}
    </span>
  )
}
