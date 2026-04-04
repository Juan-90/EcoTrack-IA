// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Login
//  Chama FastAPI OAuth2PasswordRequestForm via URLSearchParams
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import { Leaf, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch { /* erro já está no store */ }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#08130D' }}>
      {/* Grid de fundo */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(45,106,79,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,106,79,0.08) 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border" style={{ background: 'rgba(74,222,128,0.1)', borderColor: '#2d6a4f' }}>
            <Leaf className="w-7 h-7 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">EcoTrack-IA</h1>
          <p className="text-xs font-mono mt-1 tracking-widest uppercase" style={{ color: '#4ade80', opacity: 0.7 }}>
            Smart City Platform — IFSULDEMINAS
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 space-y-5 border" style={{ background: '#0d1f14', borderColor: '#2d6a4f' }}>
          <div>
            <h2 className="text-sm font-semibold text-white">Acesso à Plataforma</h2>
            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>Painel de Gestão — Administração Pública</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg border" style={{ background: 'rgba(248,113,113,0.05)', borderColor: 'rgba(248,113,113,0.2)' }}>
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <p className="text-xs" style={{ color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
              <input
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)} required
                className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none border"
                style={{ background: '#1b4332', borderColor: '#2d6a4f' }}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#9ca3af' }} />
              <input
                type="password" placeholder="Senha" value={password}
                onChange={e => setPassword(e.target.value)} required
                className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none border"
                style={{ background: '#1b4332', borderColor: '#2d6a4f' }}
              />
            </div>
            <button
              type="submit" disabled={isLoading}
              className="w-full font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
              style={{ background: '#4ade80', color: '#08130D' }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.background = '#86efac')}
              onMouseLeave={e => (e.currentTarget.style.background = '#4ade80')}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-mono mt-6 tracking-wider" style={{ color: '#2d6a4f' }}>
          ECOTRACK-IA © 2026 — IFSULDEMINAS — PROJETO ACADÊMICO
        </p>
      </div>
    </div>
  );
}
