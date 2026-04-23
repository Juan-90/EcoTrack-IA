import { BarChart3, Building2, CircleAlert, Wallet } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { companyApi } from '../services/api'
import type { CompanyAlert, CompanyKpi } from '../types'

const iconMap = [Building2, Wallet, BarChart3, CircleAlert]

function alertVariant(severity: string): 'danger' | 'warning' | 'neutral' {
  if (severity === 'Alta') return 'danger'
  if (severity === 'Média') return 'warning'
  return 'neutral'
}

export default function Dashboard() {
  const { data: kpis = [] } = useQuery({
    queryKey: ['company-kpis'],
    queryFn: companyApi.getKpis,
  })

  const { data: alerts = [] } = useQuery({
    queryKey: ['company-alerts'],
    queryFn: companyApi.getAlerts,
  })

  const { data: trend = [] } = useQuery({
    queryKey: ['company-trend'],
    queryFn: companyApi.getTrend,
  })

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((card: CompanyKpi, index: number) => {
          const Icon = iconMap[index] ?? Building2

          return (
            <Card
              key={card.label}
              rightSlot={
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(31, 143, 95, 0.12)' }}
                >
                  <Icon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                </div>
              }
            >
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {card.label}
              </p>
              <p className="mt-3 text-3xl font-bold">{card.value}</p>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                {card.hint}
              </p>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr,0.9fr]">
        <Card
          title="Crescimento da operação"
          description="Base consolidada de clientes e evolução da receita recorrente."
        >
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f8f5f" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1f8f5f" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#d7e4da" />
                <XAxis dataKey="label" stroke="#5f7465" />
                <YAxis stroke="#5f7465" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1f8f5f"
                  fillOpacity={1}
                  fill="url(#revenueFill)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Alertas estratégicos"
          description="Itens que precisam de ação do time interno."
        >
          <div className="space-y-4">
            {alerts.map((alert: CompanyAlert) => (
              <div
                key={alert.id}
                className="rounded-2xl border p-4"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{alert.title}</p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {alert.clientName}
                    </p>
                  </div>
                  <Badge variant={alertVariant(alert.severity)}>{alert.severity}</Badge>
                </div>

                <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
