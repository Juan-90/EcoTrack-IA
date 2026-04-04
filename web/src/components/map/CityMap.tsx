// ─────────────────────────────────────────────────────────
//  EcoTrack-IA — CityMap.tsx
//  Mapa real com Leaflet + OpenStreetMap
//  Tema escuro compatível com paleta #08130D do projeto
// ─────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Bin, Truck, Route } from '../../types';
import { PRIORITY_EMOJI, BIN_STATUS_LABEL, formatDate } from '../../utils/helpers';
import { FillBar } from '../ui';

// ── Chave MapTiler (definida no .env) ────────────────────
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string;

// ── Corrige ícones padrão do Leaflet com Vite ────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Ícone do caminhão ─────────────────────────────────────
const truckIcon = (plate: string) => L.divIcon({
  className: '',
  html: `
    <div style="
      background: #0d1f14;
      border: 2px solid #4ade80;
      border-radius: 8px;
      padding: 4px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 0 10px rgba(74,222,128,0.4);
      white-space: nowrap;
    ">
      <span style="font-size: 16px;">🚛</span>
      <span style="
        font-size: 9px;
        font-family: monospace;
        color: #4ade80;
        margin-top: 1px;
      ">${plate}</span>
    </div>
  `,
  iconSize: [52, 44],
  iconAnchor: [26, 44],
});

// ── Cor por prioridade ────────────────────────────────────
const PRIORITY_FILL: Record<string, string> = {
  alta: '#f87171',
  media: '#facc15',
  baixa: '#4ade80',
};

// ── Centraliza mapa na rota selecionada ───────────────────
function MapFocus({ bins }: { bins: Bin[] }) {
  const map = useMap();
  useEffect(() => {
    if (bins.length === 0) return;
    const bounds = L.latLngBounds(bins.map(b => [b.latitude, b.longitude]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [bins, map]);
  return null;
}

// ── Props ─────────────────────────────────────────────────
interface CityMapProps {
  bins?: Bin[];
  trucks?: Truck[];
  routes?: Route[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function CityMap({
  bins = [],
  trucks = [],
  routes = [],
  center = [-23.5505, -46.6333], // Centro de São Paulo
  zoom = 13,
  height = '520px',
}: CityMapProps) {

  // Monta as coordenadas de cada rota em ordem
  const routePolylines = routes.map(route => {
    const coords = route.stops
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(stop => {
        const bin = bins.find(b => b.id === stop.bin_id);
        return bin ? [bin.latitude, bin.longitude] as [number, number] : null;
      })
      .filter(Boolean) as [number, number][];
    return { routeId: route.id, coords };
  });

  return (
    <div style={{ height, borderRadius: '8px', overflow: 'hidden', border: '1px solid #2d6a4f' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

        // No TileLayer:
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`}
          attribution='© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          tileSize={512}
          zoomOffset={-1}
        />

        {/* Centraliza automaticamente nas lixeiras da rota */}
        {bins.length > 0 && <MapFocus bins={bins} />}

        {/* Linha do trajeto */}
        {routePolylines.map(({ routeId, coords }) =>
          coords.length > 1 ? (
            <Polyline
              key={routeId}
              positions={coords}
              pathOptions={{
                color: '#4ade80',
                weight: 3,
                opacity: 0.7,
                dashArray: '8 5',
              }}
            />
          ) : null
        )}

        {/* Marcadores das lixeiras */}
        {bins.map(bin => (
          <CircleMarker
            key={bin.id}
            center={[bin.latitude, bin.longitude]}
            radius={10}
            pathOptions={{
              fillColor: PRIORITY_FILL[bin.priority] ?? '#4ade80',
              fillOpacity: 0.9,
              color: '#08130D',
              weight: 2,
            }}
          >
            <Popup>
              <div style={{
                background: '#0d1f14',
                color: '#fff',
                padding: '10px',
                borderRadius: '8px',
                minWidth: '180px',
                fontFamily: 'sans-serif',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#4ade80', marginBottom: '6px' }}>
                  {PRIORITY_EMOJI[bin.priority]} {bin.name}
                </p>
                {bin.location && (
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>
                    📍 {bin.location}
                  </p>
                )}
                <FillBar level={bin.level} />
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
                  <p>Status: <span style={{ color: '#fff' }}>{BIN_STATUS_LABEL[bin.status]}</span></p>
                  <p>Última coleta: <span style={{ color: '#fff' }}>{formatDate(bin.last_collected)}</span></p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Marcadores dos caminhões */}
        {trucks
          .filter(t => t.latitude && t.longitude)
          .map(truck => (
            <Marker
              key={truck.id}
              position={[truck.latitude!, truck.longitude!]}
              icon={truckIcon(truck.plate)}
            >
              <Popup>
                <div style={{
                  background: '#0d1f14',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '8px',
                  fontFamily: 'sans-serif',
                }}>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#4ade80', marginBottom: '4px' }}>
                    🚛 {truck.plate}
                  </p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>Motorista: <span style={{ color: '#fff' }}>{truck.driver}</span></p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>Rota: <span style={{ color: '#fff' }}>#{truck.current_route_id ?? '—'}</span></p>
                </div>
              </Popup>
            </Marker>
          ))}

      </MapContainer>
    </div>
  );
}