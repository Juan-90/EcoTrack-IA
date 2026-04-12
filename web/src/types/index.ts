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

export interface NotificationSettings {
  bin_full_threshold:     number;
  bin_critical_threshold: number;
  truck_stopped_minutes:  number;
  sound_enabled:          boolean;
  visual_enabled:         boolean;
  email_enabled:          boolean;
  email_recipients:       string[];
  sms_enabled:            boolean;
  sms_recipients:         string[];
}

export interface AlertSettings {
  sound_enabled:  boolean;
  visual_enabled: boolean;
  min_severity:   AlertSeverity; // só notifica acima deste nível
}

// ── Coletores / Motoristas ────────────────────────────────
export type DriverStatus = 'ativo' | 'em_rota' | 'folga' | 'afastado';
export type CNHCategory  = 'A' | 'B' | 'C' | 'D' | 'E' | 'AB' | 'AC';

export interface Driver {
  id:           number;
  name:         string;
  photo?:       string;        // URL da foto
  cnh:          string;        // número da CNH
  cnh_category: CNHCategory;
  cnh_expiry:   string;        // ISO date
  phone:        string;
  address:      string;
  zone:         string;        // zona de atuação
  status:       DriverStatus;
  truck_id:     number | null;
  hired_at:     string;        // ISO date — data de admissão
}

export interface DriverMetrics {
  driver_id:          number;
  collections_today:  number;
  collections_month:  number;
  km_today:           number;
  km_month:           number;
  avg_collection_min: number;  // tempo médio por coleta em minutos
  efficiency_pct:     number;  // % de metas atingidas
  on_time_pct:        number;  // % de rotas no prazo
}

// ── Manutenção de Frota ───────────────────────────────────
export type MaintenanceType =
  | 'preventiva'    // revisão programada
  | 'corretiva'     // reparo após falha
  | 'preditiva'     // baseada em dados do sensor
  | 'emergencial';  // parada não planejada

export type MaintenanceStatus = 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';

export interface MaintenancePart {
  name:     string;
  quantity: number;
  cost_brl: number;
}

export interface Maintenance {
  id:            number;
  truck_id:      number;
  truck_plate:   string;
  type:          MaintenanceType;
  status:        MaintenanceStatus;
  description:   string;
  scheduled_date:string;              // ISO date
  completed_date:string | null;
  km_at_service: number;
  next_km:       number | null;       // km para próxima manutenção
  next_date:     string | null;       // data da próxima manutenção
  workshop:      string | null;       // nome da oficina
  mechanic:      string | null;       // nome do mecânico
  labor_cost_brl:number;              // mão de obra
  parts:         MaintenancePart[];   // peças utilizadas
  notes:         string | null;
}

export interface MaintenanceAlert {
  truck_id:    number;
  truck_plate: string;
  type:        'km' | 'date';
  message:     string;
  urgency:     'critica' | 'alta' | 'media';
  due_km?:     number;
  current_km?: number;
  due_date?:   string;
}

// ── Zonas e Bairros ───────────────────────────────────────
export interface Zone {
  id:                string;
  name:              string;
  color:             string;       // cor do card/mapa
  center:            [number, number]; // [lat, lng]
  total_bins:        number;
  full_bins:         number;
  avg_level:         number;       // nível médio 0–100
  collections_week:  number;
  collections_month: number;
  avg_collection_freq_days: number; // frequência média em dias
  last_collection:   string;       // ISO date
  critical_bins:     string[];     // nomes das lixeiras críticas
}

// ── Configurações ─────────────────────────────────────────
export type UserRole = 'admin' | 'operador' | 'analista' | 'visualizador';

export interface SystemUser {
  id:         number;
  name:       string;
  email:      string;
  role:       UserRole;
  active:     boolean;
  created_at: string;
  last_login: string | null;
}

export interface OrgSettings {
  name:        string;
  city:        string;
  state:       string;
  cnpj:        string;
  phone:       string;
  email:       string;
  address:     string;
  logo_url:    string;
}

export interface AlertSettings {
  bin_full_threshold:     number;   // % para disparar alerta
  bin_critical_threshold: number;   // % para alerta crítico
  truck_stopped_minutes:  number;   // minutos parado para alertar
  sound_enabled:          boolean;
  visual_enabled:         boolean;
  email_enabled:          boolean;
  email_recipients:       string[];
  sms_enabled:            boolean;
  sms_recipients:         string[];
}

export interface IntegrationSettings {
  iot_api_url:     string;
  iot_api_key:     string;
  iot_enabled:     boolean;
  email_smtp:      string;
  email_port:      number;
  email_user:      string;
  email_password:  string;
  sms_provider:    string;
  sms_api_key:     string;
  sms_from:        string;
}