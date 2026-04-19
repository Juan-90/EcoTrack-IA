// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Login com Tenant Controller
//  Fluxo: validar tenant → login com email/senha
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import { Leaf, Mail, Lock, AlertCircle, Building2, Loader2 } from 'lucide-react';
import { useAuthStore }   from '../../store/authStore';
import { useTenantStore } from '../../store/tenantStore';
import { tenantApi }      from '../../services/api';
import { useNavigate }    from 'react-router-dom';

// ── Máscara de CNPJ ───────────────────────────────────────
function maskCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2)  return digits;
  if (digits.length <= 5)  return `${digits.slice(0,2)}.${digits.slice(2)}`;
  if (digits.length <= 8)  return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8)}`;
  return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8,12)}-${digits.slice(12)}`;
}

function isValidCNPJ(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  // Aceita CNPJ completo (14 dígitos) ou ID curto (mín. 3 chars)
  return digits.length === 14 || value.trim().length >= 3;
}

const PLAN_CONFIG = {
  basico:        { label: 'Básico',        color: '#9ca3af' },
  profissional:  { label: 'Profissional',  color: '#60a5fa' },
  enterprise:    { label: 'Enterprise',    color: '#facc15' },
};

export default function Login() {
  const [tenantInput, setTenantInput] = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [localError,  setLocalError]  = useState('');

  const { login, isLoading, error: authError } = useAuthStore();
  const {
    tenant, isValidating, error: tenantError,
    setTenant, setError: setTenantError, setValidating,
  } = useTenantStore();

  const navigate = useNavigate();

  // ── Passo 1: validar tenant ───────────────────────────
  const handleValidateTenant = async () => {
    if (!isValidCNPJ(tenantInput)) {
      setTenantError('CNPJ inválido ou ID muito curto');
      return;
    }
    setTenantError(null);
    setValidating(true);
    try {
      const result = await tenantApi.validate(tenantInput);
      setTenant(result);
    } catch (e: any) {
      setTenantError(e.message ?? 'Organização não encontrada');
    } finally {
      setValidating(false);
    }
  };

  // ── Passo 2: login ────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!tenant) { setLocalError('Valide a organização primeiro'); return; }
    try {
      await login(email, password);
      navigate('/');
    } catch {
      /* authError já está no store */
    }
  };

  const error = localError || authError || tenantError;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}>

      {/* Grid de fundo */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(45,106,79,0.08) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(45,106,79,0.08) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border"
            style={{ background: 'rgba(74,222,128,0.1)', borderColor: 'var(--border)' }}>
            <Leaf className="w-7 h-7" style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>EcoTrack-IA</h1>
          <p className="text-xs font-mono mt-1 tracking-widest uppercase"
            style={{ color: 'var(--accent)', opacity: 0.7 }}>
            Smart City Platform
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 space-y-5 border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

          <div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Acesso à Plataforma
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Painel de Gestão — Administração Pública
            </p>
          </div>

          {/* Erro */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg border"
              style={{ background: 'rgba(248,113,113,0.05)', borderColor: 'rgba(248,113,113,0.2)' }}>
              <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <p className="text-xs" style={{ color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          {/* ── Campo Tenant ── */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}>
              Identificação da Organização
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                  style={{ color: tenant ? 'var(--accent)' : 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="CNPJ ou ID da organização"
                  value={tenantInput}
                  onChange={e => {
                    // Tenta formatar como CNPJ se for numérico
                    const raw = e.target.value;
                    const isNumeric = /^\d[\d.\-/]*$/.test(raw) || raw === '';
                    setTenantInput(isNumeric ? maskCNPJ(raw) : raw);
                    if (tenant) useTenantStore.getState().clearTenant();
                    setTenantError(null);
                  }}
                  disabled={isValidating}
                  className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm border focus:outline-none transition-colors"
                  style={{
                    background:   'var(--card)',
                    borderColor:  tenant ? 'var(--accent)' : 'var(--border)',
                    color:        'var(--text)',
                  }}
                />
              </div>
              <button
                onClick={handleValidateTenant}
                disabled={isValidating || !tenantInput || !!tenant}
                className="px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 flex items-center gap-1.5"
                style={tenant
                  ? { background: 'rgba(74,222,128,0.15)', color: 'var(--accent)', borderColor: 'rgba(74,222,128,0.3)' }
                  : { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                }
              >
                {isValidating
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : tenant ? '✓ OK' : 'Validar'
                }
              </button>
            </div>

            {/* Info do tenant validado */}
            {tenant && (
              <div className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: 'rgba(74,222,128,0.05)', borderColor: 'rgba(74,222,128,0.2)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(74,222,128,0.15)' }}>
                  <Building2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>
                    {tenant.name}
                  </p>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {tenant.city}/{tenant.state} ·{' '}
                    <span style={{ color: PLAN_CONFIG[tenant.plan].color }}>
                      {PLAN_CONFIG[tenant.plan].label}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    useTenantStore.getState().clearTenant();
                    setTenantInput('');
                  }}
                  className="text-[10px] font-mono px-2 py-1 rounded border"
                  style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                >
                  Trocar
                </button>
              </div>
            )}

            {/* Hint */}
            {!tenant && (
              <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                💡 Demo: use <span style={{ color: 'var(--accent)' }}>001</span> ou CNPJ{' '}
                <span style={{ color: 'var(--accent)' }}>46.395.000/0001-39</span>
              </p>
            )}
          </div>

          {/* Separador */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              CREDENCIAIS
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* ── Formulário de login ── */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: 'var(--text-muted)' }} />
              <input
                type="email" placeholder="E-mail" value={email}
                onChange={e => setEmail(e.target.value)}
                required disabled={!tenant}
                className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm border focus:outline-none disabled:opacity-40"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                style={{ color: 'var(--text-muted)' }} />
              <input
                type="password" placeholder="Senha" value={password}
                onChange={e => setPassword(e.target.value)}
                required disabled={!tenant}
                className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm border focus:outline-none disabled:opacity-40"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !tenant}
              className="w-full font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-mono mt-6 tracking-wider"
          style={{ color: 'var(--border)' }}>
          ECOTRACK-IA © 2025 — IFSULDEMINAS
        </p>
      </div>
    </div>
  );
}