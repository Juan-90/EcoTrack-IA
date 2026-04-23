import type { ReactNode } from 'react'

type Column<T> = {
  key: string
  header: string
  className?: string
  render: (item: T) => ReactNode
}

type TableProps<T> = {
  data: T[]
  columns: Column<T>[]
  emptyMessage?: string
}

export default function Table<T>({ data, columns, emptyMessage = 'Nenhum registro encontrado.' }: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
      <table className="w-full border-collapse text-left">
        <thead style={{ background: 'var(--surface-alt)' }}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`px-4 py-3 text-sm font-semibold ${column.className ?? ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className="border-t" style={{ borderColor: 'var(--border)' }}>
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-4 text-sm ${column.className ?? ''}`}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
