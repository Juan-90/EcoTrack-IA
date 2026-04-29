export type ClientType = 'Prefeitura' | 'Empresa de coleta'
export type ClientStatus = 'Ativo' | 'Onboarding' | 'Atenção' | 'Inativo'
export type DeploymentStatus = 'Online' | 'Degradado' | 'Offline'
export type PlanTier = 'Basic' | 'Pro' | 'Enterprise'
export type InternalUserStatus = 'Ativo' | 'Convidado' | 'Suspenso'
export type InternalRole = 'Founder Admin' | 'Operations Manager' | 'Support Analyst' | 'Backend Lead' | 'IoT Operations'
export type DeploymentEnvironment = 'Production' | 'Staging' | 'Pilot'

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

export interface CompanyDeployment {
  id: string
  clientSlug: string
  clientName: string
  environment: DeploymentEnvironment
  status: DeploymentStatus
  version: string
  uptime: number
  region: string
  latencyMs: number
  errorRate: number
  lastIncidentAt: string | null
  lastDeployAt: string
  internalOwner: string
}

export interface InternalUser {
  id: string
  name: string
  role: InternalRole
  email: string
  status: InternalUserStatus
  scope: string
  lastAccessAt: string
}

export interface PermissionProfile {
  id: string
  name: string
  description: string
  members: number
  capabilities: string[]
}

export interface OperationalCard {
  label: string
  value: string
  detail: string
}
