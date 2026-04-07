// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Mock Data
//  Baseado nos dados reais do dashboard.tsx mobile
//  Usado enquanto o backend ainda não tem as rotas implementadas
// ─────────────────────────────────────────────────────────
import type { Bin, Truck, Route, DashboardStats } from '../types';
import type { Alert, AlertSettings } from '../types';

export const MOCK_BINS: Bin[] = [
  { id: 1,  name: 'Hospital das Clínicas',  location: 'Av. Dr. Enéas de Carvalho Aguiar, 255', latitude: -23.5558, longitude: -46.6706, level: 92, priority: 'alta',  status: 'cheia',  last_collected: '2025-01-10T08:00:00', zone: 'Pinheiros'   },
  { id: 2,  name: 'Parque Ibirapuera',      location: 'Av. Pedro Álvares Cabral, s/n',          latitude: -23.5874, longitude: -46.6576, level: 88, priority: 'alta',  status: 'cheia',  last_collected: '2025-01-10T07:30:00', zone: 'Moema'        },
  { id: 3,  name: 'Av. Paulista',           location: 'Av. Paulista, 1000',                     latitude: -23.5631, longitude: -46.6544, level: 81, priority: 'alta',  status: 'ativa',  last_collected: '2025-01-09T16:00:00', zone: 'Bela Vista'   },
  { id: 4,  name: 'Mercadão Municipal',     location: 'Rua da Cantareira, 306',                 latitude: -23.5418, longitude: -46.6290, level: 74, priority: 'media', status: 'ativa',  last_collected: '2025-01-10T06:00:00', zone: 'Centro'       },
  { id: 5,  name: 'Terminal Tietê',         location: 'Av. Cruzeiro do Sul, 1800',              latitude: -23.5153, longitude: -46.6255, level: 65, priority: 'media', status: 'ativa',  last_collected: '2025-01-09T14:00:00', zone: 'Santana'      },
  { id: 6,  name: 'Shopping Eldorado',      location: 'Av. Rebouças, 3970',                     latitude: -23.5731, longitude: -46.6964, level: 58, priority: 'media', status: 'ativa',  last_collected: '2025-01-09T12:00:00', zone: 'Pinheiros'    },
  { id: 7,  name: 'Parque Villa-Lobos',     location: 'Av. Prof. Fonseca Rodrigues, 2001',      latitude: -23.5411, longitude: -46.7172, level: 32, priority: 'baixa', status: 'ativa',  last_collected: '2025-01-09T10:00:00', zone: 'Alto de Pinheiros' },
  { id: 8,  name: 'Praça da Sé',           location: 'Praça da Sé, s/n',                       latitude: -23.5505, longitude: -46.6333, level: 18, priority: 'baixa', status: 'ativa',  last_collected: '2025-01-08T16:00:00', zone: 'Centro'       },
  { id: 9,  name: 'Museu do Ipiranga',      location: 'Parque da Independência, s/n',           latitude: -23.5860, longitude: -46.6090, level: 45, priority: 'baixa', status: 'ativa',  last_collected: '2025-01-09T09:00:00', zone: 'Ipiranga'     },
  { id: 10, name: 'Estação da Luz',         location: 'Praça da Luz, 1',                        latitude: -23.5360, longitude: -46.6340, level: 77, priority: 'media', status: 'ativa',  last_collected: '2025-01-09T08:00:00', zone: 'Luz'          },
];

export const MOCK_TRUCKS: Truck[] = [
  { id: 1, plate: 'ABC-1234', driver: 'Carlos Oliveira', capacity_kg: 8000, current_load_kg: 6200, current_route_id: 1, status: 'em_rota',    latitude: -23.5558, longitude: -46.6650 },
  { id: 2, plate: 'DEF-5678', driver: 'Marcos Lima',     capacity_kg: 8000, current_load_kg: 3100, current_route_id: 2, status: 'em_rota',    latitude: -23.5480, longitude: -46.6400 },
  { id: 3, plate: 'GHI-9012', driver: 'Paulo Santos',    capacity_kg: 6000, current_load_kg: 6000, current_route_id: null, status: 'retornando', latitude: -23.5631, longitude: -46.6544 },
  { id: 4, plate: 'JKL-3456', driver: 'Roberto Alves',   capacity_kg: 8000, current_load_kg: 0,    current_route_id: null, status: 'aguardando' },
];

export const MOCK_ROUTES: Route[] = [
  {
    id: 1, truck_id: 1,
    stops: [
      { bin_id: 1, order: 1, collected_at: null },
      { bin_id: 2, order: 2, collected_at: null },
      { bin_id: 4, order: 3, collected_at: null },
    ],
    start_time: '2025-01-10T07:00:00', end_time: null,
    status: 'ativa', total_distance_km: 12.4,
  },
  {
    id: 2, truck_id: 2,
    stops: [
      { bin_id: 3, order: 1, collected_at: null },
      { bin_id: 5, order: 2, collected_at: null },
      { bin_id: 10, order: 3, collected_at: null },
    ],
    start_time: '2025-01-10T07:30:00', end_time: null,
    status: 'ativa', total_distance_km: 9.8,
  },
];

export const MOCK_STATS: DashboardStats = {
  total_bins: 42,
  full_bins: 8,
  collections_today: 17,
  efficiency_pct: 91,
  avg_level: 63,
  collections_per_day: [
    { label: 'Seg', count: 12 },
    { label: 'Ter', count: 19 },
    { label: 'Qua', count: 10 },
    { label: 'Qui', count: 15 },
    { label: 'Sex', count: 20 },
    { label: 'Sáb', count: 14 },
    { label: 'Dom', count: 9  },
  ],
  level_by_hour: [
    { label: '08h', level: 20 },
    { label: '10h', level: 35 },
    { label: '12h', level: 50 },
    { label: '14h', level: 65 },
    { label: '16h', level: 70 },
    { label: '18h', level: 90 },
  ],
  critical_bins: [
    { name: 'Hospital',         level: 92, predicted_full_in_h: 0.8 },
    { name: 'Praça Central',    level: 88, predicted_full_in_h: 1.2 },
    { name: 'Parque Municipal', level: 81, predicted_full_in_h: 1.9 },
  ],
};

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-001', type: 'bin_full', severity: 'critica', status: 'ativa',
    title: 'Lixeira lotada — coleta urgente',
    description: 'Hospital das Clínicas atingiu 96% de capacidade. Coleta prioritária necessária.',
    entity_id: 1, entity_name: 'Hospital das Clínicas',
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
    resolved_at: null, auto_resolve: true,
  },
  {
    id: 'ALT-002', type: 'bin_full', severity: 'critica', status: 'ativa',
    title: 'Lixeira lotada — coleta urgente',
    description: 'Parque Ibirapuera atingiu 92% de capacidade.',
    entity_id: 2, entity_name: 'Parque Ibirapuera',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    resolved_at: null, auto_resolve: true,
  },
  {
    id: 'ALT-003', type: 'truck_stopped', severity: 'alta', status: 'ativa',
    title: 'Caminhão parado há 25 minutos',
    description: 'ABC-1234 (Carlos Oliveira) está sem movimentação desde 09:42. Verificar ocorrência.',
    entity_id: 1, entity_name: 'ABC-1234',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    resolved_at: null, auto_resolve: false,
  },
  {
    id: 'ALT-004', type: 'bin_offline', severity: 'alta', status: 'ativa',
    title: 'Sensor offline — sem leitura',
    description: 'Av. Paulista sem transmissão de dados há 2 horas. Verificar conexão do ESP32.',
    entity_id: 3, entity_name: 'Av. Paulista',
    created_at: new Date(Date.now() - 120 * 60000).toISOString(),
    resolved_at: null, auto_resolve: false,
  },
  {
    id: 'ALT-005', type: 'route_delayed', severity: 'media', status: 'ativa',
    title: 'Rota com atraso',
    description: 'Rota #2 deveria ter iniciado às 07:30. Atraso de 40 minutos.',
    entity_id: 2, entity_name: 'Rota #2',
    created_at: new Date(Date.now() - 40 * 60000).toISOString(),
    resolved_at: null, auto_resolve: false,
  },
  {
    id: 'ALT-006', type: 'sensor_anomaly', severity: 'media', status: 'ativa',
    title: 'Leitura anômala do sensor',
    description: 'Mercadão Central registrou variação de 40% em 5 minutos. Possível falha no sensor.',
    entity_id: 4, entity_name: 'Mercadão Central',
    created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    resolved_at: null, auto_resolve: false,
  },
  {
    id: 'ALT-007', type: 'bin_full', severity: 'alta', status: 'resolvida',
    title: 'Lixeira lotada — resolvida',
    description: 'Terminal Tietê foi coletado e nível voltou a 12%.',
    entity_id: 5, entity_name: 'Terminal Tietê',
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 60 * 60000).toISOString(),
    auto_resolve: true,
  },
  {
    id: 'ALT-008', type: 'truck_stopped', severity: 'alta', status: 'resolvida',
    title: 'Caminhão parado — resolvido',
    description: 'DEF-5678 retomou operação após pausa para abastecimento.',
    entity_id: 2, entity_name: 'DEF-5678',
    created_at: new Date(Date.now() - 240 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 180 * 60000).toISOString(),
    auto_resolve: false,
  },
];

export const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  sound_enabled:  true,
  visual_enabled: true,
  min_severity:   'media',
};