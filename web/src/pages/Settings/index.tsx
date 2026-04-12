// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Settings Page
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  Building2, Users, Bell, Plug,
  Save, Plus, Trash2, Eye, EyeOff,
  CheckCircle, Shield, BarChart3, User
} from 'lucide-react';
import { Card, StatusBadge } from '../../components/ui';
import type {
  UserRole, SystemUser, OrgSettings,
  NotificationSettings, IntegrationSettings  // ← aqui
} from '../../types';

// ── Config visual por role ────────────────────────────────
const ROLE_CONFIG: Record<UserRole, {
  label: string; desc: string; className: string; icon: any
}> = {
  admin:        { label: 'Admin',        desc: 'Acesso total ao sistema',          className: 'text-red-400 bg-red-400/10',     icon: Shield    },
  operador:     { label: 'Operador',     desc: 'Gerencia coletas e rotas',         className: 'text-orange-400 bg-orange-400/10', icon: User    },
  analista:     { label: 'Analista',     desc: 'Visualiza e exporta relatórios',   className: 'text-blue-400 bg-blue-400/10',   icon: BarChart3 },
  visualizador: { label: 'Visualizador', desc: 'Somente leitura',                  className: 'text-zinc-400 bg-zinc-400/10',   icon: Eye       },
};

// ── Mock inicial ──────────────────────────────────────────
const INIT_ORG: OrgSettings = {
  name:     'Prefeitura Municipal de São Paulo',
  city:     'São Paulo',
  state:    'SP',
  cnpj:     '46.395.000/0001-39',
  phone:    '(11) 3113-8000',
  email:    'contato@prefeitura.sp.gov.br',
  address:  'Viaduto do Chá, 15 — Centro, SP',
  logo_url: '',
};

const INIT_USERS: SystemUser[] = [
  { id: 1, name: 'Juan Andrade',    email: 'admin@ecotrack.com',     role: 'admin',        active: true,  created_at: '2024-01-10', last_login: new Date().toISOString() },
  { id: 2, name: 'Caio Mattos',     email: 'caio@ecotrack.com',      role: 'operador',     active: true,  created_at: '2024-01-12', last_login: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, name: 'Nelson Sousa',    email: 'nelson@ecotrack.com',    role: 'analista',     active: true,  created_at: '2024-01-15', last_login: new Date(Date.now() - 172800000).toISOString() },
  { id: 4, name: 'Roberto Duarte',  email: 'roberto@ecotrack.com',   role: 'visualizador', active: true,  created_at: '2024-01-20', last_login: null },
];

const INIT_ALERTS: NotificationSettings = {
  bin_full_threshold:     80,
  bin_critical_threshold: 95,
  truck_stopped_minutes:  20,
  sound_enabled:          true,
  visual_enabled:         true,
  email_enabled:          false,
  email_recipients:       ['gestao@prefeitura.sp.gov.br'],
  sms_enabled:            false,
  sms_recipients:         ['+5511999990000'],
};

const INIT_INTEGRATIONS: IntegrationSettings = {
  iot_api_url:    'http://localhost:5000',
  iot_api_key:    'ecotrack-iot-key-2025',
  iot_enabled:    true,
  email_smtp:     'smtp.gmail.com',
  email_port:     587,
  email_user:     '',
  email_password: '',
  sms_provider:   'Twilio',
  sms_api_key:    '',
  sms_from:       '+5511000000000',
};

// ── Componente: Toggle ────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ background: value ? 'var(--accent)' : 'var(--border)' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
        style={{ left: value ? '22px' : '2px' }}
      />
    </button>
  );
}

// ── Componente: Input ─────────────────────────────────────
function Input({
  label, value, onChange, type = 'text', placeholder = '', disabled = false
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-[10px] font-mono mb-1 uppercase tracking-wider"
        style={{ color: 'var(--text-muted)' }}>{label}</label>
      <div className="relative">
        <input
          type={isPassword && !show ? 'password' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none disabled:opacity-50"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
        />
        {isPassword && (
          <button
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          >
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Seção: Organização ────────────────────────────────────
function OrgSection() {
  const [org, setOrg]     = useState<OrgSettings>(INIT_ORG);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields: { key: keyof OrgSettings; label: string; placeholder?: string }[] = [
    { key: 'name',    label: 'Nome da Organização', placeholder: 'Prefeitura de...' },
    { key: 'city',    label: 'Cidade',               placeholder: 'São Paulo'       },
    { key: 'state',   label: 'Estado',               placeholder: 'SP'              },
    { key: 'cnpj',    label: 'CNPJ',                 placeholder: '00.000.000/0001-00' },
    { key: 'phone',   label: 'Telefone',             placeholder: '(11) 9999-9999' },
    { key: 'email',   label: 'E-mail',               placeholder: 'contato@...'    },
    { key: 'address', label: 'Endereço',             placeholder: 'Rua, número...' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>
          Dados da Organização
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Informações da prefeitura ou empresa coletora
        </p>
      </div>

      {/* Logo */}
      <Card title="Logo">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border flex items-center justify-center flex-shrink-0"
            style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
            {org.logo_url
              ? <img src={org.logo_url} alt="logo" className="w-full h-full object-contain rounded-xl" />
              : <Building2 className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
            }
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>
              Logo da organização
            </p>
            <p className="text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>
              PNG ou SVG, máximo 2MB
            </p>
            <button className="px-3 py-1.5 rounded-lg text-xs font-mono border"
              style={{ color: 'var(--accent)', borderColor: 'rgba(74,222,128,0.3)' }}>
              Fazer upload
            </button>
          </div>
        </div>
      </Card>

      {/* Campos */}
      <Card title="Informações">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key} style={f.key === 'address' || f.key === 'name' ? { gridColumn: 'span 2' } : {}}>
              <Input
                label={f.label}
                value={org[f.key]}
                placeholder={f.placeholder}
                onChange={v => setOrg(p => ({ ...p, [f.key]: v }))}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={save}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: saved ? 'rgba(74,222,128,0.2)' : 'var(--accent)', color: saved ? 'var(--accent)' : 'var(--bg)' }}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── Seção: Usuários ───────────────────────────────────────
function UsersSection() {
  const [users,    setUsers]    = useState<SystemUser[]>(INIT_USERS);
  const [showForm, setShowForm] = useState(false);
  const [newUser,  setNewUser]  = useState({ name: '', email: '', role: 'operador' as UserRole });

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers(p => [...p, {
      id: Date.now(), ...newUser,
      active: true,
      created_at: new Date().toISOString().split('T')[0],
      last_login: null,
    }]);
    setNewUser({ name: '', email: '', role: 'operador' });
    setShowForm(false);
  };

  const toggleActive = (id: number) =>
    setUsers(p => p.map(u => u.id === id ? { ...u, active: !u.active } : u));

  const removeUser = (id: number) =>
    setUsers(p => p.filter(u => u.id !== id));

  const formatLogin = (iso: string | null) => {
    if (!iso) return 'Nunca';
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    return `${diff} dias atrás`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>
            Gerenciamento de Usuários
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {users.filter(u => u.active).length} usuários ativos
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          <Plus className="w-4 h-4" /> Novo Usuário
        </button>
      </div>

      {/* Permissões por role */}
      <Card title="Níveis de Acesso">
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG[UserRole]][]).map(([role, cfg]) => (
            <div key={role} className="flex items-start gap-3 p-3 rounded-xl border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-1.5 rounded-lg" style={{ background: 'var(--surface)' }}>
                <cfg.icon className="w-3.5 h-3.5" style={{ color: cfg.className.split(' ')[0].replace('text-', '#').replace('red-400', 'f87171').replace('orange-400', 'fb923c').replace('blue-400', '60a5fa').replace('zinc-400', '9ca3af') }} />
              </div>
              <div>
                <StatusBadge label={cfg.label} className={cfg.className} />
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{cfg.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Formulário novo usuário */}
      {showForm && (
        <Card title="Novo Usuário">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Nome" value={newUser.name}
              onChange={v => setNewUser(p => ({ ...p, name: v }))}
              placeholder="Nome completo" />
            <Input label="E-mail" value={newUser.email}
              onChange={v => setNewUser(p => ({ ...p, email: v }))}
              placeholder="email@exemplo.com" />
            <div>
              <label className="block text-[10px] font-mono mb-1 uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}>PERFIL</label>
              <div className="flex gap-1.5 flex-wrap">
                {(Object.keys(ROLE_CONFIG) as UserRole[]).map(role => (
                  <button key={role} onClick={() => setNewUser(p => ({ ...p, role }))}
                    className="px-2 py-1 rounded text-[10px] font-mono border transition-all"
                    style={newUser.role === role
                      ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                      : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
                    }>
                    {ROLE_CONFIG[role].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addUser}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
              Criar Usuário
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Cancelar
            </button>
          </div>
        </Card>
      )}

      {/* Lista de usuários */}
      <Card noPad>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              {['Usuário', 'Perfil', 'Último Login', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const cfg = ROLE_CONFIG[user.role];
              return (
                <tr key={user.id} className="border-b transition-colors"
                  style={{ borderColor: 'rgba(45,106,79,0.2)', opacity: user.active ? 1 : 0.5 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--card)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{user.name}</p>
                    <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={cfg.label} className={cfg.className} />
                  </td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    {formatLogin(user.last_login)}
                  </td>
                  <td className="px-4 py-3">
                    <Toggle value={user.active} onChange={() => toggleActive(user.id)} />
                  </td>
                  <td className="px-4 py-3">
                    {user.id !== 1 && (
                      <button onClick={() => removeUser(user.id)}
                        className="p-1.5 rounded-lg transition-all"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Seção: Alertas ────────────────────────────────────────
function AlertsSection() {
  const [cfg, setCfg]   = useState<NotificationSettings>(INIT_ALERTS);
  const [saved, setSaved] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newSms,   setNewSms]   = useState('');

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>
          Configurações de Alertas
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Thresholds e canais de notificação
        </p>
      </div>

      {/* Thresholds */}
      <Card title="Thresholds">
        <div className="space-y-5">
          {[
            { label: 'Alerta de lixeira cheia',    key: 'bin_full_threshold' as const,     unit: '%',  min: 50, max: 100 },
            { label: 'Alerta crítico de lixeira',  key: 'bin_critical_threshold' as const, unit: '%',  min: 70, max: 100 },
            { label: 'Caminhão parado',             key: 'truck_stopped_minutes' as const,  unit: 'min',min: 5,  max: 120 },
          ].map(t => (
            <div key={t.key}>
              <div className="flex justify-between mb-2">
                <label className="text-xs" style={{ color: 'var(--text)' }}>{t.label}</label>
                <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent)' }}>
                  {cfg[t.key]} {t.unit}
                </span>
              </div>
              <input type="range" min={t.min} max={t.max} value={cfg[t.key]}
                onChange={e => setCfg(p => ({ ...p, [t.key]: Number(e.target.value) }))}
                className="w-full accent-green-400" />
              <div className="flex justify-between text-[9px] font-mono mt-1"
                style={{ color: 'var(--text-muted)' }}>
                <span>{t.min}{t.unit}</span>
                <span>{t.max}{t.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Canais */}
      <Card title="Canais de Notificação">
        <div className="space-y-4">
          {/* Som e Visual */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'sound_enabled'  as const, label: 'Som',    icon: Bell },
              { key: 'visual_enabled' as const, label: 'Visual', icon: Eye  },
            ].map(c => (
              <div key={c.key} className="flex items-center justify-between p-3 rounded-xl border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <c.icon className="w-4 h-4" style={{ color: cfg[c.key] ? 'var(--accent)' : 'var(--text-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--text)' }}>{c.label}</span>
                </div>
                <Toggle value={cfg[c.key]} onChange={v => setCfg(p => ({ ...p, [c.key]: v }))} />
              </div>
            ))}
          </div>

          {/* E-mail */}
          <div className="p-4 rounded-xl border space-y-3"
            style={{ background: 'var(--card)', borderColor: cfg.email_enabled ? 'rgba(74,222,128,0.3)' : 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>E-mail</span>
              <Toggle value={cfg.email_enabled} onChange={v => setCfg(p => ({ ...p, email_enabled: v }))} />
            </div>
            {cfg.email_enabled && (
              <div className="space-y-2">
                {cfg.email_recipients.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-xs font-mono p-2 rounded border"
                      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                      {r}
                    </span>
                    <button onClick={() => setCfg(p => ({ ...p, email_recipients: p.email_recipients.filter((_, idx) => idx !== i) }))}
                      style={{ color: '#f87171' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="flex-1 rounded-lg px-3 py-1.5 text-xs border focus:outline-none"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                  <button onClick={() => { if (newEmail) { setCfg(p => ({ ...p, email_recipients: [...p.email_recipients, newEmail] })); setNewEmail(''); } }}
                    className="px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SMS */}
          <div className="p-4 rounded-xl border space-y-3"
            style={{ background: 'var(--card)', borderColor: cfg.sms_enabled ? 'rgba(74,222,128,0.3)' : 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>SMS</span>
              <Toggle value={cfg.sms_enabled} onChange={v => setCfg(p => ({ ...p, sms_enabled: v }))} />
            </div>
            {cfg.sms_enabled && (
              <div className="space-y-2">
                {cfg.sms_recipients.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 text-xs font-mono p-2 rounded border"
                      style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                      {r}
                    </span>
                    <button onClick={() => setCfg(p => ({ ...p, sms_recipients: p.sms_recipients.filter((_, idx) => idx !== i) }))}
                      style={{ color: '#f87171' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input value={newSms} onChange={e => setNewSms(e.target.value)}
                    placeholder="+5511999990000"
                    className="flex-1 rounded-lg px-3 py-1.5 text-xs border focus:outline-none"
                    style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                  <button onClick={() => { if (newSms) { setCfg(p => ({ ...p, sms_recipients: [...p.sms_recipients, newSms] })); setNewSms(''); } }}
                    className="px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <button onClick={save}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: saved ? 'rgba(74,222,128,0.2)' : 'var(--accent)', color: saved ? 'var(--accent)' : 'var(--bg)' }}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
        </button>
      </div>
    </div>
  );
}

// ── Seção: Integrações ────────────────────────────────────
function IntegrationsSection() {
  const [cfg, setCfg]   = useState<IntegrationSettings>(INIT_INTEGRATIONS);
  const [saved, setSaved] = useState(false);
  const [tested, setTested] = useState<Record<string, 'ok' | 'error' | null>>({});

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const test = (key: string) => {
    setTimeout(() => setTested(p => ({ ...p, [key]: 'ok' })), 800);
    setTimeout(() => setTested(p => ({ ...p, [key]: null })), 3000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>
          Integrações
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Conexões com serviços externos
        </p>
      </div>

      {/* IoT */}
      <Card title="API IoT — ESP32">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--text)' }}>Conexão ativa</span>
            <Toggle value={cfg.iot_enabled} onChange={v => setCfg(p => ({ ...p, iot_enabled: v }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="URL da API" value={cfg.iot_api_url}
              onChange={v => setCfg(p => ({ ...p, iot_api_url: v }))}
              placeholder="http://localhost:5000" />
            <Input label="API Key" value={cfg.iot_api_key}
              onChange={v => setCfg(p => ({ ...p, iot_api_key: v }))}
              type="password" placeholder="sua-chave-aqui" />
          </div>
          <button onClick={() => test('iot')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
            style={tested.iot === 'ok'
              ? { color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }
              : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
            }>
            {tested.iot === 'ok' ? <><CheckCircle className="w-3.5 h-3.5" /> Conectado!</> : 'Testar conexão'}
          </button>
        </div>
      </Card>

      {/* E-mail SMTP */}
      <Card title="E-mail SMTP">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Servidor SMTP" value={cfg.email_smtp}
            onChange={v => setCfg(p => ({ ...p, email_smtp: v }))}
            placeholder="smtp.gmail.com" />
          <Input label="Porta" value={cfg.email_port}
            onChange={v => setCfg(p => ({ ...p, email_port: Number(v) }))}
            placeholder="587" />
          <Input label="Usuário" value={cfg.email_user}
            onChange={v => setCfg(p => ({ ...p, email_user: v }))}
            placeholder="seu@email.com" />
          <Input label="Senha" value={cfg.email_password}
            onChange={v => setCfg(p => ({ ...p, email_password: v }))}
            type="password" placeholder="••••••••" />
        </div>
        <button onClick={() => test('email')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all mt-3"
          style={tested.email === 'ok'
            ? { color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }
            : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
          }>
          {tested.email === 'ok' ? <><CheckCircle className="w-3.5 h-3.5" /> Conectado!</> : 'Enviar e-mail de teste'}
        </button>
      </Card>

      {/* SMS */}
      <Card title="SMS">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono mb-1 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>PROVEDOR</label>
            <select value={cfg.sms_provider}
              onChange={e => setCfg(p => ({ ...p, sms_provider: e.target.value }))}
              className="w-full rounded-lg px-3 py-2 text-sm border focus:outline-none"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
              {['Twilio', 'Zenvia', 'Infobip', 'AWS SNS'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <Input label="API Key" value={cfg.sms_api_key}
            onChange={v => setCfg(p => ({ ...p, sms_api_key: v }))}
            type="password" placeholder="sua-chave-aqui" />
          <Input label="Número remetente" value={cfg.sms_from}
            onChange={v => setCfg(p => ({ ...p, sms_from: v }))}
            placeholder="+5511000000000" />
        </div>
        <button onClick={() => test('sms')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all mt-3"
          style={tested.sms === 'ok'
            ? { color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }
            : { color: 'var(--text-muted)', borderColor: 'var(--border)' }
          }>
          {tested.sms === 'ok' ? <><CheckCircle className="w-3.5 h-3.5" /> Enviado!</> : 'Enviar SMS de teste'}
        </button>
      </Card>

      <div className="flex justify-end">
        <button onClick={save}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: saved ? 'rgba(74,222,128,0.2)' : 'var(--accent)', color: saved ? 'var(--accent)' : 'var(--bg)' }}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar</>}
        </button>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────
type Section = 'org' | 'users' | 'alerts' | 'integrations';

const SECTIONS: { key: Section; label: string; icon: any; desc: string }[] = [
  { key: 'org',          label: 'Organização',  icon: Building2, desc: 'Dados da prefeitura'         },
  { key: 'users',        label: 'Usuários',      icon: Users,     desc: 'Gerenciar acessos'           },
  { key: 'alerts',       label: 'Alertas',       icon: Bell,      desc: 'Thresholds e notificações'   },
  { key: 'integrations', label: 'Integrações',   icon: Plug,      desc: 'API IoT, e-mail e SMS'       },
];

export default function Settings() {
  const [section, setSection] = useState<Section>('org');

  const renderSection = () => {
    if (section === 'org')          return <OrgSection />;
    if (section === 'users')        return <UsersSection />;
    if (section === 'alerts')       return <AlertsSection />;
    if (section === 'integrations') return <IntegrationsSection />;
  };

  return (
    <div className="flex gap-6">

      {/* Menu lateral */}
      <aside className="w-56 flex-shrink-0">
        <nav className="space-y-1">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all border"
              style={section === s.key
                ? { background: 'rgba(74,222,128,0.1)', borderColor: 'rgba(74,222,128,0.3)', color: 'var(--accent)' }
                : { background: 'transparent', borderColor: 'transparent', color: 'var(--text-muted)' }
              }>
              <s.icon className="w-4 h-4 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold">{s.label}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        {renderSection()}
      </div>
    </div>
  );
}