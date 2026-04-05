// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — UI Components
//  Usa variáveis CSS para suportar modo claro/escuro
// ─────────────────────────────────────────────────────────
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { getLevelColor } from '../../utils/helpers';

// ── KPI Card ─────────────────────────────────────────────
interface KpiCardProps {
  label:     string;
  value:     string | number;
  sub?:      string;
  icon:      LucideIcon;
  trend?:    { value: number; label: string };
  iconColor?: string;
}

export function KpiCard({ label, value, sub, icon: Icon, trend, iconColor }: KpiCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 border transition-colors duration-200"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-mono tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </span>
        <div
          className="p-2 rounded-lg"
          style={{ background: iconColor ? `${iconColor}18` : 'rgba(74,222,128,0.1)' }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor ?? 'var(--accent)' }} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text)' }}>
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>
        )}
      </div>

      {trend && (
        <p className={clsx('text-xs font-mono', trend.value >= 0 ? 'text-green-500' : 'text-red-500')}>
          {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({ title, badge, children, className, noPad }: {
  title?:    string;
  badge?:    string;
  children:  ReactNode;
  className?: string;
  noPad?:    boolean;
}) {
  return (
    <div
      className={clsx('rounded-xl overflow-hidden border transition-colors duration-200', className)}
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {title && (
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--text)' }}
          >
            {title}
          </h2>
          {badge && (
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
              {badge}
            </span>
          )}
        </div>
      )}
      <div className={noPad ? '' : 'p-5'}>{children}</div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────
export function StatusBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider',
        className
      )}
    >
      {label}
    </span>
  );
}

// ── Fill Bar ──────────────────────────────────────────────
export function FillBar({ level, showLabel = true }: { level: number; showLabel?: boolean }) {
  const color = getLevelColor(level);
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className="flex-1 rounded-full overflow-hidden h-2"
        style={{ background: 'var(--border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${level}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span
          className="text-[10px] font-mono w-8 text-right"
          style={{ color }}
        >
          {level}%
        </span>
      )}
    </div>
  );
}

// ── Loading Spinner ───────────────────────────────────────
export function LoadingSpinner({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div
        className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
      />
      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
        {message}
      </p>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
        {message}
      </p>
    </div>
  );
}