// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Alerts Page
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import {
  AlertTriangle, Wifi, Truck, Clock,
  Activity, CheckCircle, X, Volume2,
  VolumeX, Bell, BellOff, Filter
} from 'lucide-react';
import { Card, StatusBadge } from '../../components/ui';
import { useAlerts } from '../../hooks/useAlerts';
import type { AlertType, AlertSeverity, AlertStatus } from '../../types';

// ── Config visual por tipo ────────────────────────────────
const TYPE_CONFIG: Record<AlertType, { icon: any; label: string }> = {
  bin_full:      { icon: AlertTriangle, label: 'Lixeira Cheia'    },
  bin_offline:   { icon: Wifi,          label: 'Sensor Offline'   },
  truck_stopped: { icon: Truck,         label: 'Caminhão Parado'  },
  route_delayed: { icon: Clock,         label: 'Rota Atrasada'    },
  sensor_anomaly:{ icon: Activity,      label: 'Anomalia Sensor'  },
};

const SEVERITY_STYLE: Record<AlertSeverity, { badge: string; border: string; dot: string }> = {
  critica: { badge: 'text-red-400 bg-red-400/15',    border: 'rgba(248,113,113,0.3)', dot: '#f87171' },
  alta:    { badge: 'text-orange-400 bg-orange-400/15', border: 'rgba(251,146,60,0.3)',  dot: '#fb923c' },
  media:   { badge: 'text-yellow-400 bg-yellow-400/15', border: 'rgba(250,204,21,0.3)', dot: '#facc15' },
  baixa:   { badge: 'text-blue-400 bg-blue-400/15',   border: 'rgba(96,165,250,0.3)',   dot: '#60a5fa' },
};

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  critica: 'Crítica', alta: 'Alta', media: 'Média', baixa: 'Baixa',
};

const STATUS_LABEL: Record<AlertStatus, string> = {
  ativa: 'Ativa', resolvida: 'Resolvida', ignorada: 'Ignorada',
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)  return `${diff}s atrás`;
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  return `${Math.floor(diff / 3600)}h atrás`;
}

export default function Alerts() {
  const { alerts, activeCount, settings, resolveAlert, ignoreAlert, updateSettings } = useAlerts();
  const [statusFilter,   setStatusFilter]   = useState<AlertStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [typeFilter,     setTypeFilter]     = useState<AlertType | 'all'>('all');

  const filtered = alerts
    .filter(a => statusFilter   === 'all' || a.status   === statusFilter)
    .filter(a => severityFilter === 'all' || a.severity === severityFilter)
    .filter(a => typeFilter     === 'all' || a.type     === typeFilter)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-5">

      {/* ── Resumo + Configurações ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Contadores */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['critica', 'alta', 'media', 'baixa'] as AlertSeverity[]).map(sev => {
            const count = alerts.filter(a => a.severity === sev && a.status === 'ativa').length;
            const s = SEVERITY_STYLE[sev];
            return (
              <div key={sev} className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: s.border }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                  <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {SEVERITY_LABEL[sev]}
                  </span>
                </div>
                <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>{count}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>alertas ativos</p>
              </div>
            );
          })}
        </div>

        {/* Configurações de notificação */}
        <Card title="Notificações">
          <div className="space-y-3">
            {/* Som */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.sound_enabled
                  ? <Volume2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  : <VolumeX className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                }
                <span className="text-xs" style={{ color: 'var(--text)' }}>Som</span>
              </div>
              <button
                onClick={() => updateSettings({ sound_enabled: !settings.sound_enabled })}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ background: settings.sound_enabled ? 'var(--accent)' : 'var(--border)' }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
                  style={{ left: settings.sound_enabled ? '22px' : '2px' }}
                />
              </button>
            </div>

            {/* Visual */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.visual_enabled
                  ? <Bell className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  : <BellOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                }
                <span className="text-xs" style={{ color: 'var(--text)' }}>Visual</span>
              </div>
              <button
                onClick={() => updateSettings({ visual_enabled: !settings.visual_enabled })}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ background: settings.visual_enabled ? 'var(--accent)' : 'var(--border)' }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
                  style={{ left: settings.visual_enabled ? '22px' : '2px' }}
                />
              </button>
            </div>

            {/* Severidade mínima */}
            <div>
              <p className="text-[10px] font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>
                NOTIFICAR A PARTIR DE
              </p>
              <div className="grid grid-cols-2 gap-1">
                {(['baixa', 'media', 'alta', 'critica'] as AlertSeverity[]).map(sev => (
                  <button
                    key={sev}
                    onClick={() => updateSettings({ min_severity: sev })}
                    className="px-2 py-1 rounded text-[10px] font-mono border transition-all"
                    style={settings.min_severity === sev
                      ? { background: SEVERITY_STYLE[sev].dot + '25', color: SEVERITY_STYLE[sev].dot, borderColor: SEVERITY_STYLE[sev].dot }
                      : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' }
                    }
                  >
                    {SEVERITY_LABEL[sev]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Filtros ── */}
      <Card>
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />

          {/* Status */}
          {(['all', 'ativa', 'resolvida', 'ignorada'] as const).map(s => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1 rounded-lg text-xs font-mono border transition-all"
              style={statusFilter === s
                ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
                : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' }
              }
            >
              {s === 'all' ? 'Todos' : STATUS_LABEL[s]}
              {s === 'ativa' && activeCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background: '#f87171', color: '#fff' }}>{activeCount}</span>
              )}
            </button>
          ))}

          <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />

          {/* Severidade */}
          {(['all', 'critica', 'alta', 'media', 'baixa'] as const).map(s => (
            <button key={s}
              onClick={() => setSeverityFilter(s)}
              className="px-3 py-1 rounded-lg text-xs font-mono border transition-all"
              style={severityFilter === s
                ? { background: s === 'all' ? 'var(--surface)' : SEVERITY_STYLE[s].dot + '30',
                    color: s === 'all' ? 'var(--text)' : SEVERITY_STYLE[s].dot,
                    borderColor: s === 'all' ? 'var(--border)' : SEVERITY_STYLE[s].dot }
                : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' }
              }
            >
              {s === 'all' ? 'Todas' : SEVERITY_LABEL[s]}
            </button>
          ))}

          <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} alertas
          </span>
        </div>
      </Card>

      {/* ── Lista de alertas ── */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const s   = SEVERITY_STYLE[alert.severity];
          const cfg = TYPE_CONFIG[alert.type];
          const Icon = cfg.icon;
          const isActive = alert.status === 'ativa';

          return (
            <div
              key={alert.id}
              className="rounded-xl border p-4 transition-all"
              style={{
                background:   'var(--card)',
                borderColor:  isActive ? s.border : 'var(--border)',
                opacity:      alert.status === 'ignorada' ? 0.5 : 1,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Ícone */}
                <div className="p-2 rounded-lg flex-shrink-0 mt-0.5"
                  style={{ background: s.dot + '20' }}>
                  <Icon className="w-4 h-4" style={{ color: s.dot }} />
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                      {alert.title}
                    </span>
                    <StatusBadge label={SEVERITY_LABEL[alert.severity]} className={s.badge} />
                    <StatusBadge
                      label={STATUS_LABEL[alert.status]}
                      className={isActive
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-zinc-400 bg-zinc-400/10'}
                    />
                    {alert.auto_resolve && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                        style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                        auto-resolve
                      </span>
                    )}
                  </div>

                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    {alert.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    <span>📍 {alert.entity_name}</span>
                    <span>🕐 {timeAgo(alert.created_at)}</span>
                    {alert.resolved_at && (
                      <span>✓ resolvido {timeAgo(alert.resolved_at)}</span>
                    )}
                  </div>
                </div>

                {/* Ações */}
                {isActive && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all"
                      style={{ background: 'rgba(74,222,128,0.1)', color: 'var(--accent)', borderColor: 'rgba(74,222,128,0.3)' }}
                      title="Marcar como resolvido"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Resolver
                    </button>
                    <button
                      onClick={() => ignoreAlert(alert.id)}
                      className="p-1.5 rounded-lg border transition-all"
                      style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                      title="Ignorar alerta"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-xl border" style={{ borderColor: 'var(--border)', borderStyle: 'dashed' }}>
            <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--accent)' }} />
            <p className="text-sm" style={{ color: 'var(--text)' }}>Nenhum alerta encontrado</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {statusFilter === 'ativa' ? 'Todos os alertas foram resolvidos 🎉' : 'Tente ajustar os filtros'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}