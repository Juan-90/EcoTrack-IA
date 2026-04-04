// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Helpers
//  Paleta retirada do dashboard.tsx mobile:
//  bg: #08130D | cards: #1b4332 | linhas: #2d6a4f
// ─────────────────────────────────────────────────────────
import type { Priority, BinStatus, TruckStatus } from '../types';

// ── Cores da paleta oficial EcoTrack ─────────────────────
export const PALETTE = {
  bg:         '#08130D',
  surface:    '#0d1f14',
  card:       '#1b4332',
  border:     '#2d6a4f',
  accent:     '#4ade80',   // green-400
  text:       '#ffffff',
  muted:      '#9ca3af',
};

// ── Prioridade (espelha README: >80% Alta, 50-79% Média, <50% Baixa) ──
export const PRIORITY_LABEL: Record<Priority, string> = {
  alta:  'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

export const PRIORITY_COLOR: Record<Priority, string> = {
  alta:  'text-red-400 bg-red-400/15',
  media: 'text-yellow-400 bg-yellow-400/15',
  baixa: 'text-green-400 bg-green-400/15',
};

export const PRIORITY_DOT: Record<Priority, string> = {
  alta:  '#f87171',  // red-400
  media: '#facc15',  // yellow-400
  baixa: '#4ade80',  // green-400
};

export const PRIORITY_EMOJI: Record<Priority, string> = {
  alta:  '🔴',
  media: '🟡',
  baixa: '🟢',
};

// ── Status da lixeira ─────────────────────────────────────
export const BIN_STATUS_LABEL: Record<BinStatus, string> = {
  ativa:       'Ativa',
  cheia:       'Cheia',
  manutencao:  'Manutenção',
  offline:     'Offline',
};

export const BIN_STATUS_COLOR: Record<BinStatus, string> = {
  ativa:       'text-green-400 bg-green-400/10',
  cheia:       'text-red-400 bg-red-400/10',
  manutencao:  'text-orange-400 bg-orange-400/10',
  offline:     'text-zinc-400 bg-zinc-400/10',
};

// ── Status do caminhão ────────────────────────────────────
export const TRUCK_STATUS_LABEL: Record<TruckStatus, string> = {
  em_rota:     'Em Rota',
  retornando:  'Retornando',
  aguardando:  'Aguardando',
  manutencao:  'Manutenção',
};

export const TRUCK_STATUS_COLOR: Record<TruckStatus, string> = {
  em_rota:     'text-green-400 bg-green-400/10',
  retornando:  'text-blue-400 bg-blue-400/10',
  aguardando:  'text-yellow-400 bg-yellow-400/10',
  manutencao:  'text-red-400 bg-red-400/10',
};

// ── Previsão de enchimento (mesma lógica do mobile) ───────
// Taxa de 10% por hora — será substituída pelo modelo IA real
export function predictFillTime(level: number): string {
  const remaining = 100 - level;
  const ratePerHour = 10;
  const hours = remaining / ratePerHour;
  return `${hours.toFixed(1)}h`;
}

// ── Cor do nível de preenchimento ────────────────────────
export function getLevelColor(level: number): string {
  if (level > 80) return '#f87171'; // red-400
  if (level >= 50) return '#facc15'; // yellow-400
  return '#4ade80'; // green-400
}

// ── Formatadores ──────────────────────────────────────────
export const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
};

export const formatKg = (kg: number) =>
  kg >= 1000 ? `${(kg / 1000).toFixed(1)} t` : `${kg} kg`;
