import axios from 'axios'
import {
  companyAlerts,
  companyClients,
  companyDeployments,
  companyKpis,
  companyTrend,
  internalUsers,
  operationalCards,
  permissionProfiles,
} from './mockData'
import type {
  CompanyAlert,
  CompanyClient,
  CompanyDeployment,
  CompanyKpi,
  CompanyTrendPoint,
  InternalUser,
  OperationalCard,
  PermissionProfile,
} from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const companyApi = {
  getKpis: async (): Promise<CompanyKpi[]> => {
    if (USE_MOCK) {
      await delay()
      return companyKpis
    }

    const { data } = await api.get<CompanyKpi[]>('/company/kpis')
    return data
  },

  getAlerts: async (): Promise<CompanyAlert[]> => {
    if (USE_MOCK) {
      await delay()
      return companyAlerts
    }

    const { data } = await api.get<CompanyAlert[]>('/company/alerts')
    return data
  },

  getTrend: async (): Promise<CompanyTrendPoint[]> => {
    if (USE_MOCK) {
      await delay()
      return companyTrend
    }

    const { data } = await api.get<CompanyTrendPoint[]>('/company/trend')
    return data
  },

  getClients: async (): Promise<CompanyClient[]> => {
    if (USE_MOCK) {
      await delay()
      return companyClients
    }

    const { data } = await api.get<CompanyClient[]>('/company/clients')
    return data
  },

  getClientBySlug: async (slug: string): Promise<CompanyClient | null> => {
    if (USE_MOCK) {
      await delay()
      return companyClients.find((client) => client.slug === slug) ?? null
    }

    const { data } = await api.get<CompanyClient>(`/company/clients/${slug}`)
    return data
  },

  getDeployments: async (): Promise<CompanyDeployment[]> => {
    if (USE_MOCK) {
      await delay()
      return companyDeployments
    }

    const { data } = await api.get<CompanyDeployment[]>('/company/deployments')
    return data
  },

  getInternalUsers: async (): Promise<InternalUser[]> => {
    if (USE_MOCK) {
      await delay()
      return internalUsers
    }

    const { data } = await api.get<InternalUser[]>('/company/internal-users')
    return data
  },

  getPermissionProfiles: async (): Promise<PermissionProfile[]> => {
    if (USE_MOCK) {
      await delay()
      return permissionProfiles
    }

    const { data } = await api.get<PermissionProfile[]>('/company/permission-profiles')
    return data
  },

  getOperationalCards: async (): Promise<OperationalCard[]> => {
    if (USE_MOCK) {
      await delay()
      return operationalCards
    }

    const { data } = await api.get<OperationalCard[]>('/company/operational-cards')
    return data
  },
}
