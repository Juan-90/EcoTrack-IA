import { Navigate, Route, Routes } from 'react-router-dom'
import RouteGuard from '../components/auth/RouteGuard'
import Layout from '../components/layout/Layout'
import Analytics from '../pages/Analytics'
import ClientDetail from '../pages/ClientDetail'
import Clients from '../pages/Clients'
import Dashboard from '../pages/Dashboard'
import Deployments from '../pages/Deployments'
import Login from '../pages/Login'
import Plans from '../pages/Plans'
import Settings from '../pages/Settings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RouteGuard>
            <Layout />
          </RouteGuard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:clientId" element={<ClientDetail />} />
        <Route path="deployments" element={<Deployments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="plans" element={<Plans />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
