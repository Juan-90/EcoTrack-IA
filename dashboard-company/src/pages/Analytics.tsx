import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../components/ui/Card'
import { companyApi } from '../services/api'

export default function Analytics() {
  const { data: trend = [] } = useQuery({
    queryKey: ['company-analytics'],
    queryFn: companyApi.getTrend,
  })

  return (
    <section className="space-y-6">
      <Card
        title="Receita recorrente"
        description="Evolução consolidada de MRR por período."
      >
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="4 4" stroke="#d7e4da" />
              <XAxis dataKey="label" stroke="#5f7465" />
              <YAxis stroke="#5f7465" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#1f8f5f" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        title="Leitura estratégica"
        description="A próxima fase pode incluir churn, expansão, adoção por tenant e tickets de suporte."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Expansão da base</p>
            <p className="mt-2 text-2xl font-bold">+100%</p>
          </div>
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Crescimento de receita</p>
            <p className="mt-2 text-2xl font-bold">+94,7%</p>
          </div>
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Saúde média</p>
            <p className="mt-2 text-2xl font-bold">Alta</p>
          </div>
        </div>
      </Card>
    </section>
  )
}
