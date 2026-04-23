export type ClientType = 'Prefeitura' | 'Empresa de coleta'
export type ClientStatus = 'Ativo' | 'Onboarding' | 'Atenção' | 'Inativo'
export type DeploymentStatus = 'Online' | 'Degradado' | 'Offline'
export type PlanTier = 'Basic' | 'Pro' | 'Enterprise'

export interface CompanyKpi {
  label: string
  value: string
  hint: string
}

export interface CompanyClient {
  id: string
  name: string
  slug: string
  type: ClientType
  status: ClientStatus
  city: string
  state: string
  plan: PlanTier
  activatedAt: string
  monthlyRevenue: number
  activeUsers: number
  monitoredBins: number
  collectionEfficiency: number
  licenseUsage: number
  deploymentStatus: DeploymentStatus
  version: string
  uptime: string
  contractEndsAt: string
  internalOwner: string
}

export interface CompanyAlert {
  id: string
  title: string
  clientName: string
  severity: 'Alta' | 'Média' | 'Baixa'
  description: string
}

export interface CompanyTrendPoint {
  label: string
  clients: number
  revenue: number
}

export interface CompanyDetailSectionStat {
  label: string
  value: string
}
