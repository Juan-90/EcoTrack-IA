import type { ReactNode } from 'react'

type CardProps = {
  title?: string
  description?: string
  children: ReactNode
  rightSlot?: ReactNode
}

export default function Card({ title, description, children, rightSlot }: CardProps) {
  return (
    <section
      className="rounded-[28px] border p-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {(title || description || rightSlot) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-xl font-bold">{title}</h3>}
            {description && (
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                {description}
              </p>
            )}
          </div>

          {rightSlot}
        </div>
      )}

      {children}
    </section>
  )
}
