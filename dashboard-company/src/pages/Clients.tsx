import { Link } from 'react-router-dom'

const clients = [
  { id: 'sp-prefeitura', name: 'Prefeitura de São Paulo', type: 'Prefeitura', status: 'Ativo' },
  { id: 'campinas-prefeitura', name: 'Prefeitura de Campinas', type: 'Prefeitura', status: 'Ativo' },
  { id: 'coleta-verde', name: 'Coleta Verde Ambiental', type: 'Empresa de coleta', status: 'Onboarding' },
]

export default function Clients() {
  return (
    <section
      className="rounded-[28px] border p-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xl font-bold">Base de clientes</h3>
      <div className="mt-6 overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full border-collapse text-left">
          <thead style={{ background: 'var(--surface-alt)' }}>
            <tr>
              <th className="px-4 py-3 text-sm">Cliente</th>
              <th className="px-4 py-3 text-sm">Tipo</th>
              <th className="px-4 py-3 text-sm">Status</th>
              <th className="px-4 py-3 text-sm">Ação</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                <td className="px-4 py-4 text-sm font-medium">{client.name}</td>
                <td className="px-4 py-4 text-sm">{client.type}</td>
                <td className="px-4 py-4 text-sm">{client.status}</td>
                <td className="px-4 py-4 text-sm">
                  <Link to={`/clients/${client.id}`} style={{ color: 'var(--accent)' }}>
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
