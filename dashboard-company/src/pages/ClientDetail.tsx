import { useParams } from 'react-router-dom'

export default function ClientDetail() {
  const { clientId } = useParams()

  return (
    <section
      className="rounded-[28px] border p-6"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xl font-bold">Detalhes do cliente</h3>
      <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
        Cliente selecionado: <span className="font-semibold">{clientId}</span>
      </p>
      <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
        Na próxima parte vamos montar KPIs, contrato, licenças, usuários e saúde operacional por tenant.
      </p>
    </section>
  )
}
