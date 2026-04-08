import { api } from "@/src/services/api";
import { mockBins } from "@/src/mocks/bins";
import { Bin, BinStatus } from "@/src/types/bin";

let mockState: Bin[] = [...mockBins];

function normalizeStatus(level: number): BinStatus {
  if (level >= 80) return "critical";
  if (level >= 50) return "warning";
  return "normal";
}

function mapApiBin(raw: any): Bin {
  const level = Number(
    raw.level ??
      raw.fill_level ??
      raw.fillPercentage ??
      raw.occupancy_level ??
      0
  );

  return {
    id: String(raw.id),
    name: raw.name ?? raw.nome ?? `Lixeira ${raw.id}`,
    district: raw.district ?? raw.bairro ?? "Sem bairro",
    level,
    status: raw.status ?? normalizeStatus(level),
    lastCollection: raw.lastCollection ?? raw.last_collection ?? null,
    updatedAt:
      raw.updatedAt ?? raw.updated_at ?? new Date().toISOString(),
    routeName: raw.routeName ?? raw.route_name ?? "Rota do dia",
    address: raw.address ?? raw.endereco ?? "Endereço não informado",
    location:
      raw.location && raw.location.latitude && raw.location.longitude
        ? {
            latitude: Number(raw.location.latitude),
            longitude: Number(raw.location.longitude),
          }
        : undefined,
  };
}

export async function getBins(): Promise<Bin[]> {
  try {
    const response = await api.get("/bins");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapApiBin).sort((a, b) => b.level - a.level);
  } catch (error) {
    return [...mockState].sort((a, b) => b.level - a.level);
  }
}

export async function getBinById(id: string): Promise<Bin | null> {
  try {
    const response = await api.get(`/bins/${id}`);
    return mapApiBin(response.data);
  } catch (error) {
    return mockState.find((bin) => bin.id === id) ?? null;
  }
}

export async function markBinAsCollected(id: string): Promise<Bin | null> {
  try {
    const response = await api.patch(`/bins/${id}/collect`);
    return mapApiBin(response.data);
  } catch (error) {
    mockState = mockState.map((bin) =>
      bin.id === id
        ? {
            ...bin,
            level: 0,
            status: "collected",
            lastCollection: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : bin
    );

    return mockState.find((bin) => bin.id === id) ?? null;
  }
}
