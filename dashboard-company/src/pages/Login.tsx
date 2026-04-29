import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

type LocationState = {
  from?: string
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('juan@ecotrack.com')
  const [password, setPassword] = useState('123456')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const from = (location.state as LocationState | null)?.from ?? '/'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await login(email, password)
    setIsSubmitting(false)

    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div
        className="w-full max-w-md rounded-[28px] border p-8"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
          EcoTrack Company
        </p>

        <h1 className="mt-3 text-3xl font-bold">Acesso corporativo</h1>

        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Painel interno para gestao de clientes, contratos, licencas e deployments.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
            placeholder="seu-email@ecotrack.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-2xl border px-4 py-3 outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-alt)' }}
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <div
            className="rounded-2xl border px-4 py-3 text-sm"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface-alt)',
              color: 'var(--text-muted)',
            }}
          >
            Contas mock:
            <br />
            `juan@ecotrack.com`, `operacoes@ecotrack.com`, `suporte@ecotrack.com`
            <br />
            Senha padrao: `123456`
          </div>

          {error ? (
            <div
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: 'rgba(200, 75, 49, 0.24)',
                background: 'rgba(200, 75, 49, 0.08)',
                color: 'var(--danger)',
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
