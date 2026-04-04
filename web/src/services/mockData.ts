// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — Mock Data
//  Baseado nos dados reais do dashboard.tsx mobile
//  Usado enquanto o backend ainda não tem as rotas implementadas
// ─────────────────────────────────────────────────────────
import type { Bin, Truck, Route, DashboardStats } from '../types';

export const MOCK_BINS: Bin[] = [
  { id: 1, name: 'Hospital',          location: 'Av. Hospital, 100',        latitude: -22.1234, longitude: -45.9876, level: 92, priority: 'alta',  status: 'cheia',      last_collected: '2025-01-10T08:00:00', zone: 'Centro'   },
  { id: 2, name: 'Praça Central',     location: 'Praça da República, s/n',  latitude: -22.1290, longitude: -45.9820, level: 88, priority: 'alta',  status: 'cheia',      last_collected: '2025-01-10T07:30:00', zone: 'Centro'   },
  { id: 3, name: 'Parque Municipal',  location: 'Rua do Parque, 500',       latitude: -22.1350, longitude: -45.9750, level: 81, priority: 'alta',  status: 'ativa',      last_collected: '2025-01-09T16:00:00', zone: 'Norte'    },
  { id: 4, name: 'Mercado Central',   location: 'Rua Comércio, 200',        latitude: -22.1200, longitude: -45.9900, level: 74, priority: 'media', status: 'ativa',      last_collected: '2025-01-10T06:00:00', zone: 'Centro'   },
  { id: 5, name: 'Escola Estadual',   location: 'Av. Educação, 350',        latitude: -22.1400, longitude: -45.9800, level: 65, priority: 'media', status: 'ativa',      last_collected: '2025-01-09T14:00:00', zone: 'Sul'      },
  { id: 6, name: 'Terminal de Ônibus',location: 'Rua Terminal, 1',          latitude: -22.1180, longitude: -45.9950, level: 58, priority: 'media', status: 'ativa',      last_collected: '2025-01-09T12:00:00', zone: 'Centro'   },
  { id: 7, name: 'Ginásio Esportivo', location: 'Av. Esportes, 800',        latitude: -22.1450, longitude: -45.9700, level: 32, priority: 'baixa', status: 'ativa',      last_collected: '2025-01-09T10:00:00', zone: 'Leste'    },
  { id: 8, name: 'Bairro Jardins',    location: 'Rua das Flores, 120',      latitude: -22.1500, longitude: -45.9650, level: 18, priority: 'baixa', status: 'ativa',      last_collected: '2025-01-08T16:00:00', zone: 'Jardins'  },
  { id: 9, name: 'Biblioteca Pública',location: 'Rua Cultura, 45',          latitude: -22.1270, longitude: -45.9830, level: 45, priority: 'baixa', status: 'ativa',      last_collected: '2025-01-09T09:00:00', zone: 'Centro'   },
  { id:10, name: 'UBS Norte',         location: 'Av. Saúde, 220',           latitude: -22.1100, longitude: -45.9770, level: 77, priority: 'media', status: 'ativa',      last_collected: '2025-01-09T08:00:00', zone: 'Norte'    },
];

export const MOCK_TRUCKS: Truck[] = [
  { id: 1, plate: 'ABC-1234', driver: 'Carlos Oliveira', capacity_kg: 8000, current_load_kg: 6200, current_route_id: 1, status: 'em_rota',    latitude: -22.1250, longitude: -45.9860 },
  { id: 2, plate: 'DEF-5678', driver: 'Marcos Lima',     capacity_kg: 8000, current_load_kg: 3100, current_route_id: 2, status: 'em_rota',    latitude: -22.1380, longitude: -45.9780 },
  { id: 3, plate: 'GHI-9012', driver: 'Paulo Santos',    capacity_kg: 6000, current_load_kg: 6000, current_route_id: null, status: 'retornando', latitude: -22.1220, longitude: -45.9910 },
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