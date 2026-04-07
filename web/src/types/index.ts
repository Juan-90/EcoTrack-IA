// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Types
//  Alinhado com backend real (FastAPI + SQLAlchemy)
//  e com o mobile (dashboard.tsx branch melhorias-no-frontend)
// ─────────────────────────────────────────────────────────

// Prioridade espelha a classificação do README:
// 🔴 Alta  > 80%
// 🟡 Média 50–79%
// 🟢 Baixa < 50%
export type Priority = 'alta' | 'media' | 'baixa';
export type BinStatus = 'ativa' | 'cheia' | 'manutencao' | 'offline';
export type TruckStatus = 'em_rota' | 'retornando' | 'aguardando' | 'manutencao';

export interface Bin {
  id: number;
  name: string;          // ex: "Hospital", "Praça Central"
  location: string;      // endereço / descrição do local
  latitude: number;
  longitude: number;
  level: number;         // 0–100 (percentual de ocupação)
  priority: Priority;    // calculado pelo backend
  status: BinStatus;
  last_collected: string | null; // ISO datetime
  zone?: string;         // bairro / zona
}

export interface Truck {
  id: number;
  plate: string;         // placa
  driver: string;        // nome do motorista
  capacity_kg: number;
  current_load_kg: number;
  current_route_id: number | null;
  status: TruckStatus;
  latitude?: number;
  longitude?: number;
}

export interface RouteStop {
  bin_id: number;
  order: number;
  collected_at: string | null;
}

export interface Route {
  id: number;
  truck_id: number;
  stops: RouteStop[];
  start_time: string;
  end_time: string | null;
  status: 'planejada' | 'ativa' | 'concluida';
  total_distance_km?: number;
}

export interface Collection {
  id: number;
  bin_id: number;
  truck_id: number;
  timestamp: string;
  level_at_collection: number;
}

// Analytics — espelha KPIs do dashboard mobile
export interface DashboardStats {
  total_bins: number;           // 42 no mock mobile
  full_bins: number;            // 8  no mock mobile
  collections_today: number;    // 17 no mock mobile
  efficiency_pct: number;       // 91 no mock mobile
  avg_level: number;
  collections_per_day: { label: string; count: number }[];
  level_by_hour: { label: string; level: number }[];
  critical_bins: { name: string; level: number; predicted_full_in_h: number }[];
}

// Auth — espelha exatamente o model User do backend
export interface User {
  id: number;
  email: string;
  token: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
}

// ── Alertas ───────────────────────────────────────────────
export type AlertSeverity = 'critica' | 'alta' | 'media' | 'baixa';
export type AlertType =
  | 'bin_full'          // lixeira cheia
  | 'bin_offline'       // sensor offline
  | 'truck_stopped'     // caminhão parado
  | 'route_delayed'     // rota atrasada
  | 'sensor_anomaly';   // leitura anômala do sensor

export type AlertStatus = 'ativa' | 'resolvida' | 'ignorada';

export interface Alert {
  id:          string;
  type:        AlertType;
  severity:    AlertSeverity;
  status:      AlertStatus;
  title:       string;
  description: string;
  entity_id:   number;        // id da lixeira, caminhão etc
  entity_name: string;        // "Hospital", "ABC-1234" etc
  created_at:  string;        // ISO datetime
  resolved_at: string | null;
  auto_resolve: boolean;      // se resolve sozinho quando nível baixar
}

export interface AlertSettings {
  sound_enabled:  boolean;
  visual_enabled: boolean;
  min_severity:   AlertSeverity; // só notifica acima deste nível
}